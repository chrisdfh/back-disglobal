import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XpayMoneda } from 'aliados';
import * as moment from 'moment'

@Component({
  selector: 'app-editar-moneda-xitypay',
  templateUrl: './editar-moneda-xitypay.component.html',
  styleUrls: ['./editar-moneda-xitypay.component.css']
})
export class EditarMonedaXitypayComponent implements OnInit, AfterViewInit{

  @ViewChild('inputQuery') input:ElementRef
  showSpinner=false
  form:FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:any,
      private dialog: MatDialogRef<boolean>){
      this.form = new FormGroup({
        moneda:new FormControl('', Validators.required),
        nombre:new FormControl('', Validators.required),
        tasa_ves: new FormControl('', Validators.required),
        fecha:new FormControl(''),
        activo:new FormControl('')
      })
    }
  ngOnInit(): void {
    if (typeof this.data.moneda != undefined && this.data.moneda != null) {

      console.log(this.data.moneda)
      this.form.patchValue(this.data.moneda)
      this.form.patchValue({
        activo:this.data.moneda.activo=='S'?true:false
      })
    }
    if (this.form.get('fecha')?.value == '')
      this.form.patchValue({
        fecha: moment(Date()).format('YYYY-MM-DDTHH:mm:ss-04:00'),
      }
    )
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.input.nativeElement.focus()
    }, 0);
  }

  returnModMomeda():void{
    if (this.form.status != 'VALID') {
      this.form.markAllAsTouched
      return
    }

    if (this.form.get('activo')?.value == '' || this.form.get('activo')?.value == null){
      this.form.patchValue({
        activo: false
      })
    }
    const moneda:XpayMoneda = this.form.getRawValue()
    this.dialog.close(moneda)
  }


}

