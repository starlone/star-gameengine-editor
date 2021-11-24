import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogNewcircleComponent } from './dialog-newcircle.component';


describe('DialogImportComponent', () => {
  let component: DialogNewcircleComponent;
  let fixture: ComponentFixture<DialogNewcircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogNewcircleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewcircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
