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
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GameObject } from 'star-gameengine';

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

  ngAfterViewInit(): void {
    this.dataSource.data = this.objs;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = this.objs;
  }

  select(node: GameObject) {
    this.onSelect.emit(node);
  }

  hasChild = (_: number, node: GameObject) =>
    !!node.children && node.children.length > 0;
}
