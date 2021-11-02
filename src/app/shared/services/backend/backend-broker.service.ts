import {Injectable} from '@angular/core'
import {combineLatest, Observable, of} from 'rxjs'
import {BackendHttpClient} from './backend-http-client.service'
import {delay, first, map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class BackendBrokerService {
  constructor(private http: BackendHttpClient) {
  }

  getMarketData(): Observable<MarketDataItem[]> {
    return of(this.dummyMarketData).pipe(
      delay(800)
    )

    // TODO: Uncomment this when the endpoint will be available
    // return this.http.get<MarketData>(`${environment.backendURL}/stocks`).pipe(
    //   map(res => res.stocks)
    // )
  }

  getMarketDataItem(id: string): Observable<MarketDataItem> {
    return of(...this.dummyMarketData).pipe(
      first(item => String(item.id) === id)
    )

    // TODO: Uncomment this when the endpoint will be available
    // return this.http.get<MarketDataItem>(`${environment.backendURL}/stocks/${id}`)
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

  get dummyMarketData(): MarketDataItem[] {
    return [
      {
        'id': 76792991,
        'name': 'TESLA INC',
        'price': 895.85,
        'priceChange24h': 1000,
        'symbol': 'TSLA'
      },
      {
        'id': 265598,
        'name': 'APPLE INC',
        'price': 148.8,
        'priceChange24h': -200,
        'symbol': 'AAPL'
      },
      {
        'id': 3691937,
        'name': 'AMAZON.COM INC',
        'price': 3414.25,
        'priceChange24h': 2500,
        'symbol': 'AMZN'
      },
      {
        'id': 107113386,
        'name': 'FACEBOOK INC-CLASS A',
        'price': 340.23,
        'priceChange24h': 5.43,
        'symbol': 'FB'
      },
      {
        'id': 272093,
        'name': 'MICROSOFT CORP',
        'price': 307.41,
        'priceChange24h': 0,
        'symbol': 'MSFT'
      },
      {
        'id': 4815747,
        'name': 'NVIDIA CORP',
        'price': 221,
        'priceChange24h': -7.1,
        'symbol': 'NVDA'
      },
      {
        'id': 6459,
        'name': 'WALT DISNEY CO/THE',
        'price': 170.28,
        'priceChange24h': 0,
        'symbol': 'DIS'
      }
    ]
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
