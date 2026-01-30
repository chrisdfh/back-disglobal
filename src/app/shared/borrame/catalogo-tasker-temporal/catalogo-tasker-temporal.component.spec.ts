import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoTaskerTemporalComponent } from './catalogo-tasker-temporal.component';

describe('CatalogoTaskerTemporalComponent', () => {
  let component: CatalogoTaskerTemporalComponent;
  let fixture: ComponentFixture<CatalogoTaskerTemporalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoTaskerTemporalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoTaskerTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
