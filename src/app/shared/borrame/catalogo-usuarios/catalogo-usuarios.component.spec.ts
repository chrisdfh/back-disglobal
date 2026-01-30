import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoUsuariosComponent } from './catalogo-usuarios.component';

describe('CatalogoUsuariosComponent', () => {
  let component: CatalogoUsuariosComponent;
  let fixture: ComponentFixture<CatalogoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
