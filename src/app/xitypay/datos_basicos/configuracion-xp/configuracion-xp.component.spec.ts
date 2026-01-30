import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionXpComponent } from './configuracion-xp.component';

describe('ConfiguracionXpComponent', () => {
  let component: ConfiguracionXpComponent;
  let fixture: ComponentFixture<ConfiguracionXpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionXpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionXpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
