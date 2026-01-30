import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAliadoComponent } from './catalogo-aliado.component';

describe('CatalogoAliadoComponent', () => {
  let component: CatalogoAliadoComponent;
  let fixture: ComponentFixture<CatalogoAliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoAliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
