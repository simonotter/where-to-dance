import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getToken, parseUserId } from '../../auth/utils';
import { CreateVenueRequest } from '../../requests/CreateVenueRequest';

import { createLogger } from '../../utils/logger';

const logger = createLogger('createVenue');

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
	logger.info('Processing event: ', { event: event });

	const newVenue: CreateVenueRequest = JSON.parse(event.body);

	// Get user id
	const authHeader = event.headers.Authorization;
	const jwtToken = getToken(authHeader);
	logger.info('jwtToken: ', { jwtToken: jwtToken });

	const userId = parseUserId(jwtToken);
	logger.info('userId: ', { userId: userId });

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: `Created Venue: ${newVenue} and User is: ${userId}`
		})
	};

};