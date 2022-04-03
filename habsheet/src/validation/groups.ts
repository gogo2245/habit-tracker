import * as yup from 'yup'

export const createGroupRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    name: yup.string().required({name: 'IsRequired'}).typeError({name: 'IsRequired'}).min(4, {name: 'IsTooShort'}),
    description: yup.string().optional().min(4, {description: 'IsTooShort'}),
  })
