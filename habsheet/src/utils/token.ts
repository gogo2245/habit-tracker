import {SSM} from 'aws-sdk'
import * as jwt from 'jsonwebtoken'
import {TokenResponse} from 'src/types/token'
import {getSecret} from './secret'

export const generateTokens = async (pk: string, ssm: SSM): Promise<TokenResponse> => {
  const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
  const accessToken = jwt.sign({pk, type: 'accessToken'}, secret, {expiresIn: '1h', algorithm: 'RS256'})
  const refreshToken = jwt.sign({pk, type: 'refreshToken'}, secret, {expiresIn: '1w', algorithm: 'RS256'})
  return {accessToken, refreshToken}
}
