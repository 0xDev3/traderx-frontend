import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {MetamaskSubsignerService} from '../../services/subsigners/metamask-subsigner.service'
import {SignerService} from '../../services/signer.service'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {SessionQuery} from '../../../session/state/session.query'
import {providers} from 'ethers'
import {getWindow} from '../../utils/browser'

@Component({
  selector: 'app-add-to-metamask',
  templateUrl: './add-to-metamask.component.html',
  styleUrls: ['./add-to-metamask.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToMetamaskComponent {
  @Input() value = ''

  isAvailable$: Observable<boolean> = this.signer.injectedWeb3$.pipe(
    map(ethereum => !!ethereum.isMetaMask)
  )

  constructor(
    private preferenceQuery: PreferenceQuery,
    private sessionQuery: SessionQuery,
    private signer: SignerService,
    private metamaskSubsignerService: MetamaskSubsignerService,
  ) {
  }

  watchAsset() {
    const signer = new providers.Web3Provider(getWindow()?.ethereum, 'any').getSigner()
    this.metamaskSubsignerService.watchAsset(signer, this.value).subscribe()
  }
}
