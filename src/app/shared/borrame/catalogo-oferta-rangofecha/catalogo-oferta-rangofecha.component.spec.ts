import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoOfertaRangofechaComponent } from './catalogo-oferta-rangofecha.component';

describe('CatalogoOfertaRangofechaComponent', () => {
  let component: CatalogoOfertaRangofechaComponent;
  let fixture: ComponentFixture<CatalogoOfertaRangofechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoOfertaRangofechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoOfertaRangofechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
