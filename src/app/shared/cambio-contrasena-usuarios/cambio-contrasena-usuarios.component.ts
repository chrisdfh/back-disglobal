import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordView, LibEnvService, PersonasService, RequestUpdatePassword, UserView2, UserView2Persona, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAfiliadoComponent } from '../borrame/catalogo-afiliado/catalogo-afiliado.component';
import { AfiliadoView, AliadoWrap } from 'aliados';
import { CatalogoAliadoComponent } from '../borrame/catalogo-aliado/catalogo-aliado.component';
import { CatalogoTaskerComponent } from '../borrame/catalogo-tasker/catalogo-tasker.component';
import { CatalogoUsuariosComponent } from '../borrame/catalogo-usuarios/catalogo-usuarios.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cambio-contrasena-usuarios',
  templateUrl: './cambio-contrasena-usuarios.component.html',
  styleUrls: ['./cambio-contrasena-usuarios.component.css']
})
export class CambioContrasenaUsuariosComponent implements OnInit {

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
      username: new FormControl('',Validators.required),
      codnip: new FormControl(''),
      email_publico: new FormControl(''),
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
              username: resp.alias,
              codnip:resp.persona.codnip,
              email_publico:resp.email_publico
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
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAfiliadoComponent,{data:this.dataDialogo("Búsqueda de Afiliado", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:AfiliadoView)=>{
        if (!result)return
        this.form.patchValue({
          codnip:result.codnip,
          username:result.alias,
          email_publico:result.email_publico,
          tipo_usuario:'afiliado'
        })
      }
    )
  }

  getAliado():void{
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAliadoComponent,{data:this.dataDialogo("Búsqueda de Aliado", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:AliadoWrap)=>{
        if (!result)return
        this.form.patchValue({
          codnip:result.persona.codnip,
          username:result.alias,
          email_publico:result.email_publico,
          tipo_usuario:'aliado'
        })
      }
    )
  }
  getTasker():void{
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoTaskerComponent,{data:this.dataDialogo("Búsqueda de Tasker", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:AliadoWrap)=>{
        if (!result)return
        this.form.patchValue({
          codnip:result.persona.codnip,
          username:result.alias,
          email_publico:result.email_publico,
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
      (result:UserView2Persona)=>{
        if (!result)return
        this.form.patchValue(
          {
            username:result.alias,
            email_publico:result.email_publico,
            codnip:result.persona.codnip,
          }
        )
      }
    )
  }

  resetPwd():void{

    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }

    this.showSpinner=true
    const datosCambioCorreo:ChangePasswordView = this.form.getRawValue()
    datosCambioCorreo.ciaopr = '1'
    this.service.resetPassword(this.ciaopr,datosCambioCorreo).subscribe(
      (result)=>{
        this.passwordChanged=true
        this.passwordChangedMessage = result.mensaje + ', en el próximo login deberá usar como contraseña: ' + this.form.get('codnip')?.value
        this.form.reset()
        this.form.patchValue({
          codnip:'',
        })
        // this.snack.msgSnackBar(''Ok')
      },
      (error)=>{
        console.log(error)
        this.snack.msgSnackBar(error,'OK')
      },
      ()=>{this.showSpinner=false}
    )
  }

}
