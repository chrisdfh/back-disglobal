import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoOcupacionActividadComponent } from './catalogo-ocupacion-actividad.component';

describe('CatalogoOcupacionActividadComponent', () => {
  let component: CatalogoOcupacionActividadComponent;
  let fixture: ComponentFixture<CatalogoOcupacionActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoOcupacionActividadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoOcupacionActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
