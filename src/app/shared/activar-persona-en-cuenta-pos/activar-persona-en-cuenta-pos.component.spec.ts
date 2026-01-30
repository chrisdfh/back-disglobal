import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarPersonaEnCuentaPosComponent } from './activar-persona-en-cuenta-pos.component';

describe('ActivarPersonaEnCuentaPosComponent', () => {
  let component: ActivarPersonaEnCuentaPosComponent;
  let fixture: ComponentFixture<ActivarPersonaEnCuentaPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivarPersonaEnCuentaPosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivarPersonaEnCuentaPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
