import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfiliadoReinicioContrasenaComponent } from './afiliado-reinicio-contrasena.component';

describe('AfiliadoReinicioContrasenaComponent', () => {
  let component: AfiliadoReinicioContrasenaComponent;
  let fixture: ComponentFixture<AfiliadoReinicioContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfiliadoReinicioContrasenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfiliadoReinicioContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
