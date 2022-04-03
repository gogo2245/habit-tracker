import {SSM} from 'aws-sdk'
import * as _ from 'lodash'
import * as jwt from 'jsonwebtoken'
import {TokenError, TokenResponse, UserInfo} from 'src/types/auth'
import {getSecret} from './secret'

export const generateTokens = async (id: string, ssm: SSM): Promise<TokenResponse> => {
  const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
  const accessToken = jwt.sign({id, type: 'accessToken'}, secret, {expiresIn: '1h', algorithm: 'RS256'})
  const refreshToken = jwt.sign({id, type: 'refreshToken'}, secret, {expiresIn: '1w', algorithm: 'RS256'})
  return {accessToken, refreshToken}
}

export const isTokenError = (obj: unknown): obj is TokenError =>
  obj && (obj as TokenError).errorMessage !== undefined && typeof (obj as TokenError).errorMessage === 'string'

export const validateToken = async (headers: Record<string, string>, ssm: SSM): Promise<UserInfo | TokenError> => {
  try {
    const [, token] = _.split(headers.Authorization || headers.authorization, ' ')
    const decoded = jwt.decode(token, {complete: true})
    if (!decoded || typeof decoded === 'string')
      return {
        errorMessage: 'InvalidToken',
      }
    const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
    const verified = jwt.verify(token, secret, {algorithms: ['RS256']})
    if (!verified || typeof verified === 'string')
      return {
        errorMessage: 'InvalidToken',
      }
    if (verified.type !== 'accessToken')
      return {
        errorMessage: 'InvalidToken',
      }
    return {id: verified.id}
  } catch (e) {
    if (e.name === 'TokenExpiredError')
      return {
        errorMessage: 'TokenExpired',
      }
    return {
      errorMessage: 'InvalidToken',
    }
  }
}

export const validateAndRefreshTokens = async (refreshToken: string, ssm: SSM): Promise<TokenResponse | undefined> => {
  try {
    const decoded = jwt.decode(refreshToken, {complete: true})
    if (!decoded || typeof decoded === 'string') return
    const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
    const verified = jwt.verify(refreshToken, secret, {algorithms: ['RS256']})
    if (!verified || typeof verified === 'string') return
    if (verified.type !== 'refreshToken') return
    return generateTokens(verified.id, ssm)
  } catch (e) {
    return
  }
}
