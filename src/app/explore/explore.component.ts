import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from "../session/state/session.query"
import {SignerService} from "../shared/services/signer.service"
import {switchMap} from "rxjs/operators"
import {DialogService} from "../shared/services/dialog.service"

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreComponent {
  constructor(private sessionQuery: SessionQuery,
              private signerService: SignerService,
              private dialogService: DialogService) {
  }

  signMessage() {
    return this.signerService.signMessage('Hello there!').pipe(
      switchMap(res => this.dialogService.success(`Successfully signed the message with result: ${res}`))
    )
  }
}
