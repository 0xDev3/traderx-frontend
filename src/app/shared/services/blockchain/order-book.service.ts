import {Injectable} from '@angular/core'
import {combineLatest, from, merge, Observable, of} from 'rxjs'
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators'
import {OrderBook, OrderBook__factory} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {BigNumber} from 'ethers'
import {SignerService} from '../signer.service'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'
import {contractEvent} from '../../utils/ethersjs'

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  contract$: Observable<OrderBook> = combineLatest([
    this.sessionQuery.provider$,
  ]).pipe(
    distinctUntilChanged(),
    map(([provider]) => OrderBook__factory.connect(this.preferenceQuery.network.orderBook, provider)),
  )

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private signerService: SignerService,
              private dialogService: DialogService,
              private gasService: GasService) {
  }

  createBuyOrder(stock: Stock, stablecoinAmount: BigNumber): Observable<unknown> {
    return combineLatest([
      this.contract$,
      this.signerService.ensureAuth,
    ]).pipe(
      map(([contract, signer]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) =>
        contract.populateTransaction.createBuyOrder({
          stockId: stock.stockId,
          stockSymbol: stock.stockSymbol,
          stockName: stock.stockName,
          amount: stablecoinAmount,
        }, overrides),
      ),
      switchMap(tx => this.signerService.sendTransaction(tx)),
      switchMap(tx => this.dialogService.loading(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
        'Processing transaction...',
      )),
    )
  }

  createSellOrder(stock: Stock, stockAmount: BigNumber): Observable<unknown> {
    return combineLatest([
      this.contract$,
      this.signerService.ensureAuth,
    ]).pipe(
      map(([contract, signer]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) =>
        contract.populateTransaction.createSellOrder({
          stockId: stock.stockId,
          stockName: stock.stockName,
          stockSymbol: stock.stockSymbol,
          amount: stockAmount
        }, overrides),
      ),
      switchMap(tx => this.signerService.sendTransaction(tx)),
      switchMap(tx => this.dialogService.loading(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
        'Processing transaction...',
      )),
    )
  }

  getStockAddress(stockId: string): Observable<string> {
    return this.contract$.pipe(
      switchMap(contract => contract.tokens(stockId))
    )
  }

  changes$: Observable<OrderBook> = combineLatest([
    this.contract$,
    this.signerService.ensureAuth,
    this.sessionQuery.address$,
  ]).pipe(
    shareReplay(1),
    map(([contract, _signer]) => contract),
    switchMap(contract => merge(
      of(undefined),
      contractEvent(contract, contract.filters.BuyOrderCreated(this.sessionQuery.getValue().address!)),
      contractEvent(contract, contract.filters.SellOrderCreated(this.sessionQuery.getValue().address!)),
      contractEvent(contract, contract.filters.OrderSettled(this.sessionQuery.getValue().address!)),
    ).pipe(
      map(() => contract),
    )),
  )

  portfolio$: Observable<PortfolioItem[]> = this.changes$.pipe(
    switchMap(contract => contract.getPortfolio(this.sessionQuery.getValue().address!)),
  )

  pending$: Observable<Order[]> = this.changes$.pipe(
    switchMap(contract => contract.getPending(this.sessionQuery.getValue().address!)),
  )
}

export interface PortfolioItem {
  stockId: string;
  stockName: string;
  stockSymbol: string;
  stockAddress: string;
  balance: BigNumber;
}

interface Stock {
  stockId: string
  stockName: string
  stockSymbol: string
}

export interface Order {
  orderId: BigNumber;
  orderType: OrderType;
  stockId: string;
  stockName: string;
  stockSymbol: string;
  wallet: string;
  amount: BigNumber;
  settled: boolean;
  settledStablecoinAmount: BigNumber;
  settledTokenAmount: BigNumber;
  createdAt: BigNumber;
  settledAt: BigNumber;
}

export enum OrderType {
  BUY = 0,
  SELL = 1
}
