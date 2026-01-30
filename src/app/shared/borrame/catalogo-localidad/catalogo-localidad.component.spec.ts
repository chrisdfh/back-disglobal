import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoLocalidadComponent } from './catalogo-localidad.component';

describe('CatalogoLocalidadComponent', () => {
  let component: CatalogoLocalidadComponent;
  let fixture: ComponentFixture<CatalogoLocalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoLocalidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
