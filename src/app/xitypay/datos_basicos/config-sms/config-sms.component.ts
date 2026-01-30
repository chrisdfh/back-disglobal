import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SmsConfig, XitypayService } from 'aliados';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoConfigSmsComponent } from 'src/app/shared/borrame/catalogo-config-sms/catalogo-config-sms.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-config-sms',
  templateUrl: './config-sms.component.html',
  styleUrls: ['./config-sms.component.css']
})
export class ConfigSmsComponent extends CrudImpl implements OnInit {

  modo=''
  visible=false

  constructor(
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: XitypayService,
    public dialog: MatDialog) {
      super()
      this.form = this.formBuilder.group({
        serviciocod: new FormControl('',Validators.required),
        verbo: new FormControl('',Validators.required),
        url_service: new FormControl('',Validators.required),
        from_number: new FormControl('',Validators.required),
        dlr: new FormControl('',Validators.required),
        dlr_level: new FormControl('',Validators.required),
        auth_method: new FormControl('',Validators.required),
        auth_credentials: new FormControl('',Validators.required),
        nombre: new FormControl('',Validators.required),
      })
    }
   ngOnInit(): void {
    this.cancelarAction()
    this.setDefaults()
    this.showSpinner = false
  }

  protected override cancelarAction(): void {
      super.cancelarAction()
      this.modo = ''
  }

  setDefaults(){
    this.form.reset()
  }

  override consultar(): void {
      this.dialog.open(CatalogoConfigSmsComponent,{data:this.dataDialogo('Búsqueda de Configuración SMS',undefined,undefined,undefined,25)})
      .afterClosed().subscribe(result=>{
        if(result){
          this.setConfigSMS(result)
          this.modo='Consultar'
        } else {
          this.form.reset()
          this.form.disable()
          this.visible=false
          this.modo=''
        }
        this.showSpinner = false
      })
  }

  protected override incluirAction(): void {
    super.incluirAction()
    this.modo = 'Incluir'
    this.visible=true
  }
  protected override modificarAction(): void {
    super.modificarAction()
    this.modo = 'Modificar'
    this.visible=true
  }

  setConfigSMS(config:SmsConfig){
    console.log(config)
    this.form.patchValue(
      config
    )
  }

  override incluir(): void {
      if (this.form.status !== 'VALID'){
        this.form.markAllAsTouched()
        this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
        return
      }
      this.showSpinner=true
      const config:SmsConfig = this.form.getRawValue()

      this.service.upsertConfigSMS(this.libEnvService.getConfig().ciaopr.ciaopr,config).subscribe({
        next:(result:SmsConfig)=>{
          if (result) {
            this.snack.msgSnackBar('Configuración SMS Guardada correctamente','Ok',undefined,'success')
            this.setConfigSMS(result)
            this.form.disable()
            this.crud.btnModificar.disabled=false
            this.showSpinner = false
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
    super.modificar
    this.incluir()
  }

  override eliminarAction(): void {

    if (this.form.getRawValue().serviciocod=== undefined || this.form.getRawValue().serviciocod === null || this.form.getRawValue().serviciocod === '') {
      this.snack.msgSnackBar('Debe seleccionar un registro','Ok',undefined,'warning')
      return
    }

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
        data: this.dataDialogo("Eliminar Registro",`¿ Está seguro de que desea eliminar el registro "${this.form.getRawValue().nombre}" (${this.form.getRawValue().serviciocod}) ?`,"Eliminar")} ).afterClosed().subscribe(
          (respuesta)=>{
            if (respuesta) {
              this.showSpinner = true
              this.service.deleteConfigSMS(this.libEnvService.getConfig().ciaopr.ciaopr,this.form.getRawValue().serviciocod).subscribe({
                next: () => {
                    this.snack.msgSnackBar('Configuración SMS eliminada correctamente', 'Ok', undefined, 'success')
                    this.cancelarAction()
                },
                error: (e) => {
                  console.log(e.error)
                  this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')
                },
                complete: ()=>{
                  this.cancelarAction()
                  this.showSpinner = false
                }
              })
            }
          }
        )
  }

}
