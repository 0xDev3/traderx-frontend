import {ChangeDetectionStrategy, Component, OnInit, ɵmarkDirty} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms'
import {map, shareReplay, take, tap} from 'rxjs/operators'
import {combineLatest, Observable, of} from 'rxjs'
import {BigNumber} from 'ethers'
import {StablecoinService} from '../shared/services/blockchain/stablecoin.service'
import {BackendBrokerService, MarketDataItem} from '../shared/services/backend/backend-broker.service'
import {withStatus, WithStatus} from '../shared/utils/observables'
import {BuyService} from './buy.service'

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyComponent implements OnInit {
  id!: number
  buyForm!: FormGroup
  state$!: Observable<BuyState>
  stateWithStatus$!: Observable<WithStatus<BuyState>>

  constructor(private route: ActivatedRoute,
              private stablecoin: StablecoinService,
              private backendBrokerService: BackendBrokerService,
              private buyService: BuyService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.params.id)

    this.state$ = combineLatest([
      of(this.stablecoin.symbol),
      this.stablecoin.balance$,
      this.backendBrokerService.getMarketDataItem(this.id)
    ]).pipe(
      map(([stablecoin, stablecoinBalance, stock]) => ({stablecoin, stablecoinBalance, stock})),
      shareReplay(1)
    )
    this.stateWithStatus$ = withStatus(this.state$)

    this.buyForm = this.fb.group({
      stablecoinAmount: [''],
      stockAmount: [''],
    }, {
      asyncValidators: this.amountValidator.bind(this)
    })
  }

  private amountValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return combineLatest([this.state$]).pipe(take(1),
      map(([data]) => {
        const stablecoinAmount = this.stablecoin.parse(control.value.stablecoinAmount)
        const stockAmount = Number(control.value.stockAmount)

        if (stablecoinAmount.lte(0)) {
          return {stablecoinAmountNonPositive: true}
        } else if (stablecoinAmount.gt(data.stablecoinBalance)) {
          return {walletBalanceTooLow: true}
        } else if (stockAmount < 1) {
          return {stockAmountTooLow: true}
        }

        return null
      }),
      tap(() => ɵmarkDirty(this)),
    )
  }

  onStablecoinAmountChange() {
    const stablecoinAmount = this.buyForm.value.stablecoinAmount
    combineLatest([this.state$]).pipe(take(1),
      tap(([state]) => {
        this.buyForm.patchValue({stockAmount: stablecoinAmount / state.stock.price})
      })
    ).subscribe()
  }

  onStockAmountChange() {
    const stockAmount = this.buyForm.value.stockAmount
    combineLatest([this.state$]).pipe(take(1),
      tap(([state]) => {
        this.buyForm.patchValue({stablecoinAmount: stockAmount * state.stock.price})
      })
    ).subscribe()
  }

  floorAmount(amount: any) {
    return Math.floor(Number(amount))
  }

  isFractionalAmount(amount: any) {
    return Number(amount) != this.floorAmount(amount)
  }

  placeOrder() {
    const stablecoinAmount = this.stablecoin.parse(this.buyForm.value.stablecoinAmount)

    return this.buyService.placeOrder(this.id, stablecoinAmount)
  }
}

interface BuyState {
  stablecoin: string,
  stablecoinBalance: BigNumber,
  stock: MarketDataItem
}
