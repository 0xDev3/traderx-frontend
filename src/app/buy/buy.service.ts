import {Injectable} from '@angular/core'
import {BigNumber} from 'ethers'
import {switchMap} from 'rxjs/operators'
import {Observable, of} from 'rxjs'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'
import {PreferenceQuery} from '../preference/state/preference.query'
import {OrderBookService} from '../shared/services/blockchain/order-book.service'

@Injectable({
  providedIn: 'root'
})
export class BuyService {
  constructor(
    private preferenceQuery: PreferenceQuery,
    private stablecoin: StablecoinService,
    private orderBookService: OrderBookService,
  ) {
  }

  placeOrder(stockId: number, stablecoinAmount: BigNumber) {
    return this.getAllowance.pipe(
      switchMap(allowance => allowance.lt(stablecoinAmount) ?
        this.approveAmount(stablecoinAmount) : of(allowance)
      ),
      // switchMap(() => this.orderBookService.createBuyOrder(stockId, stablecoinAmount))
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
