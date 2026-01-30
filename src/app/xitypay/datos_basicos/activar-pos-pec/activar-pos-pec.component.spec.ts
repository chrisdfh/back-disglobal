import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarPosPecComponent } from './activar-pos-pec.component';

describe('ActivarPosPecComponent', () => {
  let component: ActivarPosPecComponent;
  let fixture: ComponentFixture<ActivarPosPecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivarPosPecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivarPosPecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
