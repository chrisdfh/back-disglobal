import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPlanCuentaXpComponent } from './catalogo-plan-cuenta-xp.component';

describe('CatalogoPlanCuentaXpComponent', () => {
  let component: CatalogoPlanCuentaXpComponent;
  let fixture: ComponentFixture<CatalogoPlanCuentaXpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoPlanCuentaXpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoPlanCuentaXpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
