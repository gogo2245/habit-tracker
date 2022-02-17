import type {AWS} from '@serverless/typescript'

const serverlessConfiguration: AWS = {
  service: 'habsheet',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline'],
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
    hello: {
      handler: 'src/handlers/hello.handler',
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/hello/{name}',
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
}

module.exports = serverlessConfiguration
