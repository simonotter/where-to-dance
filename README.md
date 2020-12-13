# Serverless Where to Dance reference project
A simple application using AWS Lambda via the Serverless framework.

Serverless framework backend implements REST API and via AWS Lambdas and AWS API Gateway, Authentication using Auth0, AWS DynamoDB datastore and AWS S3 object store.

# Functionality of the application
This application allows creating/removing/updating/fetching Venue items. Each Venue item can optionally have an attachment image. Each user only has access to Venue items that he/she has created. Authentication provide via integration with Auth0 authentication service.

## Functions
* `Auth` - this function implements a custom authorizer for API Gateway that provides authentication for all other functions. It verifies an symmetrically encrypted JWT token.

* `GetVenues` - returns all Venues for the current user.

* `CreateVenue` - creates a new Venue for the current user. Request body is validated using a Request Validator in API Gateway.

* `UpdateVenue` - updates a Venue item created by the current user. Expects an id of a Venue item to remove. Request body is validated using a Request Validator in API Gateway.

* `DeleteVenue` - deletes a Venue item created by a current user. Expects an id of a Venue item to remove.

* `GenerateUploadUrl` - returns a time-limited, pre-signed URL that can be used to upload an attachment file for a Venue item. The file is stored in AWS S3 and a retrivable URL is stored with the Venue in the datastore.

# How to run the application
To deploy the application into AWS run the following commands:

## Backend
```bash
cd backend
npm install
serverless deploy -v
```
## Frontend
There is no frontend application. You must use Postman to execute the API endpoints.

## Using Postman
Import the *postman_collection.json* into Postman or click on the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/672c4b00b6ad213f2835)
### Authentication
All of the applications API endpoints require authorisation. You must generate a JWT from within the Postman collection.

1. From the collect, choose **Edit**.
2. Select the **Authorization** tab.
3. Ensure *Auth0 Token4* is selected in the *Token Name* in the *Configure New Token* section.
4. Scroll down to the bottom and select the **Get New Access Token** button.
5. Create an account on Auth0.
6. In the *Current Token* section, ensure *Auth0 Token4* is selected as the *Access Token*.
7. Select the **Update** button at the bottom of the modal window.