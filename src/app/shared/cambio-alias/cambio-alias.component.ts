import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AfiliadoView, AliadoWrap, microError, microMensaje, TaskerView } from 'aliados';
import { LibEnvService, PersonasService, UpdateAliasView, UserView2, UserView2Persona, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAfiliadoComponent } from '../borrame/catalogo-afiliado/catalogo-afiliado.component';
import { CatalogoAliadoComponent } from '../borrame/catalogo-aliado/catalogo-aliado.component';
import { CatalogoTaskerComponent } from '../borrame/catalogo-tasker/catalogo-tasker.component';
import { CatalogoUsuariosComponent } from '../borrame/catalogo-usuarios/catalogo-usuarios.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cambio-alias',
  templateUrl: './cambio-alias.component.html',
  styleUrls: ['./cambio-alias.component.css']
})
export class CambioAliasComponent implements OnInit{



  showSpinner = false
  passwordChanged = false
  passwordChangedMessage:string
  form:FormGroup
  ciaopr:string 

  constructor(
    public dialog:MatDialog,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    private activeRouter: ActivatedRoute,
    public libEnvService: LibEnvService,
    private service:UsuariosService){
    this.form = this.formBuilder.group({
      alias: new FormControl('',Validators.required),
      alias_new: new FormControl('',Validators.required),
    })

  }


  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    this.activeRouter.params.subscribe(params => {
      if (params['nrousuario']){
        this.showSpinner = true
        this.form.reset()
        this.service.getUsuario(this.libEnvService.getConfig().ciaopr.ciaopr,params['nrousuario']).subscribe({
          next:(resp:UserView2Persona)=>{
            this.form.patchValue({
              alias: resp.alias,
            })
          },
          error:(err)=>{
            this.snack.msgSnackBar(err.error,'OK',undefined,'error')
            console.log(err)
          },
          complete:()=>{this.showSpinner = false}
        })
      }
    })


  }

  dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,opciones?:string){
    return {
      "titulo":titulo,
      "msg":mensaje || '',
      "btn_true_text":textoBotonTrue || 'Aceptar',
      "btn_false_text":textoBotonFalse || 'Cancelar',
      "cant_registros": cantRegistros || 25,
      "campousuariochar_1":opciones || undefined
    }
  }

  getAfiliado():void{
    return
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAfiliadoComponent,{data:this.dataDialogo("Búsqueda de Afiliado", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:AfiliadoView)=>{
        if (!result)return
        this.form.patchValue({
          alias:result.alias,
          tipo_usuario:'afiliado'
        })
      }
    )
  }

  getAliado():void{
    return
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAliadoComponent,{data:this.dataDialogo("Búsqueda de Aliado", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:AliadoWrap)=>{
        if (!result)return
        this.form.patchValue({
          alias:result.alias,
          tipo_usuario:'aliado'
        })
      }
    )
  }
  getTasker():void{
    return
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoTaskerComponent,{data:this.dataDialogo("Búsqueda de Tasker", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:TaskerView)=>{
        if (!result)return
        this.form.patchValue({
          alias:result.alias,
          tipo_usuario:'tasker'
        })
      }
    )
  }

  getUsuario():void{
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoUsuariosComponent,{data:this.dataDialogo("Búsqueda de Usuarios", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:UserView2)=>{
        if (!result)return
        this.form.patchValue({
          alias:result.alias,
        })
      }
    )
  }



  formatAlias(e:KeyboardEvent):void{
    e.preventDefault()
    const el = e.target as HTMLInputElement
    this.form.patchValue({
      // alias_new:el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:; ]+/g, '')
      alias_new:el.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:; ]+/g, '')
    })
  }

  changeUsername():void{

    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }



    this.showSpinner=true
    const datosCambioAlias:UpdateAliasView = this.form.getRawValue()
    datosCambioAlias.ciaopr = '1'
    this.service.changeAlias(this.ciaopr,datosCambioAlias).subscribe(
      (result:any)=>{
        if(Object.prototype.hasOwnProperty.call(result,'error') && result.error ==='error.club_usuario.forbidden'){
          this.snack.msgSnackBar('Nombre de usuario ya se encuentra asignado','OK')
          return
        }
        if(result.mensaje==='Alias cambiado exitosamente'){
          this.passwordChanged=true
          this.passwordChangedMessage = result.mensaje
          this.form.reset()
        }
      },
      (error)=>{
        console.log(error)
        this.snack.msgSnackBar(error,'OK')
      },
      ()=>{this.showSpinner=false}
    )
  }


}
