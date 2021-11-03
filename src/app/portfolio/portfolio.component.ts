import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {WithStatus, withStatus} from '../shared/utils/observables'
import {SignerService} from '../shared/services/signer.service'
import {BackendBrokerService, ItemExtended} from '../shared/services/backend/backend-broker.service'
import {Order, OrderBookService, OrderType, PortfolioItem} from '../shared/services/blockchain/order-book.service'
import {switchMap} from 'rxjs/operators'
import {Observable} from 'rxjs'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  orderType = OrderType

  pending$: Observable<WithStatus<ItemExtended<Order>[]>> = withStatus(
    this.orderBookService.pending$.pipe(
      switchMap(portfolio => this.backendBrokerService.extendPending(portfolio)),
    )
  )

  portfolio$: Observable<WithStatus<ItemExtended<PortfolioItem>[]>> = withStatus(
    this.orderBookService.portfolio$.pipe(
      switchMap(portfolio => this.backendBrokerService.extendPortfolio(portfolio)),
    )
  )

  constructor(
    private sessionQuery: SessionQuery,
    private signerService: SignerService,
    private orderBookService: OrderBookService,
    private backendBrokerService: BackendBrokerService
  ) {
  }
}
