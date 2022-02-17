import {APIGatewayProxyEventV2} from 'aws-lambda'

export const handler = (event: APIGatewayProxyEventV2): unknown =>
  Promise.resolve(`Hello, ${event.pathParameters.name || 'World'}!`)
