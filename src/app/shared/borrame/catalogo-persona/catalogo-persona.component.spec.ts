import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPersonaComponent } from './catalogo-persona.component';

describe('CatalogoPersonaComponent', () => {
  let component: CatalogoPersonaComponent;
  let fixture: ComponentFixture<CatalogoPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
