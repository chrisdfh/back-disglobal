import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordView, LibEnvService, UserView2Persona, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoUsuariosComponent } from '../borrame/catalogo-usuarios/catalogo-usuarios.component';
import { Md5 } from 'ts-md5';
import { microMensaje } from 'aliados';

@Component({
  selector: 'app-update-contrasena',
  templateUrl: './update-contrasena.component.html',
  styleUrls: ['./update-contrasena.component.css']
})
export class UpdateContrasenaComponent implements OnInit{

  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
  }

  form:FormGroup

  showSpinner = false
  passwordChanged = false
  passwordChangedMessage:string
  ciaopr:string 
  codnip:string

  constructor(
    public dialog:MatDialog,
    private snack:SnackbarService,
    private service:UsuariosService,
    private activeRouter: ActivatedRoute,
    public libEnvService: LibEnvService,
  ){
    this.form = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
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
        console.log(result)
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

    this.service.changePassword(this.ciaopr,newPassword).subscribe({
      next: (result:microMensaje) => {
        console.log(result)
        if (result) {
          this.showSpinner = false
          this.passwordChanged = true
          this.passwordChangedMessage = result.mensaje
          this.form.reset()
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
    console.log(this.form.getRawValue())
  }


}
