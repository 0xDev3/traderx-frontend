import {Injectable} from '@angular/core'
import {combineLatest, from, Observable, of} from 'rxjs'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {OrderBook, OrderBook__factory} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {BigNumber} from 'ethers'
import {SignerService} from '../signer.service'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'

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

  createBuyOrder(stockId: number, stablecoinAmount: BigNumber): Observable<unknown> {
    return combineLatest([
      this.contract$,
      this.signerService.ensureAuth,
    ]).pipe(
      map(([contract, signer]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) =>
        contract.populateTransaction.createBuyOrder(String(stockId), stablecoinAmount, overrides),
      ),
      switchMap(tx => this.signerService.sendTransaction(tx)),
      switchMap(tx => this.dialogService.loading(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
        'Processing transaction...',
      )),
    )
  }

  createSellOrder(stockId: number, stockAmount: BigNumber): Observable<unknown> {
    return combineLatest([
      this.contract$,
      this.signerService.ensureAuth,
    ]).pipe(
      map(([contract, signer]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) =>
        contract.populateTransaction.createSellOrder(String(stockId), stockAmount, overrides),
      ),
      switchMap(tx => this.signerService.sendTransaction(tx)),
      switchMap(tx => this.dialogService.loading(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
        'Processing transaction...',
      )),
    )
  }

  getStockAddress(stockId: number): Observable<string> {
    return of('') // TODO: implement this when available at contract level
  }
}
