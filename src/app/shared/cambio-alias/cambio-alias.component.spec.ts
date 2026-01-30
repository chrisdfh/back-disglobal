import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioAliasComponent } from './cambio-alias.component';

describe('CambioAliasComponent', () => {
  let component: CambioAliasComponent;
  let fixture: ComponentFixture<CambioAliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioAliasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
