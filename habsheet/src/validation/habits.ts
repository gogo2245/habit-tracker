import {HabitInterval} from 'src/types/database'
import * as yup from 'yup'

export const addHabitRequestSchema = yup
  .object()
  .required({general: 'RequestBodyIsRequired'})
  .typeError({general: 'RequestBodyIsRequired'})
  .shape({
    name: yup.string().required({name: 'IsRequired'}).typeError({name: 'IsRequired'}).min(4, {name: 'IsTooShort'}),
    description: yup.string().optional().min(4, {description: 'IsTooShort'}),
    repetition: yup
      .number()
      .integer({repetition: 'MustBeInteger'})
      .required({repetition: 'IsRequired'})
      .typeError({repetition: 'IsRequired'})
      .min(1, {repetition: 'TooShort'})
      .max(10, {repetition: 'TooLong'}),
    interval: yup
      .number()
      .test(
        'interval',
        {interval: 'ValueNotAllowed'},
        (item) => item === HabitInterval.daily || item === HabitInterval.monthly || item === HabitInterval.weekly,
      )
      .required({interval: 'IsRequired'})
      .typeError({interval: 'IsRequired'}),
  })
