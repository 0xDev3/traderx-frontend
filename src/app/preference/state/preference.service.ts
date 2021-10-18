import {Injectable} from '@angular/core'
import {catchError, concatMap, take, timeout} from 'rxjs/operators'
import {AuthProvider, PreferenceStore} from './preference.store'
import {EMPTY, Observable, of} from 'rxjs'
import {PreferenceQuery} from './preference.query'
import {SignerService} from '../../shared/services/signer.service'
import {MetamaskSubsignerService} from '../../shared/services/subsigners/metamask-subsigner.service'
import {environment} from '../../../environments/environment'
import {MagicSubsignerService} from "../../shared/services/subsigners/magic-subsigner.service"

@Injectable({providedIn: 'root'})
export class PreferenceService {
  constructor(private preferenceStore: PreferenceStore,
              private preferenceQuery: PreferenceQuery,
              private metamaskSubsignerService: MetamaskSubsignerService,
              private magicSubsignerService: MagicSubsignerService,
              private signer: SignerService) {
  }

  initSigner(): Observable<unknown> {
    return this.preferenceQuery.select().pipe(
      take(1),
      concatMap(pref => {
        if (pref.address === '') {
          return EMPTY
        }
        switch (pref.authProvider) {
          case AuthProvider.METAMASK:
            return this.signer.login(this.metamaskSubsignerService, {force: false})
          case AuthProvider.MAGIC:
            return this.signer.login(this.magicSubsignerService, {force: false})
          default:
            return EMPTY
        }
      }),
      timeout(4000),
      catchError(() => {
        return this.signer.logout().pipe(concatMap(() => EMPTY))
      }),
    )
  }

  checkFixedConfig(): Observable<unknown> {
    return this.preferenceQuery.select().pipe(
      take(1),
      concatMap(pref => {
        const fixedChainID = environment.fixed.chainID
        const currentChainID = pref.chainID

        const chainIDMismatch = fixedChainID && (fixedChainID !== currentChainID)
        if (chainIDMismatch) {
          this.preferenceStore.update({
            chainID: fixedChainID,
          })
        }

        return of(undefined)
      }),
    )
  }
}
