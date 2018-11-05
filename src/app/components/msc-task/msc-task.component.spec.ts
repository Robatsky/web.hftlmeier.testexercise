import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MscTaskComponent } from './msc-task.component';

describe('MscTaskComponent', () => {
  let component: MscTaskComponent;
  let fixture: ComponentFixture<MscTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MscTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MscTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
