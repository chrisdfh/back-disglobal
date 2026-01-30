import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaSypagoComponent } from './cuenta-sypago.component';

describe('CuentaSypagoComponent', () => {
  let component: CuentaSypagoComponent;
  let fixture: ComponentFixture<CuentaSypagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaSypagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaSypagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
