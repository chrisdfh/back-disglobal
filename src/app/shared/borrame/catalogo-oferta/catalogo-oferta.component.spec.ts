import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoOfertaComponent } from './catalogo-oferta.component';

describe('CatalogoOfertaComponent', () => {
  let component: CatalogoOfertaComponent;
  let fixture: ComponentFixture<CatalogoOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoOfertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
