import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getToken, parseUserId } from '../../auth/utils';
import { updateVenue } from '../../businessLogic/venues';
import { Venue } from '../../models/Venue';
import { UpdateVenueRequest } from '../../requests/UpdateVenueRequest';
import { createLogger } from '../../utils/logger';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('updateVenue');

export const handler = middy(async (
	event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	logger.info('Processing event: ', { event: event });

	const venueId = event.pathParameters.venueId;
	const venueUpdate: UpdateVenueRequest = JSON.parse(event.body);



	// Get user id
	const authHeader = event.headers.Authorization;
	const jwtToken = getToken(authHeader);
	logger.info('jwtToken: ', { jwtToken: jwtToken });

	const userId = parseUserId(jwtToken);
	logger.info('userId: ', { userId: userId });
	// TODO move user extraction to middy middleware

	// Update Venue Item
	try {
		const updatedVenue: Venue = await updateVenue(userId, venueUpdate, venueId);
		logger.info('updatedVenue: ', { updatedVenue: updatedVenue });


		return {
			statusCode: 204,
			body: JSON.stringify({
				updatedVenue
			})
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
