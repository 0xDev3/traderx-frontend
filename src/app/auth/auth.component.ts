import {ChangeDetectionStrategy, Component, Optional} from '@angular/core'
import {defer, Observable, of} from 'rxjs'
import {tap} from 'rxjs/operators'
import {PreferenceQuery} from '../preference/state/preference.query'
import {PreferenceStore} from '../preference/state/preference.store'
import {SignerService} from '../shared/services/signer.service'
import {MetamaskSubsignerService} from '../shared/services/subsigners/metamask-subsigner.service'
import {MatDialogRef} from '@angular/material/dialog'
import {RouterService} from '../shared/services/router.service'
import {getWindow} from '../shared/utils/browser'
import {MagicSubsignerService} from "../shared/services/subsigners/magic-subsigner.service"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  injectedWeb3$: Observable<any> = defer(() => of(getWindow()?.ethereum))

  constructor(private signer: SignerService,
              private preferenceStore: PreferenceStore,
              private metamaskSubsignerService: MetamaskSubsignerService,
              private magicSubsignerService: MagicSubsignerService,
              private preferenceQuery: PreferenceQuery,
              private router: RouterService,
              @Optional() private dialogRef: MatDialogRef<AuthComponent>) {
  }

  afterLoginActions() {
    this.dialogRef.close(true)
  }

  connectMetamask(): Observable<unknown> {
    return this.signer.login(this.metamaskSubsignerService).pipe(
      tap(() => this.afterLoginActions()),
    )
  }

  connectMagic(): Observable<unknown> {
    return this.signer.login(this.magicSubsignerService).pipe(
      tap(() => this.afterLoginActions()),
    )
  }
}
