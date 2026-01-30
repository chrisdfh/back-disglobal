import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoHashtagsComponent } from './catalogo-hashtags.component';

describe('CatalogoHashtagsComponent', () => {
  let component: CatalogoHashtagsComponent;
  let fixture: ComponentFixture<CatalogoHashtagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoHashtagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoHashtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
