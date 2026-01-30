import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPersonasEnCuentaComponent } from './catalogo-personas-en-cuenta.component';

describe('CatalogoPersonasEnCuentaComponent', () => {
  let component: CatalogoPersonasEnCuentaComponent;
  let fixture: ComponentFixture<CatalogoPersonasEnCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoPersonasEnCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoPersonasEnCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
