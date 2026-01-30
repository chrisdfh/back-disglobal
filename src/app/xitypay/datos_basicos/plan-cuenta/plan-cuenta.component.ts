import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlanCuenta, XitypayService } from 'aliados';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoPlanCuentaXpComponent } from 'src/app/shared/borrame/catalogo-plan-cuenta-xp/catalogo-plan-cuenta-xp.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-plan-cuenta',
  templateUrl: './plan-cuenta.component.html',
  styleUrls: ['./plan-cuenta.component.css']
})
export class PlanCuentaComponent extends CrudImpl implements OnInit  {

  tablasApoyo:TablasApoyo

  visible:boolean

  modo=''

  ngOnInit(): void {

    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.setDefaults()
    this.showSpinner = false
  }

  constructor(
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: XitypayService,
    public dialog: MatDialog) {
      super()
      this.form = this.formBuilder.group({
        ciaopr: new FormControl(''),
        id_plan: new FormControl('',Validators.required), //
        nombre: new FormControl('',Validators.required), //
        
        comision_ent_banco: new FormControl('',Validators.required), //
        comision_sal_banco: new FormControl('',Validators.required), //
        comision_sal_otro_banco: new FormControl('',Validators.required), //
        comision_xp: new FormControl('',Validators.required), //

        com_entr_bancocod: new FormControl(''),
        com_entr_bancocta: new FormControl(''),
        com_entr_ctatipo: new FormControl(''),
        com_entr_tipnip: new FormControl(''),
        com_entr_codnip: new FormControl(''),

        com_sal_bancocod: new FormControl(''),
        com_sal_bancocta: new FormControl(''),
        com_sal_ctatipo: new FormControl(''),
        com_sal_tipnip: new FormControl(''),
        com_sal_codnip: new FormControl(''),

        com_sal_otro_banco_bancocod: new FormControl(''),
        com_sal_otro_banco_bancocta: new FormControl(''),
        com_sal_otro_banco_ctatipo: new FormControl(''),
        com_sal_otro_banco_tipnip: new FormControl(''),
        com_sal_otro_banco_codnip: new FormControl(''),

        com_xp_bancocod: new FormControl(''),
        com_xp_bancocta: new FormControl(''),
        com_xp_ctatipo: new FormControl(''),
        com_xp_tipnip: new FormControl(''),
        com_xp_codnip: new FormControl(''),
      })
    }

  protected override cancelarAction(): void {
    super.cancelarAction()
    this.modo = ''
  }

  setDefaults(): void {
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoPlanCuentaXpComponent,{data:this.dataDialogo('Búsqueda de Plan de Cuenta',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.setPlanCuenta(result)
        this.modo='Consultar'
      }
    })
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

  setPlanCuenta(planCuenta:PlanCuenta):void{
    this.setDefaults()
    this.form.patchValue({
      comision_sal_banco: 0.00,
      comision_ent_banco: 0.00,
      comision_sal_otro_banco: 0.00,
      comision_xp: 0.00
    })
    this.form.patchValue(planCuenta)
  }

  override incluir(): void {
    super.incluir()
    if (this.form.status === 'INVALID'){
      this.form.markAllAsTouched()
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      return
    }
    this.showSpinner=true
    const plan = this.form.getRawValue()
    plan.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    this.service.createPlanXPay(plan.ciaopr,plan).subscribe({
      next:(result:PlanCuenta)=>{
        if (result) {
          this.snack.msgSnackBar('Plan de Cuenta Creado correctamente','Ok',undefined,'success')
          this.setPlanCuenta(result)
          this.form.disable()
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
    super.modificar()
    if (this.form.status === 'INVALID'){
      this.form.markAllAsTouched()
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      return
    }
    this.showSpinner=true
    const plan = this.form.getRawValue()
    plan.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    this.service.modificaPlanXPay(plan.ciaopr,plan).subscribe({
      next:(result:PlanCuenta)=>{
        if (result) {
          this.snack.msgSnackBar('Plan de Cuenta Modificado correctamente','Ok',undefined,'success')
          this.setPlanCuenta(result)
          this.form.disable()
          this.showSpinner = false
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

    const plan:PlanCuenta = this.form.getRawValue()

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Eliminar Registro","Está seguro de que desea eliminar el registro","Eliminar")} ).afterClosed().subscribe(
        (respuesta)=>{
          if (respuesta) {
            this.showSpinner = true
            this.service.deletePlanXPay(this.libEnvService.getConfig().ciaopr.ciaopr,plan.id_plan).subscribe({
              next: () => {
                  this.snack.msgSnackBar('Plan eliminado correctamente', 'Ok', undefined, 'success')
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
          } else {
            this.showSpinner = false
          }
        }
      )

  }
  


}
