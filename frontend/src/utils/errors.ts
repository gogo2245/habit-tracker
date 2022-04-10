import _ from 'lodash'
import {ApiError} from '../types/api'

export const isApiError = <T>(obj: unknown): obj is ApiError<T> =>
  !!(obj && (obj as ApiError<T>).response && (obj as ApiError<T>).response.data)

export const simplifyErrors = (errors: Record<string, string>[]): Record<string, string> =>
  _(errors)
    .map((name) => ({name: _.keys(name)[0], value: name[_.keys(name)[0]]}))
    .keyBy('name')
    .mapValues(({value}) => value)
    .value()

export const translateError = (error: string): string => {
  switch (error) {
    case 'IsRequired':
      return 'Tento vstup musí byť vyplnený'
    case 'MustBeEmail':
      return 'Tento vstup musí byť email'
    case 'NotValid':
      return 'Heslo musí obsahovať aspoň 8 znakov, veľké písmená, malé pismená, číslo a špeciálny znak'
    case 'IsTooShort':
      return 'Tento vstup musí obsahovať aspoň 4 znaky'
    case 'AlreadyUsed':
      return 'Tento email sa už používa'
    case 'AlreadyMember':
      return 'Tento užívateľ už je člen skupiny alebo pozvaný'
    case 'DoesNotExist':
      return 'Tento užívateľ nemá vytvorený profil'
    default:
      return 'S týmto vstupom niečo nie je v poriadku'
  }
}
