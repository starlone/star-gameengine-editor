import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { GameObject } from 'star-gameengine';
import { DialogNewcircleComponent } from '../../dialogs/dialog-newcircle/dialog-newcircle.component';
import { DialogNewrectComponent } from '../../dialogs/dialog-newrect/dialog-newrect.component';
import { GameService } from '../../services/game.service';
import { ChecklistDatabase } from './panel-objects-tree.database';

/** Flat to-do item node with expandable and level information */
export class GameObjectFlatNode {
  item: string = '';
  level: number = 0;
  expandable: boolean = false;
  uid: string = '';
}

@Component({
  selector: 'app-panel-objects-tree',
  templateUrl: './panel-objects-tree.component.html',
  styleUrls: ['./panel-objects-tree.component.scss'],
  providers: [ChecklistDatabase],
})
export class PanelObjectsTreeComponent implements AfterViewInit {
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

  constructor(
    private database: ChecklistDatabase,
    private dialog: MatDialog,
    public gameService: GameService
  ) {
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
    this.database.load(this.gameService.getScene().objs);
  }

  getLevel = (node: GameObjectFlatNode) => node.level;

  isExpandable = (node: GameObjectFlatNode) => node.expandable;

  getChildren = (node: GameObject): GameObject[] => node.children;

  hasChild = (_nodeData: GameObjectFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: GameObjectFlatNode) =>
    _nodeData.item === '';

  select(nodeFlat: GameObjectFlatNode) {
    const node = this.flatNodeMap.get(nodeFlat);
    this.gameService.select(node);
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

  newRect(node?: GameObjectFlatNode) {
    this.newObject(DialogNewrectComponent, node);
  }

  newCircle(node?: GameObjectFlatNode) {
    this.newObject(DialogNewcircleComponent, node);
  }

  newObject(component: any, node?: GameObjectFlatNode) {
    let parentNode: GameObject | undefined;
    if (node) parentNode = this.flatNodeMap.get(node);

    const dialogRef = this.dialog.open(component);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.database.insertItem(result, parentNode);
        if (node) this.treeControl.expand(node);
      }
    });
  }

  deleteObject(node: GameObjectFlatNode) {
    const obj = this.flatNodeMap.get(node);
    if (obj) this.database.deleteItem(obj);
  }

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
