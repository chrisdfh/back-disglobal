import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoTaskerComponent } from './catalogo-tasker.component';

describe('CatalogoTaskerComponent', () => {
  let component: CatalogoTaskerComponent;
  let fixture: ComponentFixture<CatalogoTaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoTaskerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoTaskerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
