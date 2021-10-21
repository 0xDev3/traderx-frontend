import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellComponent {
  constructor() {
  }
}
