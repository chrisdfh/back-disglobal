import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGenericoComponent } from './catalogo-generico.component';

describe('CatalogoGenericoComponent', () => {
  let component: CatalogoGenericoComponent;
  let fixture: ComponentFixture<CatalogoGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoGenericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
