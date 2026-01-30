import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCrearGrillaComponent } from './ventana-crear-grilla.component';

describe('VentanaCrearGrillaComponent', () => {
  let component: VentanaCrearGrillaComponent;
  let fixture: ComponentFixture<VentanaCrearGrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaCrearGrillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaCrearGrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
