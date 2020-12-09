import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';

import { verify, decode } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../auth/utils';
// const axios = require('axios');  // Maybe use fetch instead of Axios
import { Jwt } from '../../auth/Jwt';
import { JwtPayload } from '../../auth/JwtPayload';

// TODO: Retrieve certificate
//
// See Auth0 article: https://auth0.com/blog/navigating-rs256-and-jwks/#Retrieving-the-JWK
//
// const jwksUrl = 'https://dev--otter.eu.auth0.com/.well-known/jwks.json'

// async function getCert() {
//   let cert = await axios.get(jwksUrl);
//   console.log(cert.data.keys[0].x5c[0]);
// }

// const certificate = getCert() as String;

const certificate = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJanBQg55IydrgMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF2Rldi0tb3R0ZXIuZXUuYXV0aDAuY29tMB4XDTIwMTEyNjE3MzgxM1oXDTM0
MDgwNTE3MzgxM1owIjEgMB4GA1UEAxMXZGV2LS1vdHRlci5ldS5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+7ACw35TBQHSZ7/uLXENG
LZJKyynwVLJQl7fEFsz7tiGBLU2sL5PrXrdh5PYNBuaoJbNGg+/rRiA/p+xq7Kte
Gqaae/AKplO88b3AQ54y4fNJ/G78A9pYm7zgST4RaYpHGuNskX1Du0/Bahqp8veD
3Ibom1Dk20JpdwleYAHL1QgkE3V3gOFEVhBvWGCOyfM4rvxhqH4RZTpJaFLm4tQz
slh1Mo85TKs1y0H+SIGkJ9Q5GphaL9rbFpTJiaiEOBqrJzSfBwG1svPTI8ofVsKM
XYfyOePB3NzHAl4yQSQ2Ut61pRDnSB1LauIn4ZwM1//F3NaCpR2pOD/NWqzOIuKn
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFHxzoANUKgXhviLZ
JHMkltDyGVaSMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAPVNJ
+zjQ4KvrXZQYTC5+d3CXpYZZ0DTLJmxCLKZyYoMjvFulkZdOqGq/yfNyFOf6PqBy
UJPfPipUuhY2aNeK79yf+hzBRE7ISKIawT4MWmMjiiPZQs3h48ML0KgQ6u3nrEfy
9fIuCeWaL23wZnfQ2q7W51AO0Oqph4xSysho+kQbhkGGmuAuH9kLMb6KSgtuV8dh
VO03KDrLI5uAaMy2UB+z0CRUGFDHrx1Axy2crLDabsnREn0R0c3k4GrmgrsN+oAa
VJR4XwDUJNY6sZLsNrmN7RGc2UV32qHZ3icmin/3fh/e0BM07RYTX6v8ijHTaMiY
3U7QJzTFKVjCop5hUg==
-----END CERTIFICATE-----`;

const logger = createLogger('auth');


export const handler = async (
	event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
	logger.info('Authorizing a user', {authoriztionToken: event.authorizationToken});
	try {
		const jwtToken = await verifyToken(event.authorizationToken);
		logger.info('User was authorized', {jwtToken: jwtToken});

		return {
			principalId: jwtToken.sub,
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Allow',
						Resource: '*'
					}
				]
			}
		};
	} catch (e) {
		logger.error('User not authorized', { error: e.message });

		return {
			principalId: 'user',
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Deny',
						Resource: '*'
					}
				]
			}
		};
	}
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
	const token = getToken(authHeader);

	// What is the purpose of this line? It doesn't seem necessary
	const jwt: Jwt = decode(token, { complete: true }) as Jwt;
	logger.info('jwt', { jwt: jwt });

	return verify(
		token,
		certificate,
		{ algorithms: ['RS256']}
	) as JwtPayload;

}


