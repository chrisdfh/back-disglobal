import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContrasenaComponent } from './update-contrasena.component';

describe('UpdateContrasenaComponent', () => {
  let component: UpdateContrasenaComponent;
  let fixture: ComponentFixture<UpdateContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateContrasenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
