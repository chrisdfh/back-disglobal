import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioIdComponent } from './cambio-id.component';

describe('CambioIdComponent', () => {
  let component: CambioIdComponent;
  let fixture: ComponentFixture<CambioIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
