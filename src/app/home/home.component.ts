import {ChangeDetectionStrategy, Component} from '@angular/core'
import {RouterService} from '../shared/services/router.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private router: RouterService) {
  }

  enterNetwork() {
    this.router.navigateNetwork()
  }
}
