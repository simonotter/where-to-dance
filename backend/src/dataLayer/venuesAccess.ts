import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Venue } from '../models/Venue';
import { VenueUpdate } from '../models/VenueUpdate';


import { createLogger } from '../utils/logger';

const logger = createLogger('venuesDataAccess');

export class VenueAccess {
	constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
		private readonly venuesTable = process.env.VENUES_TABLE,
		private readonly bucketName = process.env.IMAGES_S3_BUCKET,
	) {}

	async updateVenue(userId: string, venue: VenueUpdate, venueId: string): Promise<Venue> {
		logger.info('Updating a venue', {
			venueId: venueId,
			userId: userId
		});

		const params = {
			TableName: this.venuesTable,
			Key: {
				userId: userId,
				venueId: venueId
			},
			ExpressionAttributeNames: {
				'#venue_name': 'name',
			},
			ExpressionAttributeValues: {
				':name': venue.name,
			},
			UpdateExpression: 'SET #venue_name = :name',
			ReturnValues: 'ALL_NEW',
		};

		const result = await this.docClient.update(params).promise();

		logger.info('Update statement has completed without error', { result: result });

		return result.Attributes as Venue;
	}

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

	async deleteVenue(userId: string, venueId: string): Promise<void> {

		logger.info('Deleting a venue', {
			userId: userId,
			venueId: venueId,
		});

		const result = await this.docClient.delete({
			TableName: this.venuesTable,
			Key: {
				userId: userId,
				venueId: venueId
			}
		}).promise();

		logger.info('Delete statement has completed without error',{
			result: result
		});

	}

	async getUsersVenues(userId: string): Promise<Venue[]> {
		logger.info('Getting user\'s venues', {
			userId: userId,
		});

		const params: AWS.DynamoDB.DocumentClient.QueryInput = {
			TableName: this.venuesTable,
			KeyConditionExpression: '#userId =:i',
			ExpressionAttributeNames: {
				'#userId': 'userId'
			},
			ExpressionAttributeValues: {
				':i': userId
			}
		};

		const result = await this.docClient.query(params).promise();

		const items = result.Items;

		return items as Venue[];
	}

	async updateVenueUrl(venueId: string, userId: string): Promise<Venue> {
		logger.info('Updating a venues\'s URL for item:', {
			venueId: venueId,
			userId: userId
		});

		const url = `https://${this.bucketName}.s3.amazonaws.com/${venueId}`;

		const params = {
			TableName: this.venuesTable,
			Key: {
				userId: userId,
				venueId: venueId
			},
			ExpressionAttributeNames: {
				'#venue_attachmentUrl': 'attachmentUrl'
			},
			ExpressionAttributeValues: {
				':attachmentUrl': url
			},
			UpdateExpression: 'SET #venue_attachmentUrl = :attachmentUrl',
			ReturnValues: 'ALL_NEW',
		};

		const result = await this.docClient.update(params).promise();

		logger.info('Update statement has completed without error', { result: result });

		return result.Attributes as Venue;
	}
}