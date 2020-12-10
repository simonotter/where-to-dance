import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Venue } from '../models/Venue';

import { createLogger } from '../utils/logger';

const logger = createLogger('venuesDataAccess');

export class VenueAccess {
	constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly venuesTable = process.env.VENUES_TABLE
	) {}

	async createVenue(venue: Venue): Promise<Venue> {

		logger.info('Creating a venue', {
			venueId: venue.venueId
		});

		await this.docClient.put({
			TableName: this.venuesTable,
			Item: venue
		}).promise();

		return venue;
	}

	async deleteVenue(userId: string, venueId: string): Promise<string> {

		logger.info('Deleting a venue', {
			userId: userId,
			venueId: venueId,
		});

		await this.docClient.delete({
			TableName: this.venuesTable,
			Key: {
				userId: userId,
				todoId: venueId
			}
		}).promise();

		logger.info('Delete statement has completed without error');

		return 'nothing';
	}
}