import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { XitypayService, XpayPlantilla, XplayPlantilla } from 'aliados';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoPlantillaComponent } from 'src/app/shared/borrame/catalogo-plantilla/catalogo-plantilla.component';
import { PreviewHtmlComponent } from 'src/app/shared/preview-html/preview-html.component';
import { CrudImpl } from 'vcore';


@Component({
  selector: 'app-plantillas-xitypay',
  templateUrl: './plantillas-xitypay.component.html',
  styleUrls: ['./plantillas-xitypay.component.css']
})
export class PlantillasXitypayComponent  extends CrudImpl implements OnInit {

  tablasApoyo:TablasApoyo
  visible:boolean
  modo=''

  constructor(
      private libEnvService: LibEnvService,
      private snack:SnackbarService,
      private formBuilder: FormBuilder, 
      private service: XitypayService,
      public dialog: MatDialog
    ) {
    super()
    this.form = this.formBuilder.group({
      ciaopr: new FormControl(''),
      correlativo: new FormControl(''),
      nombre: new FormControl('',Validators.required),
      not_email_cuenta: new FormControl(''),
      not_email_pagador: new FormControl(''),
      not_email_pec: new FormControl(''),
      not_tg_cuenta: new FormControl(''),
      not_tg_pec: new FormControl(''),
      not_sms_cuenta: new FormControl(''),
      not_sms_pagador: new FormControl(''),
      not_sms_pec: new FormControl(''),
      not_ws_cuenta: new FormControl(''),
      not_ws_pagador: new FormControl(''),
      not_ws_pec: new FormControl(''),
      enlace_email: new FormControl(''),
      vinculacion_tg: new FormControl(''),
      plantilla_1: new FormControl(''),
      plantilla_2: new FormControl(''),
      plantilla_3: new FormControl(''),
      plantilla_4: new FormControl(''),
      plantilla_5: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.showSpinner = false
    this.modo = ''
  }

  protected override cancelarAction(): void {
    super.cancelarAction()
    this.setDefaults()
    this.modo = ''
  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoPlantillaComponent,{data:this.dataDialogo('Búsqueda de Plantillas de notificación',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:XpayPlantilla)=>{
      if (result){
        this.setPlantilla(result)
        this.modo='Consultar'
      } else {
        this.cancelarAction()
      }
    })
  }

  setPlantilla(plantilla:XpayPlantilla){
    this.form.patchValue(plantilla)
  }

  previewPlantilla(formElement:string){
    this.dialog.open(PreviewHtmlComponent,{width:'100%',height:'100%',data:{title:'Plantilla',html:formElement}}).afterClosed().subscribe()
  }

  
    override incluirAction(): void {
      this.modo='Incluir'
      super.incluirAction()
      this.setDefaults()
      this.visible=true
    }
  
    protected override modificarAction(): void {
      super.modificarAction()
      this.modo = 'Modificar'
      this.visible=true
    }

    setDefaults():void{
      this.form.patchValue({ciaopr: this.libEnvService.getConfig().ciaopr.ciaopr})
    }


    override incluir(): void {
      if (this.form.status !== 'VALID'){
        this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
        this.form.markAllAsTouched()
        return
      }

      const plantilla:XplayPlantilla = this.form.getRawValue()

      super.incluir()
      this.visible=false
      this.showSpinner=true
      this.service.upsertPlantilla(this.libEnvService.getConfig().ciaopr.ciaopr,plantilla).subscribe({
        next:(result:XpayPlantilla)=>{
          if (result) {
            this.snack.msgSnackBar('Plantilla creada correctamente','Ok',undefined,'success')
            this.setPlantilla(result)
            this.form.disable()
            this.showSpinner = false
            this.crud.btnModificar.disabled=false
          } else {
            console.log('hubo un error')
            this.showSpinner=false
            this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
          }
        },
        error:(error:HttpErrorResponse)=>{
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al guardar ${error.error.mensaje}`,'OK',undefined,'error')
        },complete:()=>this.showSpinner=false
      })
    }


    override modificar(): void {
      if (this.form.status !== 'VALID'){
        this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
        this.form.markAllAsTouched()
        return
      }

      const plantilla:XplayPlantilla = this.form.getRawValue()

      super.incluir()
      this.visible=false
      this.showSpinner=true
      this.service.upsertPlantilla(this.libEnvService.getConfig().ciaopr.ciaopr,plantilla).subscribe({
        next:(result:XpayPlantilla)=>{
          if (result) {
            this.snack.msgSnackBar('Plantilla modificada correctamente','Ok',undefined,'success')
            this.setPlantilla(result)
            this.form.disable()
            this.showSpinner = false
            this.crud.btnModificar.disabled=false
          } else {
            console.log('hubo un error')
            this.showSpinner=false
            this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
          }
        },
        error:(error:HttpErrorResponse)=>{
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al modificar ${error.error.mensaje}`,'OK',undefined,'error')
        },complete:()=>this.showSpinner=false
      })
    }

    override eliminar(): void {
      super.eliminar()
    }
    
    override eliminarAction(): void {
      super.eliminarAction()
  
      const plantilla:XpayPlantilla = this.form.getRawValue()
  
      this.showSpinner = true
      this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
        data: this.dataDialogo("Eliminar Registro",`¿Está seguro de que desea eliminar la plantilla "${plantilla.nombre}"?`,"Eliminar")} ).afterClosed().subscribe(
          (respuesta)=>{
            if (respuesta) {
              this.service.deletePlantilla(this.libEnvService.getConfig().ciaopr.ciaopr,plantilla.correlativo).subscribe({
                next: () => {
                    this.snack.msgSnackBar('Plantilla eliminada correctamente', 'Ok', undefined, 'success')
                    this.cancelarAction()
                },
                error: (e) => {
                  console.log(e.error)
                  this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')
                  this.showSpinner = false
                },
                complete: ()=>{
                  this.cancelarAction()
                  this.showSpinner = false
                }
              })
            } else {
              this.showSpinner = false
            }
          }
        )
  
    }
}
