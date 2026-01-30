import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadArchivosComponent } from './upload-archivos.component';

describe('UploadArchivosComponent', () => {
  let component: UploadArchivosComponent;
  let fixture: ComponentFixture<UploadArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
