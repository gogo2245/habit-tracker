import type {AWS} from '@serverless/typescript'

const serverlessConfiguration: AWS = {
  service: 'habsheet',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    logRetentionInDays: 30,
    versionFunctions: false,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    register: {
      handler: 'src/handlers/register.handler',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem', 'dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users/index/emailIndex`,
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/auth/register',
          },
        },
      ],
    },
  },
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      DDBUsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'habsheet-users',
          AttributeDefinitions: [
            {
              AttributeName: 'pk',
              AttributeType: 'S',
            },
            {
              AttributeName: 'email',
              AttributeType: 'S',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'emailIndex',
              KeySchema: [
                {
                  AttributeName: 'email',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'KEYS_ONLY',
              },
            },
          ],
          KeySchema: [
            {
              AttributeName: 'pk',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          Tags: [
            {
              Key: 'BackupPlan',
              Value: 'Standard',
            },
          ],
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
