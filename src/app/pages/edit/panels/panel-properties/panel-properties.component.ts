import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-panel-properties',
  templateUrl: './panel-properties.component.html',
  styleUrls: ['./panel-properties.component.scss'],
})
export class PanelPropertiesComponent {
  constructor(public gameService: GameService) {}
}
