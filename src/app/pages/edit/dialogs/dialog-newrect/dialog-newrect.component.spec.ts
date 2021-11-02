import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewrectComponent } from './dialog-newrect.component';

describe('DialogImportComponent', () => {
  let component: DialogNewrectComponent;
  let fixture: ComponentFixture<DialogNewrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogNewrectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
