import * as uuid from 'uuid';

import { Venue } from '../models/Venue';
import { VenueAccess } from '../dataLayer/venuesAccess';
import { CreateVenueRequest } from '../requests/CreateVenueRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('venuesBusinessLogic');

const venueAccess = new VenueAccess();


export async function createVenue(
	createVenueRequest: CreateVenueRequest,
	userId: string
): Promise<Venue> {

	logger.info('Entering Business Logic function createVenue');

	const venueId = uuid.v4();
	const timestamp = new Date().toISOString();
  
	const venue: Venue = {
		venueId: venueId,
		userId: userId,
		name: createVenueRequest.name,
		createdAt: timestamp
	};

	return await venueAccess.createVenue(venue);
}

export async function deleteVenue(userId: string, venueId: string): Promise<void> {

	logger.info('Entering Business Logic function deleteVenue');

	return await venueAccess.deleteVenue(userId, venueId);
}