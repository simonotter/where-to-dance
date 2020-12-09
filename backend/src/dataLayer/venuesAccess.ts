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
}