import {ChangeDetectionStrategy, Component, OnInit, ɵmarkDirty} from '@angular/core'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms'
import {combineLatest, Observable} from 'rxjs'
import {withStatus, WithStatus} from '../shared/utils/observables'
import {BigNumber} from 'ethers'
import {BackendBrokerService, MarketDataItem} from '../shared/services/backend/backend-broker.service'
import {ActivatedRoute} from '@angular/router'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators'
import {SellService} from './sell.service'
import {StockService} from '../shared/services/blockchain/stock.service'
import {OrderBookService} from '../shared/services/blockchain/order-book.service'
import {parseUnits} from 'ethers/lib/utils'

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellComponent implements OnInit {
  id!: number
  sellForm!: FormGroup
  state$!: Observable<SellState>
  stateWithStatus$!: Observable<WithStatus<SellState>>

  constructor(private route: ActivatedRoute,
              private stablecoin: StablecoinService,
              private orderBookService: OrderBookService,
              private stockService: StockService,
              private backendBrokerService: BackendBrokerService,
              private sellService: SellService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.params.id)

    this.state$ = combineLatest([
      this.orderBookService.getStockAddress(String(this.id)).pipe(
        switchMap(stockAddress => this.stockService.balance(stockAddress))
      ),
      this.backendBrokerService.getMarketDataItem(String(this.id))
    ]).pipe(
      map(([stockBalance, stock]) => ({stockBalance, stock})),
      shareReplay(1)
    )
    this.stateWithStatus$ = withStatus(this.state$)

    this.sellForm = this.fb.group({
      stockAmount: [''],
    }, {
      asyncValidators: this.amountValidator.bind(this)
    })
  }

  private amountValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return combineLatest([this.state$]).pipe(take(1),
      map(([data]) => {
        const stockAmount = Number(control.value.stockAmount)

        if (stockAmount < 1) {
          return {stockAmountTooLow: true}
        } else if (data.stockBalance.lt(parseUnits(stockAmount.toString()))) {
          return {overBalance: true}
        } else if (stockAmount !== Math.floor(stockAmount)) {
          return {fractionalNotAllowed: true}
        }

        return null
      }),
      tap(() => ɵmarkDirty(this)),
    )
  }

  stablecoinAmount(state: SellState): number {
    return state.stock.price * this.sellForm.value.stockAmount
  }

  placeOrder(state: SellState) {
    return () => {
      const stockAmount = this.stablecoin.parse(this.sellForm.value.stockAmount, 18)

      return this.sellService.placeOrder({
        stockId: String(this.id),
        stockName: state.stock.name,
        stockSymbol: state.stock.symbol,
        amount: stockAmount,
      })
    }
  }
}

interface SellState {
  stockBalance: BigNumber,
  stock: MarketDataItem,
}
