import * as AWS  from 'aws-sdk';

import { createLogger } from '../utils/logger';

const logger = createLogger('fileAccess');

export class ImageAccess {

	constructor(
    private readonly s3: AWS.S3 = new AWS.S3({signatureVersion: 'v4'}),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration: number = Number(process.env.SIGNED_URL_EXPIRATION)
	) {}

	async getUploadUrl(imageId: string): Promise<string> {
		const result = this.s3.getSignedUrl('putObject', {
			Bucket: this.bucketName,
			Key: imageId,
			Expires: this.urlExpiration
		});

		logger.info('result', { result: result });

		return result;
	}
}
