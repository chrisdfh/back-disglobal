import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerComponent } from './tasker.component';

describe('TaskerComponent', () => {
  let component: TaskerComponent;
  let fixture: ComponentFixture<TaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
