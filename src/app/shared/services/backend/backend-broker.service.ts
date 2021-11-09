import {Injectable} from '@angular/core'
import {combineLatest, Observable, of} from 'rxjs'
import {BackendHttpClient} from './backend-http-client.service'
import {map} from 'rxjs/operators'
import {environment} from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class BackendBrokerService {
  constructor(private http: BackendHttpClient) {
  }

  getMarketData(): Observable<MarketDataItem[]> {
    return this.http.get<MarketData>(`${environment.backendURL}/api/trade/stocks`, {}, true).pipe(
      map(res => res.stocks)
    )
  }

  getMarketDataItem(id: string): Observable<MarketDataItem> {
    return this.http.get<MarketDataItem>(`${environment.backendURL}/api/trade/stocks/${id}`, {}, true)
  }

  extendPortfolio<T extends StockItemable>(portfolio: T[]): Observable<ItemExtended<T>[]> {
    return portfolio.length === 0 ? of([]) : combineLatest(portfolio.map(portfolioItem => {
      return this.getMarketDataItem(portfolioItem.stockId).pipe(
        map(marketDataItem => ({
          item: portfolioItem,
          price: marketDataItem.price,
          priceChange24h: marketDataItem.priceChange24h,
        })),
      )
    }))
  }

  extendPending<T extends StockItemable>(pending: T[]): Observable<ItemExtended<T>[]> {
    return pending.length === 0 ? of([]) : combineLatest(pending.map(pendingItem => {
      return this.getMarketDataItem(pendingItem.stockId).pipe(
        map(marketDataItem => ({
          item: pendingItem,
          price: marketDataItem.price,
          priceChange24h: marketDataItem.priceChange24h,
        })),
      )
    }))
  }
}

interface MarketData {
  stocks: MarketDataItem[]
}

export interface MarketDataItem {
  id: number
  name: string
  price: number
  priceChange24h: number
  symbol: string
}

interface StockItemable {
  stockId: string
}

export interface ItemExtended<T> {
  item: T
  price: number
  priceChange24h: number
}
