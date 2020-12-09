import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Where to dance!',
			input: event,
		}, null, 2),
	};
};