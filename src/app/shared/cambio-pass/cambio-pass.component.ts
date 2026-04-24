import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordView, LibEnvService, UserView2Persona, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoUsuariosComponent } from '../borrame/catalogo-usuarios/catalogo-usuarios.component';
import { Md5 } from 'ts-md5';
import { microMensaje } from 'aliados';
import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.component.html',
  styleUrls: ['./cambio-pass.component.css']
})
export class CambioPassComponent  implements OnInit{

  
  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    this.codnip = this.data.sub.codnip
  }

  form:FormGroup

  showSpinner = false
  passwordChanged = false
  passwordChangedMessage:string
  ciaopr:string 
  codnip:string

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:XPLoginResponseDecoded,
    public dialog:MatDialog,
    protected dialogRef:MatDialogRef<boolean>,
    private snack:SnackbarService,
    private service:UsuariosService,
    private activeRouter: ActivatedRoute,
    public libEnvService: LibEnvService,
  ){
    this.form = new FormGroup({
      username: new FormControl(data.sub.alias,Validators.required),
      password: new FormControl(Md5.hashStr(data.sub.codnip),Validators.required),
      new_password: new FormControl('',Validators.required),
      renew_password: new FormControl('',Validators.required),
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

  getUsuario():void{
    this.codnip=''
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoUsuariosComponent,{data:this.dataDialogo("Búsqueda de Usuarios", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:UserView2Persona)=>{
        if (!result)return
        // console.log(result)
        this.codnip=result.persona.codnip
        this.form.patchValue(
          {
            username:result.alias,
            password:result.password
          }
        )
      }
    )
  }



  changePwd():void{
    if (this.form.status !== 'VALID') {
      this.form.markAllAsTouched()
      return
    }

    if (this.form.get('new_password')?.value !== this.form.get('renew_password')?.value) {
      this.snack.msgSnackBar('Las contraseñas no coinciden', 'Corregir', undefined, 'warning')
      return
    }

    if (this.codnip === this.form.get('new_password')?.value) {
      this.snack.msgSnackBar('Nueva contraseña no puede ser igual a su documento de identidad', 'Corregir', undefined, 'warning')
      return
    }

    this.showSpinner = true
    const newPassword:ChangePasswordView = this.form.getRawValue()

    newPassword.ciaopr = this.ciaopr
    newPassword.username = this.form.get('username')?.value
    newPassword.new_password = Md5.hashStr(this.form.get('new_password')?.value)
    newPassword.renew_password = Md5.hashStr(this.form.get('renew_password')?.value)

    // if (newPassword.password === Md5.hashStr(this.codnip)) {
    //   this.passwordChanged = true
    //   this.passwordChangedMessage = 'Contraseña no puede ser su documento de identidad'
    //   this.showSpinner = false
    //   return
    // }

    this.service.changePassword(this.ciaopr,newPassword).subscribe({
      next: (result:microMensaje) => {
        // console.log(result)
        if (result) {
          this.showSpinner = false
          this.passwordChanged = true
          this.passwordChangedMessage = result.mensaje
          this.form.reset()
          this.dialogRef.close(true)  
        } else {
          this.snack.msgSnackBar('Error al cambiar la contraseña', 'OK', undefined, 'error')
          this.showSpinner = false
          this.passwordChanged = true
        }
      },
      error: (err) => {
        console.log(err)
        this.snack.msgSnackBar('Error al cambiar la contraseña', 'OK', undefined, 'error')
      },
      complete: () => {
        this.showSpinner = false
      }
    })
    // console.log(this.form.getRawValue())
  }


}


class XPLoginResponseDecoded{
  sub:MiniUsuario
}

class MiniUsuario{
  xpaycta:miniXPCuenta[]
  alias:string
  codnip:string
}

class miniXPCuenta{
  xpayctanro: string;
  email: string;
  cuenta_transitoria: string;
  federado_estricto: string;
  nombre: string;
  alias: string;
  email_publico: string;
  url_avatar1: string;
  nombrepersjuridica: string;
  siglaspersjuridica: string;
  nombrecompleto: string;
  nombrecorto: string;
  usr_x_cta: Usrxcta;
}

interface Usrxcta {
  rol_1: string;
}