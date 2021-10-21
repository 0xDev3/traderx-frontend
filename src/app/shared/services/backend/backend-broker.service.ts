import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {BackendHttpClient} from './backend-http-client.service'
import {delay, first} from 'rxjs/operators'

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
  }

  getMarketDataItem(id: number): Observable<MarketDataItem> {
    return of(...this.dummyMarketData).pipe(
      first(item => item.id === id)
    )
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

export interface MarketDataItem {
  id: number
  symbol: string
  name: string
  priceChange24h: number
  price: number
}
