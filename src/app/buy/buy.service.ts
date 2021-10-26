import {Injectable} from '@angular/core'
import {BigNumber} from 'ethers'
import {switchMap} from 'rxjs/operators'
import {Observable, of} from 'rxjs'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'
import {PreferenceQuery} from '../preference/state/preference.query'
import {OrderBookService} from '../shared/services/blockchain/order-book.service'
import {DialogService} from '../shared/services/dialog.service'
import {RouterService} from '../shared/services/router.service'

@Injectable({
  providedIn: 'root'
})
export class BuyService {
  constructor(
    private preferenceQuery: PreferenceQuery,
    private stablecoin: StablecoinService,
    private orderBookService: OrderBookService,
    private dialogService: DialogService,
    private router: RouterService,
  ) {
  }

  placeOrder(stock: PlaceOrderData) {
    return this.getAllowance.pipe(
      switchMap(allowance => allowance.lt(stock.amount) ?
        this.approveAmount(stock.amount) : of(allowance)
      ),
      switchMap(() => this.orderBookService.createBuyOrder(stock, stock.amount)),
      switchMap(() => this.dialogService.success('Order created successfully!')),
      switchMap(() => this.router.navigate(['/portfolio']))
    )
  }

  private get getAllowance(): Observable<BigNumber> {
    return this.stablecoin.getAllowance(this.preferenceQuery.network.orderBook)
  }

  private approveAmount(amount: BigNumber) {
    return this.stablecoin.approveAmount(
      this.preferenceQuery.network.orderBook, amount,
    )
  }
}

interface PlaceOrderData {
  stockId: string
  stockName: string
  stockSymbol: string
  amount: BigNumber
}
