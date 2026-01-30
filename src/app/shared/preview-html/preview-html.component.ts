import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-preview-html',
  templateUrl: './preview-html.component.html',
  styleUrls: ['./preview-html.component.css']
})
export class PreviewHtmlComponent implements OnInit ,AfterViewInit{

  @ViewChild('renderedHtml') renderedHtml:ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:parseHtmlData,
    protected dialogRef:MatDialogRef<boolean>,
    private snack:SnackbarService,
    public libEnvService: LibEnvService,
    public dialog: MatDialog){}

  ngOnInit(): void {
    console.log(' ')
  }
  ngAfterViewInit(): void {
    const regex = /\{\{([^}]+)\}\}/g
    const body = this.data.html.replaceAll(regex,'')
    this.renderedHtml.nativeElement.srcdoc = body
  }
}

interface parseHtmlData{
  title:string
  html:string
}