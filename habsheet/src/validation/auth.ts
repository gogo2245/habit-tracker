import * as yup from 'yup'

export const registerRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    username: yup
      .string()
      .required({username: 'IsRequired'})
      .typeError({username: 'IsRequired'})
      .min(4, {username: 'IsTooShort'}),
    email: yup.string().required({email: 'IsRequired'}).email({email: 'MustBeEmail'}).typeError({email: 'IsRequired'}),
    password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: {password: 'NotValid'}})
      .required({password: 'IsRequired'})
      .typeError({password: 'IsRequired'}),
  })

export const loginRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    email: yup.string().required({email: 'IsRequired'}).typeError({email: 'IsRequired'}),
    password: yup.string().required({password: 'IsRequired'}).typeError({password: 'IsRequired'}),
  })

export const updatePasswordRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    oldPassword: yup.string().required({oldPassword: 'IsRequired'}).typeError({oldPassword: 'IsRequired'}),
    newPassword: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: {newPassword: 'NotValid'}})
      .required({newPassword: 'IsRequired'})
      .typeError({newPassword: 'IsRequired'}),
  })

export const refreshTokenRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    refreshToken: yup.string().required({refreshToken: 'IsRequired'}).typeError({refreshToken: 'IsRequired'}),
  })
