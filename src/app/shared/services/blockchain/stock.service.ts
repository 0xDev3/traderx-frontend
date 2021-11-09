import {Injectable} from '@angular/core'
import {combineLatest, from, Observable, of} from 'rxjs'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {Stock, Stock__factory} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {SignerService} from '../signer.service'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'
import {BigNumber} from 'ethers'

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private signerService: SignerService,
              private dialogService: DialogService,
              private gasService: GasService) {
  }

  contract(address: string): Observable<Stock> {
    return combineLatest([
      this.sessionQuery.provider$,
    ]).pipe(
      distinctUntilChanged(),
      map(([provider]) => Stock__factory.connect(address, provider)),
    )
  }

  getAllowance(stockAddress: string): Observable<BigNumber> {
    return combineLatest([
      this.contract(stockAddress),
      this.signerService.ensureAuth,
    ]).pipe(
      switchMap(([contract, _signer]) =>
        contract.allowance(
          this.preferenceQuery.network.orderBook,
          this.sessionQuery.getValue().address!,
        )),
    )
  }

  balance(stockAddress: string): Observable<BigNumber> {
    return combineLatest([
      this.contract(stockAddress),
      this.signerService.ensureAuth,
    ]).pipe(
      switchMap(([contract, _signer]) =>
        contract.balanceOf(this.sessionQuery.getValue().address!)),
    )
  }

  approveAmount(stockAddress: string, amount: BigNumber): Observable<unknown> {
    return combineLatest([
      this.contract(stockAddress),
      this.signerService.ensureAuth,
    ]).pipe(
      map(([contract, signer]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) =>
        contract.populateTransaction.approve(this.preferenceQuery.network.orderBook, amount, overrides),
      ),
      switchMap(tx => this.signerService.sendTransaction(tx)),
      switchMap(tx => this.dialogService.loading(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
        'Approving stocks for trading',
      )),
    )
  }
}
