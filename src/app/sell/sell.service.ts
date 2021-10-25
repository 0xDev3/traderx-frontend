import {Injectable} from '@angular/core'
import {BigNumber} from 'ethers'
import {switchMap} from 'rxjs/operators'
import {of} from 'rxjs'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'
import {PreferenceQuery} from '../preference/state/preference.query'
import {OrderBookService} from '../shared/services/blockchain/order-book.service'
import {DialogService} from '../shared/services/dialog.service'
import {RouterService} from '../shared/services/router.service'
import {BackendBrokerService} from '../shared/services/backend/backend-broker.service'
import {StockService} from '../shared/services/blockchain/stock.service'

@Injectable({
  providedIn: 'root'
})
export class SellService {
  constructor(
    private preferenceQuery: PreferenceQuery,
    private stablecoin: StablecoinService,
    private orderBookService: OrderBookService,
    private stockService: StockService,
    private backendBrokerService: BackendBrokerService,
    private dialogService: DialogService,
    private router: RouterService,
  ) {
  }

  placeOrder(data: PlaceOrderData) {
    return this.orderBookService.getStockAddress(data.stockId).pipe(
      switchMap(stockAddress => this.stockService.getAllowance(stockAddress).pipe(
        switchMap(allowance => allowance.lt(data.stockAmount) ?
          this.approveAmount(stockAddress, data.stockAmount) : of(allowance)
        ),
        switchMap(() => this.orderBookService.createSellOrder(data.stockId, data.stockAmount)),
        switchMap(() => this.dialogService.success('Order created successfully!')),
        switchMap(() => this.router.navigate(['/portfolio']))
      )),
    )
  }

  private approveAmount(stockAddress: string, amount: BigNumber) {
    return this.stockService.approveAmount(stockAddress, amount)
  }
}

export interface PlaceOrderData {
  stockId: number,
  stockAmount: BigNumber,
  stockTicker: string,
  stockName: string,
}
