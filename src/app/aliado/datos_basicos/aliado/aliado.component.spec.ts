import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadoComponent } from './aliado.component';

describe('AliadoComponent', () => {
  let component: AliadoComponent;
  let fixture: ComponentFixture<AliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
