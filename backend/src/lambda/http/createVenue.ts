import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getToken, parseUserId } from '../../auth/utils';
import { createVenue } from '../../businessLogic/venues';
import { Venue } from '../../models/Venue';
import { CreateVenueRequest } from '../../requests/CreateVenueRequest';
import { createLogger } from '../../utils/logger';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('createVenue');

export const handler = middy(async (
	event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
	logger.info('Processing event: ', { event: event });

	const newVenue: CreateVenueRequest = JSON.parse(event.body);

	// Get user id
	const authHeader = event.headers.Authorization;
	const jwtToken = getToken(authHeader);
	logger.info('jwtToken: ', { jwtToken: jwtToken });

	const userId = parseUserId(jwtToken);
	logger.info('userId: ', { userId: userId });
	// TODO move user extraction to middy middleware

	// Create Venue Item
	const item: Venue = await createVenue(newVenue, userId);

	return {
		statusCode: 200,
		body: JSON.stringify({
			item
		})
	};

});

handler.use(
	cors({
		credentials: true
	})
);
