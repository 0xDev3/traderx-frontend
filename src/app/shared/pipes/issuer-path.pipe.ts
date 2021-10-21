import {Pipe, PipeTransform} from '@angular/core'
import {PreferenceQuery} from '../../preference/state/preference.query'
import {environment} from '../../../environments/environment'

@Pipe({
  name: 'networkPath',
})
export class NetworkPathPipe implements PipeTransform {
  constructor(private preferenceQuery: PreferenceQuery) {
  }

  public transform(value: any): any {
    let path: string
    if (value === null || value === undefined) {
      return ''
    }

    path = Array.isArray(value) ? value.join('/') : String(value)

    if (path.startsWith('/')) {
      if (!environment.fixed.chainID) {
        path = `/${this.preferenceQuery.network.chainID}`.concat(path)
      }
    }

    return path
  }
}
