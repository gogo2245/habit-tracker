import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {listGroupsByUserID} from 'src/database/groups'
import {isTokenError, validateToken} from 'src/utils/token'

const ssm = new SSM()

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const userInfo = await validateToken(event.headers, ssm)
  if (isTokenError(userInfo))
    return {
      body: JSON.stringify({
        message: userInfo.errorMessage,
      }),
      statusCode: 401,
    }
  const groups = await listGroupsByUserID(userInfo.id)
  return {
    body: JSON.stringify({
      message: 'GroupsSuccessfullyListed',
      groups,
    }),
    statusCode: 200,
  }
}
