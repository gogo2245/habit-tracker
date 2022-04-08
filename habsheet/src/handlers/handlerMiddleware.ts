import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'

export default (func: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>) =>
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const response = await func(event)
    if (typeof response === 'string') return response
    return {
      ...response,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  }
