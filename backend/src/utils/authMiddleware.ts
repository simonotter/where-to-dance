import { createLogger } from '../utils/logger';
import { getToken, parseUserId } from '../auth/utils';

export function authMiddy() {

	before: (handler, next) => {
		const logger = createLogger('authMiddy');
		logger.info(`Processing event ${JSON.stringify(handler.event)}`);
  
		const authHeader = handler.event.headers.Authorization;
		// This shouldn't happen, but catch the case where the Authorization
		// header is missing.
		if (typeof authHeader === 'undefined') {
			throw new Error('401 no_authorization_header');
		}
		// Get user id
		const jwtToken = getToken(authHeader);
		logger.info('jwtToken: ', { jwtToken: jwtToken });

		const userId = parseUserId(jwtToken);
		logger.info('userId: ', { userId: userId });

		// set userId on the header
		handler.event.headers.userId = userId;

		return next();
	};
};