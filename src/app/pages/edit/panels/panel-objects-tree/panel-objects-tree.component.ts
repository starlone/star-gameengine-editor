import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { GameObject, IGameObjectOptions } from 'star-gameengine';

/** Flat to-do item node with expandable and level information */
export class GameObjectFlatNode {
  item: string = '';
  level: number = 0;
  expandable: boolean = false;
  uid: string = '';
}

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
  insertItem(parent: GameObject, options: IGameObjectOptions): GameObject {
    const newItem = new GameObject(options);
    parent.children.push(newItem);
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemAbove(node: GameObject, options: IGameObjectOptions): GameObject {
    const parentNode = this.getParentFromNodes(node);
    const newItem = new GameObject(options);
    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(node), 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemBelow(node: GameObject, options: IGameObjectOptions): GameObject {
    const parentNode = this.getParentFromNodes(node);
    const newItem = new GameObject(options);
    if (parentNode != null) {
      parentNode.children.splice(
        parentNode.children.indexOf(node) + 1,
        0,
        newItem
      );
    } else {
      this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
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

@Component({
  selector: 'app-panel-objects-tree',
  templateUrl: './panel-objects-tree.component.html',
  styleUrls: ['./panel-objects-tree.component.scss'],
  providers: [ChecklistDatabase],
})
export class PanelObjectsTreeComponent implements AfterViewInit {
  @Input() objs: GameObject[] = [];
  @Input() selected?: GameObject;

  @Output() onSelect: EventEmitter<GameObject> = new EventEmitter();

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<GameObjectFlatNode, GameObject>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<GameObject, GameObjectFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: GameObjectFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<GameObjectFlatNode>;

  treeFlattener: MatTreeFlattener<GameObject, GameObjectFlatNode>;

  dataSource: MatTreeFlatDataSource<GameObject, GameObjectFlatNode>;

  /* Drag and drop */
  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number = 0;
  dragNodeExpandOverArea?: string;
  @ViewChild('emptyItem') emptyItem?: ElementRef;

  constructor(private database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<GameObjectFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe((data) => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });
  }
  ngAfterViewInit(): void {
    this.database.load(this.objs);
  }

  getLevel = (node: GameObjectFlatNode) => node.level;

  isExpandable = (node: GameObjectFlatNode) => node.expandable;

  getChildren = (node: GameObject): GameObject[] => node.children;

  hasChild = (_: number, _nodeData: GameObjectFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: GameObjectFlatNode) =>
    _nodeData.item === '';

  select(nodeFlat: GameObjectFlatNode) {
    const node = this.flatNodeMap.get(nodeFlat);
    console.log(node);
    this.onSelect.emit(node);
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: GameObject, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.name
        ? existingNode
        : new GameObjectFlatNode();
    flatNode.item = node.name;
    flatNode.level = level;
    flatNode.uid = node.uid;
    flatNode.expandable = node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Select the category so we can insert the new item. */
  addNewItem(node: GameObjectFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    if (parentNode) {
      this.database.insertItem(parentNode, {
        name: '',
        position: { x: 0, y: 0 },
      });
    }
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: GameObjectFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    if (nestedNode) {
      this.database.updateItem(nestedNode, itemValue);
    }
  }

  handleDragStart(event: any, node: any) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    if (this.emptyItem) {
      event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    }
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event: any, node: any) {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if (
          new Date().getTime() - this.dragNodeExpandOverTime >
          this.dragNodeExpandOverWaitTimeMs
        ) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event: any, node: GameObjectFlatNode) {
    event.preventDefault();
    if (node !== this.dragNode) {
      let newItem: GameObject | undefined = undefined;
      const dragNode = this.flatNodeMap.get(this.dragNode);
      const flatNodeMap: GameObject | undefined = this.flatNodeMap.get(node);
      if (!dragNode || !flatNodeMap) return;
      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.database.moveItemAbove(dragNode, flatNodeMap);
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.database.moveItemBelow(dragNode, flatNodeMap);
      } else if (dragNode.parent != flatNodeMap) {
        newItem = this.database.moveItem(dragNode, flatNodeMap);
      }
      if (newItem) {
        // this.database.deleteItem(dragNode);
        const newnode = this.nestedNodeMap.get(newItem);
        if (!newnode) return;
        this.treeControl.expandDescendants(newnode);
      }
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd(event: any) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }
}
