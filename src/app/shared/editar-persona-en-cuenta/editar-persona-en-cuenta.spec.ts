import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPersonaEnCuentaComponent } from './editar-persona-en-cuenta';

describe('CatalogoInputGenericoComponent', () => {
  let component: EditarPersonaEnCuentaComponent;
  let fixture: ComponentFixture<EditarPersonaEnCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPersonaEnCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPersonaEnCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
