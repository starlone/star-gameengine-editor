import { Component, Input } from '@angular/core';
import { GameObject } from 'star-gameengine';

@Component({
  selector: 'app-panel-properties',
  templateUrl: './panel-properties.component.html',
  styleUrls: ['./panel-properties.component.scss'],
})
export class PanelPropertiesComponent {
  @Input() selected?: GameObject;
}
