import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: 'where-to-dance'//{
    // name: 'where-to-dance',
    // app and org for use with dashboard.serverless.com
    // app: where-to-dance
    // org: otterdev
  // }
  ,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    hello: {
      handler: 'src/lambda/http/hellowheretodance.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
