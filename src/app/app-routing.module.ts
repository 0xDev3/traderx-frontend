import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {PortfolioComponent} from './portfolio/portfolio.component'
import {WalletComponent} from './wallet/wallet.component'
import {AppLayoutComponent} from './app-layout/app-layout.component'
import {AuthGuard} from './shared/guards/auth.guard'
import {environment} from '../environments/environment'
import {NetworkGuard} from './shared/guards/network.guard'
import {HomeComponent} from './home/home.component'
import {ExploreComponent} from './explore/explore.component'
import {BuyComponent} from './buy/buy.component'
import {SellComponent} from './sell/sell.component'

const appRoutes: Routes = [
  {
    path: '', component: AppLayoutComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'explore'},
      {path: 'explore', component: ExploreComponent},
      {
        path: '', canActivate: [AuthGuard], children: [
          {path: 'wallet', component: WalletComponent},
          {path: 'portfolio', component: PortfolioComponent},
          {path: 'buy/:id', component: BuyComponent},
          {path: 'sell/:id', component: SellComponent},
        ],
      },
    ],
  },
  {path: '**', redirectTo: '/explore'},
]

const networkRoutes: Routes = [{
  path: !environment.fixed.chainID ? ':chainID' : '',
  canActivate: [NetworkGuard], children: appRoutes,
}]

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/home'},
  {path: 'home', component: HomeComponent},
  {
    path: '', children: networkRoutes,
  },
  {path: '**', redirectTo: '/home'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    //enableTracing: this, // enable for testing purposes
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
