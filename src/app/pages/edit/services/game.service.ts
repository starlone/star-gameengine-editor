import { Injectable } from '@angular/core';
import {
  GameObject,
  MeshRenderer,
  PanInteraction,
  Renderer,
  Scene,
  SelectObjectInteraction,
  ZoomInteraction
} from 'star-gameengine';
import { ViewPort } from 'star-gameengine/dist/viewport';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private scene: Scene = new Scene();
  private oldRenderer?: Renderer;
  selected?: GameObject;

  getScene() {
    return this.scene;
  }

  setScene(newscene: Scene) {
    this.scene = newscene;
  }

  select(item?: GameObject) {
    this.deselect();
    if (!item) return;
    this.selected = item;
    this.oldRenderer = item.renderer;
    this.selected.setRenderer(
      new MeshRenderer({
        color: '#ffb74d',
        strokeStyle: '#e65100',
        lineWidth: 5,
      })
    );
  }

  deselect() {
    if (this.selected && this.oldRenderer) {
      this.selected.setRenderer(this.oldRenderer);
    }
    this.selected = undefined;
  }

  addInteractions(viewport: ViewPort) {
    viewport.addInteraction(new ZoomInteraction());
    viewport.addInteraction(
      new SelectObjectInteraction((coordinate: any) => {
        const obj = this.getScene().getObjectByCoordinate(coordinate);
        this.select(obj);
      })
    );
    const panControl = {
      target: this.scene.getCamera(),
      isInverse: true,
    };
    const startPan = (point: any) => {
      const obj = this.scene.getObjectByCoordinate(point);
      if (obj && this.selected && obj === this.selected) {
        panControl.target = obj;
        panControl.isInverse = false;
      } else {
        panControl.target = this.scene.getCamera();
        panControl.isInverse = true;
      }
    };
    const endPan = () => {
      panControl.target = this.scene.getCamera();
      panControl.isInverse = true;
    };
    const movePan = (point: any) => {
      if (panControl.isInverse) {
        point.neg();
      }
      panControl.target.position.move(point.x, point.y);
    };
    viewport.addInteraction(new PanInteraction(startPan, endPan, movePan));
  }
}
