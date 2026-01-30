import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPlantillaComponent } from './catalogo-plantilla.component';

describe('CatalogoPlantillaComponent', () => {
  let component: CatalogoPlantillaComponent;
  let fixture: ComponentFixture<CatalogoPlantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoPlantillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
