import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestacaOfertaRangoComponent } from './destaca-oferta-rango.component';

describe('DestacaOfertaRangoComponent', () => {
  let component: DestacaOfertaRangoComponent;
  let fixture: ComponentFixture<DestacaOfertaRangoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestacaOfertaRangoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestacaOfertaRangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
