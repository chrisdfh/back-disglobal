import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoXpaycuentaComponent } from './catalogo-xpaycuenta.component';

describe('CatalogoXpaycuentaComponent', () => {
  let component: CatalogoXpaycuentaComponent;
  let fixture: ComponentFixture<CatalogoXpaycuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoXpaycuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoXpaycuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
