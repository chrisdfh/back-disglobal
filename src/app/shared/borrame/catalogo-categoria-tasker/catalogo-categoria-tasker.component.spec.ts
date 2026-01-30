import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCategoriaTaskerComponent } from './catalogo-categoria-tasker.component';

describe('CatalogoCategoriaTaskerComponent', () => {
  let component: CatalogoCategoriaTaskerComponent;
  let fixture: ComponentFixture<CatalogoCategoriaTaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoCategoriaTaskerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoCategoriaTaskerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
