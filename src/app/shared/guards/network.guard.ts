import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router'
import {combineLatest, Observable, of} from 'rxjs'
import {catchError, switchMap, take, tap} from 'rxjs/operators'
import {PreferenceQuery} from '../../preference/state/preference.query'
import {PreferenceStore} from '../../preference/state/preference.store'
import {ChainID, Networks} from '../networks'
import {StablecoinService} from '../services/blockchain/stablecoin.service'
import {SessionQuery} from '../../session/state/session.query'
import {SignerService} from '../services/signer.service'

@Injectable({
  providedIn: 'root',
})
export class NetworkGuard implements CanActivate {
  constructor(private preferenceQuery: PreferenceQuery,
              private preferenceStore: PreferenceStore,
              private sessionQuery: SessionQuery,
              private signerService: SignerService,
              private stablecoin: StablecoinService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!route.params.chainID) {
      return of(true)
    }

    return of(Number(route.params.chainID) as ChainID).pipe(
      tap((chainID: ChainID) => {
        if (chainID !== this.preferenceQuery.getValue().chainID) {
          this.preferenceStore.update({
            chainID: Networks[chainID as ChainID].chainID,
          })
        }
      }),
      switchMap(() => this.signerService.ensureNetwork),
      // this is needed to reload the latest issuer config
      switchMap(() => combineLatest([this.stablecoin.contract$]).pipe(take(1))),
      switchMap(() => of(true)),
      catchError(() => of(false)),
    )
  }
}
