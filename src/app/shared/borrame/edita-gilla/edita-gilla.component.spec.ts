import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaGillaComponent } from './edita-gilla.component';

describe('EditaGillaComponent', () => {
  let component: EditaGillaComponent;
  let fixture: ComponentFixture<EditaGillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaGillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditaGillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
