import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadoGrillaComponent } from './aliado-grilla.component';

describe('AliadoGrillaComponent', () => {
  let component: AliadoGrillaComponent;
  let fixture: ComponentFixture<AliadoGrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliadoGrillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliadoGrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
