import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GameObject } from 'star-gameengine';
import { DialogNewrectComponent } from '../../dialogs/dialog-newrect/dialog-newrect.component';

@Component({
  selector: 'app-panel-objects-tree',
  templateUrl: './panel-objects-tree.component.html',
  styleUrls: ['./panel-objects-tree.component.scss'],
})
export class PanelObjectsTreeComponent implements AfterViewInit, OnChanges {
  @Input() objs: GameObject[] = [];
  @Input() selected?: GameObject;

  @Output() onSelect: EventEmitter<GameObject> = new EventEmitter();

  treeControl = new NestedTreeControl<GameObject>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<GameObject>();

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.dataSource.data = this.objs;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = this.objs;
  }

  select(node: GameObject | undefined) {
    this.onSelect.emit(node);
  }

  hasChild = (_: number, node: GameObject) =>
    !!node.children && node.children.length > 0;

  drop(event: CdkDragDrop<GameObject[]>) {
    moveItemInArray(this.objs, event.previousIndex, event.currentIndex);
    this.select(undefined);
    setTimeout(() => {
      this.select(this.objs[event.currentIndex]);
    }, 100);
  }

  newObject() {
    const dialogRef = this.dialog.open(DialogNewrectComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.objs.push(result);
        setTimeout(() => {
          this.select(result);
        }, 100);
      }
    });
  }
}
