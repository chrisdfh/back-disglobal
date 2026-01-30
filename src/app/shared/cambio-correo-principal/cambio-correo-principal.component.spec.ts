import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioCorreoPrincipalComponent } from './cambio-correo-principal.component';

describe('CambioCorreoPrincipalComponent', () => {
  let component: CambioCorreoPrincipalComponent;
  let fixture: ComponentFixture<CambioCorreoPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioCorreoPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioCorreoPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
