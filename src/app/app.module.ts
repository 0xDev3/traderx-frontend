import {BrowserModule} from '@angular/platform-browser'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import {combineLatest} from 'rxjs'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service'
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools'
import {AkitaNgRouterStoreModule} from '@datorama/akita-ng-router-store'
import {environment} from '../environments/environment'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatDialogModule} from '@angular/material/dialog'
import {PortfolioComponent} from './portfolio/portfolio.component'
import {WalletComponent} from './wallet/wallet.component'
import {ActionButtonComponent} from './shared/components/action-button/action-button.component'
import {AddrShortPipe} from './shared/pipes/addr-short.pipe'
import {InfoDialogComponent} from './shared/components/info-dialog/info-dialog.component'
import {PreferenceService} from './preference/state/preference.service'
import {AppLayoutComponent} from './app-layout/app-layout.component'
import {NavbarComponent} from './app-layout/navbar/navbar.component'
import {FooterComponent} from './app-layout/footer/footer.component'
import {A11yModule} from '@angular/cdk/a11y'
import {SpinnerComponent} from './shared/components/spinner/spinner.component'
import {ServiceWorkerModule} from '@angular/service-worker'
import {InlineAsyncComponent} from './shared/components/inline-async/inline-async.component'
import {UnwrapStatusPipe} from './shared/pipes/unwrap-status.pipe'
import {CurrencyPipe, DatePipe, PercentPipe, ViewportScroller} from '@angular/common'
import {CurrencyDefaultPipe} from './shared/pipes/currency-default.pipe'
import {AuthComponent} from './auth/auth.component'
import {HttpClientModule} from '@angular/common/http'
import {AuthProviderNamePipe} from './shared/pipes/auth-provider-name.pipe'
import {ReactiveFormsModule} from '@angular/forms'
import {CurrencyMaskDirective} from './shared/directives/currency-mask.directive'
import {ValueCopyComponent} from './shared/components/value-copy/value-copy.component'
import {FileInputAccessorDirective} from './shared/directives/file-input-accessor.directive'
import {SafePipe} from './shared/pipes/safe.pipe'
import {FormatUnitPipe} from './shared/pipes/format-unit.pipe'
import {WalletButtonComponent} from './app-layout/navbar/wallet-button/wallet-button.component'
import {MatTooltipModule} from '@angular/material/tooltip'
import {TruncatePipe} from './shared/pipes/truncate.pipe'
import {UnescapePipe} from './shared/pipes/unescape.pipe'
import {SelectNetworkComponent} from './shared/components/select-network/select-network.component'
import {HomeComponent} from './home/home.component'
import {Router, Scroll} from '@angular/router'
import {delay, filter} from 'rxjs/operators'
import {LoadingDialogComponent} from './shared/components/loading-dialog/loading-dialog.component'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {AddButtonComponent} from './shared/components/add-button/add-button.component'
import {FormYesNoButtonsComponent} from './shared/components/form-yes-no-buttons/form-yes-no-buttons.component'
import {DateMaskDirective} from './shared/directives/date-mask.directive'
import {NetworkPathPipe} from './shared/pipes/issuer-path.pipe'
import {ExploreComponent} from './explore/explore.component'
import {AuthMagicComponent} from './auth/auth-magic/auth-magic.component'
import {BuyComponent} from './buy/buy.component'
import {SellComponent} from './sell/sell.component'
import {CurrInputDirective} from './shared/directives/curr-input.directive'
import {ExplorerLinkComponent} from './shared/components/explorer-link/explorer-link.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PortfolioComponent,
    WalletComponent,
    ActionButtonComponent,
    AddrShortPipe,
    UnwrapStatusPipe,
    InfoDialogComponent,
    AppLayoutComponent,
    FooterComponent,
    SpinnerComponent,
    InlineAsyncComponent,
    AuthComponent,
    CurrencyDefaultPipe,
    AuthProviderNamePipe,
    SafePipe,
    FormatUnitPipe,
    NetworkPathPipe,
    CurrencyMaskDirective,
    ValueCopyComponent,
    FileInputAccessorDirective,
    WalletButtonComponent,
    TruncatePipe,
    UnescapePipe,
    SelectNetworkComponent,
    HomeComponent,
    LoadingDialogComponent,
    AddButtonComponent,
    FormYesNoButtonsComponent,
    DateMaskDirective,
    CurrInputDirective,
    ExploreComponent,
    AuthMagicComponent,
    BuyComponent,
    SellComponent,
    ExplorerLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ReactiveFormsModule,
    AkitaNgRouterStoreModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    A11yModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    PreferenceService,
    {
      provide: APP_INITIALIZER,
      useFactory: (pref: PreferenceService) =>
        () => combineLatest([pref.initSigner(), pref.checkFixedConfig()]),
      multi: true,
      deps: [PreferenceService],
    },
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: {baseUrl: 'https://jsonplaceholder.typicode.com'},
    },
    CurrencyPipe,
    NetworkPathPipe,
    TruncatePipe,
    UnescapePipe,
    PercentPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    // Workaround for issue with scroll restoration
    // https://github.com/angular/angular/issues/24547#issuecomment-503076245
    router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll),
      delay(200),
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position)
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor)
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0])
      }
    })
  }
}
