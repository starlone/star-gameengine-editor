import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelObjectsTreeComponent } from './panel-objects-tree.component';

describe('PanelObjectsTreeComponent', () => {
  let component: PanelObjectsTreeComponent;
  let fixture: ComponentFixture<PanelObjectsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelObjectsTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelObjectsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
