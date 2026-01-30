import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestacadosHomeComponent } from './destacados-home.component';

describe('DestacadosHomeComponent', () => {
  let component: DestacadosHomeComponent;
  let fixture: ComponentFixture<DestacadosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestacadosHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestacadosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
