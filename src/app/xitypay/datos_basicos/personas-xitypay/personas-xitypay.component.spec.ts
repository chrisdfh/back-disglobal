import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasXitypayComponent } from './personas-xitypay.component';

describe('PersonasXitypayComponent', () => {
  let component: PersonasXitypayComponent;
  let fixture: ComponentFixture<PersonasXitypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonasXitypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonasXitypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
