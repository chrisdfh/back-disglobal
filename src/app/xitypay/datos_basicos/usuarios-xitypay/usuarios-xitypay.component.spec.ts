import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosXitypayComponent } from './usuarios-xitypay.component';

describe('UsuariosXitypayComponent', () => {
  let component: UsuariosXitypayComponent;
  let fixture: ComponentFixture<UsuariosXitypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosXitypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosXitypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
