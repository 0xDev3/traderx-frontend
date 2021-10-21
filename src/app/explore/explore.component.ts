import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {SignerService} from '../shared/services/signer.service'
import {switchMap} from 'rxjs/operators'
import {DialogService} from '../shared/services/dialog.service'
import {BackendBrokerService} from '../shared/services/backend/backend-broker.service'
import {withStatus} from '../shared/utils/observables'

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreComponent {
  marketData$ = withStatus(this.backendBrokerService.getMarketData())

  constructor(private sessionQuery: SessionQuery,
              private signerService: SignerService,
              private backendBrokerService: BackendBrokerService,
              private dialogService: DialogService) {
  }

  signMessage() {
    return this.signerService.signMessage('Hello there!').pipe(
      switchMap(res => this.dialogService.success(`Successfully signed the message with result: ${res}`))
    )
  }
}
