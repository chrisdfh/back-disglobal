import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRegistroAliadoComponent } from './solicitud-registro-aliado.component';

describe('SolicitudRegistroAliadoComponent', () => {
  let component: SolicitudRegistroAliadoComponent;
  let fixture: ComponentFixture<SolicitudRegistroAliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudRegistroAliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudRegistroAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
