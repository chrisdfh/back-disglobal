import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaUsuarioXpComponent } from './crea-usuario-xp.component';

describe('CreaUsuarioXpComponent', () => {
  let component: CreaUsuarioXpComponent;
  let fixture: ComponentFixture<CreaUsuarioXpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaUsuarioXpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaUsuarioXpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
