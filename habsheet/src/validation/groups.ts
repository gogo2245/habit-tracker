import {GroupRole} from 'src/types/database'
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
    email: yup.string().required({email: 'IsRequired'}).typeError({email: 'IsRequired'}).email({email: 'MustBeEmail'}),
    groupID: yup.string().required({groupID: 'IsRequired'}).typeError({groupID: 'IsRequired'}),
  })

export const manageGroupUserRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    userID: yup.string().required({userID: 'IsRequired'}).typeError({userID: 'IsRequired'}),
    role: yup
      .number()
      .test(
        'role',
        {role: 'ValueNotAllowed'},
        (item) => item === GroupRole.habitManager || item === GroupRole.member || item === -1,
      )
      .required({role: 'IsRequired'})
      .typeError({role: 'IsRequired'}),
  })
