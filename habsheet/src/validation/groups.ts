import * as yup from 'yup'

export const createGroupRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    name: yup.string().required({name: 'IsRequired'}).typeError({name: 'IsRequired'}).min(4, {name: 'IsTooShort'}),
    description: yup.string().optional().min(4, {description: 'IsTooShort'}),
  })

export const inviteMemberRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    email: yup.string().required({email: 'IsRequired'}).typeError({name: 'IsRequired'}).email({email: 'MustBeEmail'}),
    groupID: yup.string().required({groupID: 'IsRequired'}).typeError({groupID: 'IsRequired'}),
  })
