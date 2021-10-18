import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {BehaviorSubject} from 'rxjs'
import {DialogService} from '../shared/services/dialog.service'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  portfolioSub = new BehaviorSubject<void>(undefined)

  constructor(private sessionQuery: SessionQuery,
              private dialogService: DialogService,
              private stablecoin: StablecoinService) {
  }
}
