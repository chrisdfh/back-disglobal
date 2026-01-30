import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAliadoTemporalComponent } from './catalogo-aliado-temporal.component';

describe('CatalogoAliadoTemporalComponent', () => {
  let component: CatalogoAliadoTemporalComponent;
  let fixture: ComponentFixture<CatalogoAliadoTemporalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoAliadoTemporalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAliadoTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
