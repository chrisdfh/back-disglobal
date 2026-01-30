import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadoOfertaComponent } from './aliado-oferta.component';

describe('AliadoOfertaComponent', () => {
  let component: AliadoOfertaComponent;
  let fixture: ComponentFixture<AliadoOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliadoOfertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliadoOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
