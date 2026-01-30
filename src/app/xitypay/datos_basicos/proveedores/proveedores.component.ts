import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { XitypayService, XpayApiProvider } from 'aliados';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoApiProviderComponent } from 'src/app/shared/borrame/catalogo-api-provider/catalogo-api-provider.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent  extends CrudImpl implements OnInit {

  modo=''
  visible=false
  @ViewChild('top') top:ElementRef

  constructor(
      private libEnvService: LibEnvService,
      private snack:SnackbarService,
      private formBuilder: FormBuilder, 
      private service: XitypayService,
      public dialog: MatDialog  
  ){
    super()
    this.form = this.formBuilder.group({
      ciaopr: new FormControl(null),
      provcod: new FormControl(null,Validators.required),
      provnombre: new FormControl(null,Validators.required),
      descripcion: new FormControl(null,Validators.required),
      url_dom: new FormControl(null,Validators.required),
      puerto: new FormControl(null,Validators.required),
    })
  }

  ngOnInit(): void {
    this.cancelarAction()
    this.setDefaults()
    this.showSpinner = false
  }

  setDefaults():void{
    this.form.patchValue({
      ciaopr: this.libEnvService.getConfig().ciaopr.ciaopr
    })
  }

  // ACCIONES
  override incluirAction(): void {
    this.modo='Incluir'
    super.incluirAction()
    this.setDefaults()
    this.visible=true
  }

  override modificarAction(): void {
    super.modificarAction()
    this.modo = 'Modificar'
    this.visible=true
  }

  override incluir(): void {
    super.incluir()
    if (this.form.status !== 'VALID') {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
      return
    }
    const apiProvider:XpayApiProvider = this.form.getRawValue()
    this.showSpinner = true
    const ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    this.service.createApiProvider(ciaopr, apiProvider).subscribe(
      result=>{
        if (result){
          this.snack.msgSnackBar('Proveedor API incluido correctamente','Aceptar',undefined,'success')
          this.showSpinner=false
          this.form.reset()
          this.setApiAproveedor(result)
          this.visible=false
          this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          this.crud.btnModificar.disabled=false
          this.crud.btnEliminar.disabled=false
        } else {
          this.showSpinner=false
          this.snack.msgSnackBar('Error al registrar','OK',undefined,'error')
        }
      }, error => {
        console.log(error)
        this.showSpinner=false
        this.snack.msgSnackBar(`Error al modificar ${error.error.mensaje}`,'OK',undefined,'error')
      }
    )
  }

    override modificar(): void {
    super.incluir()
    if (this.form.status !== 'VALID') {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
      return
    }
    const apiProvider:XpayApiProvider = this.form.getRawValue()
    this.showSpinner = true
    const ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    this.service.createApiProvider(ciaopr, apiProvider).subscribe(
      result=>{
        if (result){
          this.snack.msgSnackBar('Proveedor API modificado correctamente','Aceptar',undefined,'success')
          this.showSpinner=false
          this.form.reset()
          this.setApiAproveedor(result)
          this.visible=false
          this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          this.crud.btnModificar.disabled=false
          this.crud.btnEliminar.disabled=false
        } else {
          this.showSpinner=false
          this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
        }
      }, error => {
        console.log(error)
        this.showSpinner=false
        this.snack.msgSnackBar(`Error al modificar ${error.error.mensaje}`,'OK',undefined,'error')
      }
    )
  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoApiProviderComponent,
      {data:this.dataDialogo('Búsqueda de Proveedores API',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.setApiAproveedor(result)
        this.modo='Consultar'
      }
      })
  }

  override eliminarAction(): void {
    super.eliminarAction()

    const apiProvider:XpayApiProvider = this.form.getRawValue()
    if (apiProvider.provcod === null || apiProvider.provcod === undefined || apiProvider.provcod === '') {return}
    const provCod:string = apiProvider.provcod

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Eliminar Registro","¿ Está seguro de que desea eliminar el registro ?","Eliminar")} ).afterClosed().subscribe(
        (respuesta)=>{
          if (respuesta) {
            this.showSpinner = true
            this.service.deleteApiProvider(this.libEnvService.getConfig().ciaopr.ciaopr,provCod).subscribe({
              next: () => {
                  this.snack.msgSnackBar('Proveedor eliminado correctamente', 'Ok', undefined, 'success')
                  this.cancelarAction()
                  this.modo=''
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
  

  setApiAproveedor(apiProvider:XpayApiProvider): void {
    this.form.patchValue(apiProvider)
  }


}
