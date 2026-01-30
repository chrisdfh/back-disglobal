import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAliadoOfertaComponent } from './catalogo-aliado-oferta.component';

describe('CatalogoAliadoOfertaComponent', () => {
  let component: CatalogoAliadoOfertaComponent;
  let fixture: ComponentFixture<CatalogoAliadoOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoAliadoOfertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAliadoOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
