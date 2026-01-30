import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoMonedasComponent } from './catalogo-monedas.component';

describe('CatalogoMonedasComponent', () => {
  let component: CatalogoMonedasComponent;
  let fixture: ComponentFixture<CatalogoMonedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoMonedasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoMonedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
