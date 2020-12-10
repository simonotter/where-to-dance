import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getToken, parseUserId } from '../../auth/utils';
import { deleteVenue } from '../../businessLogic/venues';
import { createLogger } from '../../utils/logger';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('deleteVenue');

export const handler = middy(async (
	event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	const venueId = event.pathParameters.venueId;
  
	logger.info('Processing event: ', { event: event });

	// Get user id
	const authHeader = event.headers.Authorization;
	const jwtToken = getToken(authHeader);
	logger.info('jwtToken: ', { jwtToken: jwtToken });

	const userId = parseUserId(jwtToken);
	logger.info('userId: ', { userId: userId });
	// TODO move user extraction to middy middleware

	// Delete Venue Item
	try {
		await deleteVenue(userId, venueId);
		

		return {
			statusCode: 204,
			body: ''
		};

	} catch (e) {

		return {
			statusCode: 404,
			body: `error ${e}`
		};
	}

	

});

handler.use(
	cors({
		credentials: true
	})
);
