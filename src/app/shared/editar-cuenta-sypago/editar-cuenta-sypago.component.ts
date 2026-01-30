import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CtaSypago, XitypayService } from 'aliados';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-editar-cuenta-sypago',
  templateUrl: './editar-cuenta-sypago.component.html',
  styleUrls: ['./editar-cuenta-sypago.component.css']
})
export class EditarCuentaSypagoComponent implements OnInit, AfterViewInit{
  @ViewChild('btnTrue') btnTrue:ElementRef
  @ViewChild('inputQuery') inputQuery:ElementRef

  form:FormGroup
  showSpinner = false

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:any,
    protected dialogRef:MatDialogRef<boolean>,
    private snack:SnackbarService,
    private service:XitypayService,
    public libEnvService: LibEnvService,
    public dialog: MatDialog
  ){
    this.form = new FormGroup({
      usersypago: new FormControl('',Validators.required),
      secret: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      activo: new FormControl('',Validators.required),
    })
  }

  ngOnInit(): void {
    this.form.patchValue(this.data.cuenta)
    this.form.patchValue({
      activo:this.data.cuenta.activo=='S'?true:false
    })
  }

  ngAfterViewInit(): void {
    this.inputQuery.nativeElement.focus()
  }

  sendInput(){
    if (this.form.get('activo')?.value == '') {
      this.form.patchValue({activo:false})
    }
    if (this.form.status !== 'VALID'){
      this.form.markAllAsTouched()
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','OK',undefined,'error')
      return
    }
    const cuenta:CtaSypago = this.form.getRawValue()
    this.dialogRef.close(cuenta)
  }

}
