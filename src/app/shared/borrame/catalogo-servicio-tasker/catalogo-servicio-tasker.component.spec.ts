import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoServicioTaskerComponent } from './catalogo-servicio-tasker.component';

describe('CatalogoServicioTaskerComponent', () => {
  let component: CatalogoServicioTaskerComponent;
  let fixture: ComponentFixture<CatalogoServicioTaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoServicioTaskerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoServicioTaskerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
