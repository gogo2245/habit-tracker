import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'
import * as _ from 'lodash'
import {validateAndRefreshTokens} from 'src/utils/token'

const ssm = new SSM()

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const [, token] = _.split(event.headers.Authorization || event.headers.authorization, ' ')
  const tokens = await validateAndRefreshTokens(token, ssm)
  if (!tokens)
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'InvalidOrExpiredToken'}),
    }
  return {
    statusCode: 200,
    body: JSON.stringify({...tokens, message: 'SuccessfullyRefreshed'}),
  }
}
