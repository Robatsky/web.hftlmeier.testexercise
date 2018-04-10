import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamingtaskComponent } from './namingtask.component';

describe('NamingtaskComponent', () => {
  let component: NamingtaskComponent;
  let fixture: ComponentFixture<NamingtaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamingtaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamingtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
