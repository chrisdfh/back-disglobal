import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasXitypayComponent } from './plantillas-xitypay.component';

describe('PlantillasXitypayComponent', () => {
  let component: PlantillasXitypayComponent;
  let fixture: ComponentFixture<PlantillasXitypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillasXitypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillasXitypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
