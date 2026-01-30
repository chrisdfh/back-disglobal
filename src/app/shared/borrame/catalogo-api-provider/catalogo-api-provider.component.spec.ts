import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoApiProviderComponent } from './catalogo-api-provider.component';

describe('CatalogoApiProviderComponent', () => {
  let component: CatalogoApiProviderComponent;
  let fixture: ComponentFixture<CatalogoApiProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoApiProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoApiProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
