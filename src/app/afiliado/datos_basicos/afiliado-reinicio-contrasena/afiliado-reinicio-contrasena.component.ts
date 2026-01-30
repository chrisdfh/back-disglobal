import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AfiliadoService, AfiliadoView, ResetAliadoPassword } from 'aliados';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAfiliadoComponent } from 'src/app/shared/borrame/catalogo-afiliado/catalogo-afiliado.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-afiliado-reinicio-contrasena',
  templateUrl: './afiliado-reinicio-contrasena.component.html',
  styleUrls: ['./afiliado-reinicio-contrasena.component.css']
})
export class AfiliadoReinicioContrasenaComponent extends CrudImpl implements OnInit{

  passwordChanged:boolean
  passwordChangedMessage:string
  dataCambioPassword:ResetAliadoPassword = new ResetAliadoPassword()

constructor(
  public dialog:MatDialog,
  public formBuilder:FormBuilder,
  private snack:SnackbarService,
  public libEnvServ: LibEnvService,
  private service:AfiliadoService){
    super()
    this.form = this.formBuilder.group({
        nroafiliado: new FormControl<number|null>(null,Validators.required),
        usuario: new FormControl(null,Validators.required),
        codnip:new FormControl(null),
        correo: new FormControl(null)
    })
  }

  ngOnInit(): void {
      this.cargaAfiliado()
  }

  cargaAfiliado():void{
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAfiliadoComponent,{data: this.dataDialogo("Búsqueda de Afiliado",undefined,undefined,undefined,25)}).afterClosed().subscribe(
        result=>{
            if(result){
                result = result as AfiliadoView
                this.form.patchValue({
                    nroafiliado:result.nroafiliado,
                    usuario:result.alias,
                    codnip:result.codnip,
                    correo:result.email_publico
                })
                console.log('==>')
                console.log(this.form.value)
                
            }
        }
    )
  }

  resetPwd():void{
    if(this.form.status==='VALID'){
      // NOS ASEGURAMOS DE QUE SE QUIERA CAMBIAR LA CONTRASEÑA

      this.dialog.open(CatalogoGenericoComponent,
        {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
        data: this.dataDialogo("Contraseña Afiliado","¿Está seguro de que desea reestablecer la contraseña? Este proceso no es reversible","Reestablecer")})
        .afterClosed().subscribe(
          (respuesta)=>{
            if (respuesta) {
                this.resetAction()
            } else {
                console.log('cancelado')
            }
          })
        }
  }

  resetAction():void{
     const username = this.form.get('usuario')?.value
     if (username === null || username.trim() === ''){return}

    this.showSpinner=true
    this.service.resetAfiliadoPasswordWithMail(this.libEnvServ.getConfig().ciaopr.ciaopr,username).subscribe(
      result=>{
        this.passwordChanged=true
        this.passwordChangedMessage=result.mensaje + ', en el próximo login deberá usar como contraseña: ' + this.form.get('codnip')?.value + '. Este dato fué enviado a su correo electrónico'
        this.showSpinner=false
      },error=>{
        console.log(error)
        this.passwordChanged=false
        this.passwordChangedMessage=''
        this.showSpinner=false
      }
    )
  }


}
