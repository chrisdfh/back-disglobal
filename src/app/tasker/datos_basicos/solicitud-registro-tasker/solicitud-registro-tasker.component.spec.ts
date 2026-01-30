import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRegistroTaskerComponent } from './solicitud-registro-tasker.component';

describe('SolicitudRegistroTaskerComponent', () => {
  let component: SolicitudRegistroTaskerComponent;
  let fixture: ComponentFixture<SolicitudRegistroTaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudRegistroTaskerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudRegistroTaskerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
