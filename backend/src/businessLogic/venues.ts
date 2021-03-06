import * as uuid from 'uuid';

import { Venue } from '../models/Venue';
import { VenueAccess } from '../dataLayer/venuesAccess';
import { ImageAccess } from '../dataLayer/fileAccess';
import { CreateVenueRequest } from '../requests/CreateVenueRequest';
import { UpdateVenueRequest } from '../requests/UpdateVenueRequest';

import { createLogger } from '../utils/logger';
import { VenueUpdate } from '../models/VenueUpdate';

const logger = createLogger('venuesBusinessLogic');

const venueAccess = new VenueAccess();
const imageAccess = new ImageAccess();

export async function getUrl(venueId: string, userId: string): Promise<string> {
	// Get pre-signed URL from filestore
	const url = await imageAccess.getUploadUrl(venueId);
	logger.info('url', { url: url });

	// Write final url to datastore
	await venueAccess.updateVenueUrl(venueId, userId);
	return url;
}

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

export async function getUsersVenues(userId: string): Promise<Venue[]> {
	
	logger.info('Entering Business Logic function getMyVenues');

	return await venueAccess.getUsersVenues(userId);
}

export async function updateVenue(
	userId: string,
	venue: UpdateVenueRequest,
	venueId: string): Promise<Venue> {
	
	logger.info('Entering Business Logic function updateVenue');

	const updatedVenue: VenueUpdate = {
		name: venue.name
	};

	return await venueAccess.updateVenue(userId, updatedVenue, venueId);
}