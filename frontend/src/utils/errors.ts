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
    default:
      return 'S týmto vstupom niečo nie je v poriadku'
  }
}
