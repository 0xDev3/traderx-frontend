import {Injectable} from '@angular/core'
import {NavigationExtras, Router} from '@angular/router'
import {environment} from '../../../environments/environment'
import {PreferenceQuery} from '../../preference/state/preference.query'
import {NetworkPathPipe} from '../pipes/issuer-path.pipe'

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(public router: Router,
              private preferenceQuery: PreferenceQuery,
              private networkPathPipe: NetworkPathPipe) {
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([this.networkPathPipe.transform(commands)], extras)
  }

  navigateNetwork(): Promise<boolean> {
    let path = ''

    if (!environment.fixed.chainID) {
      path = path.concat(`/${this.preferenceQuery.network.chainID}`)
    }

    return this.router.navigate([path])
  }
}
