import { Injectable } from '@angular/core';
import {
  Factory,
  GameObject,
  IFactoryOptions,
  MeshRenderer,
  PanInteraction,
  Scene,
  SelectObjectInteraction,
  ZoomInteraction,
} from 'star-gameengine';
import { ViewPort } from 'star-gameengine/dist/viewport';
import { EditGameObject } from '../edit.gameobject';
import { EditCircleGameObject } from '../editcircle.gameobject';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private scene: Scene = new Scene();
  selected?: GameObject;
  editobj?: GameObject;

  getScene() {
    return this.scene;
  }

  setScene(newscene: Scene) {
    this.scene = newscene;
  }

  select(item?: GameObject) {
    if (item instanceof EditCircleGameObject) {
      if (this.selected == item.parent && this.editobj) {
        this.selected?.removeChild(this.editobj);
      }
    } else {
      this.deselect();
    }
    if (!item) return;
    if (item instanceof EditGameObject) {
      this.selected = item.parent;
    } else {
      this.selected = item;
    }
    if (this.selected) {
      this.editobj = this.createEditObject(this.selected);
    }
  }

  deselect() {
    if (this.selected && this.editobj) {
      if (this.selected instanceof EditGameObject && this.editobj.parent) {
        this.selected = this.editobj.parent;
      } else if (
        this.selected instanceof EditCircleGameObject &&
        this.selected.parent &&
        this.selected.parent.parent
      ) {
        this.editobj = this.selected.parent;
        this.selected = this.selected.parent.parent;
      }

      if (this.editobj) {
        this.selected.removeChild(this.editobj);
      }
    }
    this.selected = undefined;
    this.editobj = undefined;
  }

  createEditObject(item: GameObject) {
    const json = item.toJSON();
    const newitem = new EditGameObject(json);

    // Create Object
    newitem.name = 'edit';
    newitem.children = [];
    newitem.position.sub(item.position);
    newitem.setRenderer(
      new MeshRenderer({
        color: '#ffb74d',
        strokeStyle: '#e65100',
        lineWidth: 5,
      })
    );

    newitem.vertices = item.vertices;
    item.addChild(newitem);

    // Create circles
    for (let vertice of newitem.vertices) {
      const params: IFactoryOptions = {
        name: 'circleEdit',
        x: vertice.x,
        y: vertice.y,
        radius: 5,
        color: '#8ED6FF',
        rigidBody: {},
        static: true,
      };

      const circlejson = Factory.circle(params).toJSON();
      const circle = new EditCircleGameObject(circlejson);
      newitem.addChild(circle);

      circle.position = vertice;
    }

    return newitem;
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
      if (
        obj &&
        this.selected &&
        (obj.parent === this.selected || obj.parent === this.editobj)
      ) {
        panControl.target = this.selected;
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
