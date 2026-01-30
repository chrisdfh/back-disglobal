import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuentaSypagoComponent } from './editar-cuenta-sypago.component';

describe('EditarCuentaSypagoComponent', () => {
  let component: EditarCuentaSypagoComponent;
  let fixture: ComponentFixture<EditarCuentaSypagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCuentaSypagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCuentaSypagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
