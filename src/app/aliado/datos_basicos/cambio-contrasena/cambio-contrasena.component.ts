import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AliadoService, ResetAliadoPassword } from 'aliados';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAliadoComponent } from 'src/app/shared/borrame/catalogo-aliado/catalogo-aliado.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.css']
})
export class CambioContrasenaComponent extends CrudImpl implements OnInit{


  passwordChanged:boolean
  passwordChangedMessage:string
  dataCambioPassword:ResetAliadoPassword = new ResetAliadoPassword()

  constructor(
    public dialog:MatDialog,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvServ: LibEnvService,
    private service:AliadoService){
    super()
    this.form = this.formBuilder.group({
      nroaliado: new FormControl<number>(0,Validators.required),
      usuario: new FormControl('',Validators.required),
      correo: new FormControl(''),
      codnip:new FormControl('')
    })
  }

  ngOnInit(): void {
    this.cargaAliado()
  }

  cargaAliado(){
    this.form.reset()
    this.passwordChanged=false
    this.passwordChangedMessage=''
    this.dialog.open(CatalogoAliadoComponent,{data: this.dataDialogo("Búsqueda de Aliado", undefined,undefined,undefined,25)}).afterClosed().subscribe(
      result=>{
        if(result){
          console.log(result)
          this.form.patchValue({
            nroaliado:result.nroaliado,
            usuario:result.alias,
            correo:result.email_publico,
            codnip:result.persona.codnip
          })
        }
      }
    )
  }


  // dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number){
  //   return {
  //     "titulo":titulo,
  //     "msg":mensaje || '',
  //     "btn_true_text":textoBotonTrue || 'Aceptar',
  //     "btn_false_text":textoBotonFalse || 'Cancelar',
  //     "cant_registros": cantRegistros || 25
  //   }
  // }

  resetPwd():void{
    if(this.form.status==='VALID'){
      // NOS ASEGURAMOS DE QUE SE QUIERA CAMBIAR LA CONTRASEÑA

      this.dialog.open(CatalogoGenericoComponent,
        {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
        data: this.dataDialogo("Contraseña Aliado","¿Está seguro de que desea reestablecer la contraseña? Este proceso no es reversible","Reestablecer")})
        .afterClosed().subscribe(
          (respuesta)=>{
            if (respuesta) {
              this.resetAction()
            }
          })
        }
  }

  resetAction():void{
    this.dataCambioPassword={
      ciaopr:this.libEnvServ.getConfig().ciaopr.ciaopr,
      username:this.form.get('usuario')?.value,
    }

    this.showSpinner=true
    this.service.resetPassword(this.libEnvServ.getConfig().ciaopr.ciaopr,this.dataCambioPassword).subscribe(
      result=>{
        this.passwordChanged=true
        this.passwordChangedMessage=result.mensaje + ', en el próximo login deberá usar como contraseña: ' + this.form.get('codnip')?.value
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