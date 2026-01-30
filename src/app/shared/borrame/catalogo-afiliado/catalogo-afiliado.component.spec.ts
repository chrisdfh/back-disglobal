import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAfiliadoComponent } from './catalogo-afiliado.component';

describe('CatalogoAfiliadoComponent', () => {
  let component: CatalogoAfiliadoComponent;
  let fixture: ComponentFixture<CatalogoAfiliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoAfiliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
