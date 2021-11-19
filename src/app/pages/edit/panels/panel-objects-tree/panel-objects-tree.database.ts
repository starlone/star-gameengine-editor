import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameObject } from 'star-gameengine';

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<GameObject[]>([]);

  get data(): GameObject[] {
    return this.dataChange.value;
  }

  constructor() {
    const data: GameObject[] = [];
    this.dataChange.next(data);
  }

  load(objects: GameObject[]) {
    this.dataChange.next(objects);
  }

  /** Add an item to to-do list */
  insertItem(newItem: GameObject, parent?: GameObject): GameObject {
    if (parent) {
      parent.addChild(newItem);
    } else {
      this.data.push(newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  getParentFromNodes(node: GameObject): GameObject | undefined {
    for (const currentRoot of this.data) {
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return undefined;
  }

  getParent(currentRoot: GameObject, node: GameObject): GameObject | undefined {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (const child of currentRoot.children) {
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return undefined;
  }

  updateItem(node: GameObject, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: GameObject) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  private removeOldParent(from: GameObject) {
    const parent = this.getParentFromNodes(from);
    const children = parent != null ? parent.children : this.data;
    this.deleteNode(children, from);
  }

  moveItem(from: GameObject, to: GameObject): GameObject {
    this.removeOldParent(from);

    to.children.push(from);
    from.setParent(to);
    this.dataChange.next(this.data);
    return from;
  }

  moveItemAtIndex(from: GameObject, to: GameObject, increment: number) {
    this.removeOldParent(from);

    const parentNode = this.getParentFromNodes(to);
    const objs = parentNode != null ? parentNode.children : this.data;

    const index = objs.indexOf(to);
    objs.splice(index + increment, 0, from);

    from.setParent(parentNode);
    this.dataChange.next(this.data);
    return from;
  }

  moveItemAbove(from: GameObject, to: GameObject): GameObject {
    return this.moveItemAtIndex(from, to, 0);
  }

  moveItemBelow(from: GameObject, to: GameObject): GameObject {
    return this.moveItemAtIndex(from, to, 1);
  }

  deleteNode(nodes: GameObject[], nodeToDelete: GameObject) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}
