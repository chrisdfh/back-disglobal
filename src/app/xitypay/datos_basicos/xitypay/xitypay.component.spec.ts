import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XitypayComponent } from './xitypay.component';

describe('XitypayComponent', () => {
  let component: XitypayComponent;
  let fixture: ComponentFixture<XitypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XitypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XitypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
