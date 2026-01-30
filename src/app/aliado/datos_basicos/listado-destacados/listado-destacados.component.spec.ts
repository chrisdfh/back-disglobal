import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDestacadosComponent } from './listado-destacados.component';

describe('ListadoDestacadosComponent', () => {
  let component: ListadoDestacadosComponent;
  let fixture: ComponentFixture<ListadoDestacadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoDestacadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoDestacadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
