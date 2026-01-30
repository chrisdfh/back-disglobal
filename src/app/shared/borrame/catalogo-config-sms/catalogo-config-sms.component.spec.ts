import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoConfigSmsComponent } from './catalogo-config-sms.component';

describe('CatalogoConfigSmsComponent', () => {
  let component: CatalogoConfigSmsComponent;
  let fixture: ComponentFixture<CatalogoConfigSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoConfigSmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoConfigSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
