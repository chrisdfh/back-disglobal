import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-catalogo-generico',
  templateUrl: './catalogo-generico.component.html',
  styleUrls: ['./catalogo-generico.component.css'],
})
export class CatalogoGenericoComponent implements AfterViewInit{

  @ViewChild('btnTrue') btnTrue:ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:any,
    protected dialogRef:MatDialogRef<boolean>
  ){}

  // DESPUÉS DE MOSTRAR EL MODAL, COLOCAR EL FOCUS SOBRE EL BOTÓN 'OK'
  ngAfterViewInit(): void {
    setTimeout(()=>{ this.btnTrue.nativeElement.focus()},0)
  }
}
