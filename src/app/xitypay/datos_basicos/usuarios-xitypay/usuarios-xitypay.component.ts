import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaXityPay, QrUrl, usuarioXityPay, XitypayService, XpayCuenta, XpayUserXCuenta } from 'aliados';
import { LibEnvService, List, UserView2Persona } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoUsuariosComponent } from 'src/app/shared/borrame/catalogo-usuarios/catalogo-usuarios.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { Md5 } from 'ts-md5';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-usuarios-xitypay',
  templateUrl: './usuarios-xitypay.component.html',
  styleUrls: ['./usuarios-xitypay.component.css']
})
export class UsuariosXitypayComponent  extends CrudImpl implements OnInit{

  passwordChanged = false
  passwordChangedMessage:string
  ciaopr:string
  dataSource = new List<usuarioXityPay>()
  displayedColumns = ['nombre','rol_1','alias','eliminar']
  xpayctanro:string
  aliadoNombre:string
  xpaycta:XpayCuenta

  tipoUsuarios:TipoUsuario[]=[
    {cod:"A",desc:"Admin"},
    {cod:"U",desc:"Usuario"},
    {cod:"B",desc:"BackOffice"},
    {cod:"S",desc:"SuperUsuario"}
  ]

  constructor(
    private route: Router,
    private router:ActivatedRoute,
    public dialog:MatDialog,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvService: LibEnvService,
    private service:XitypayService){
      super()
      this.form = this.formBuilder.group({
      codnip: new FormControl('',Validators.required),
      username: new FormControl('',Validators.required),
      email_publico: new FormControl('',Validators.required),
      tipo_usuario: new FormControl(null)
      })

  }

  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    this.router.params.subscribe(params => {
      if (params['xpaycta']){
        this.form.reset()
        this.xpayctanro = ''
        this.aliadoNombre = ''
        this.buscarUsuariosXPayCuenta(params['xpaycta'])
        this.getXpayCta(params['xpaycta'])
      } else {
        this.catalogoXityPayCta()
      }
    })
  }

  getXpayCta(xpayctanro:string):void{
    this.showSpinner = true
    this.service.getXpayCuenta(this.libEnvService.getConfig().ciaopr.ciaopr,xpayctanro).subscribe({
      next:(resp:XpayCuenta)=>{
        this.xpaycta = resp
        
        this.aliadoNombre = resp.nombre ? resp.nombre: ''
      },
      error:(err)=>{
        this.snack.msgSnackBar(err.error,'OK',undefined,'error')
        this.showSpinner = false
        console.log(err)
      },
      complete:()=>{
        this.showSpinner = false
      }
    })
  }

  catalogoXityPayCta(){
    this.xpayctanro = ''
    this.aliadoNombre = ''
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:XpayCuenta)=>{
        this.xpaycta = result
        this.aliadoNombre = result.nombre ? result.nombre: ''
        this.buscarUsuariosXPayCuenta(result.xpayctanro)
    })
  }

  buscarUsuariosXPayCuenta(xpaycta:string|undefined){
    this.dataSource = new List<usuarioXityPay>()
    if (xpaycta){
      this.service.listClubUsuariosAsociadosXpayCuentaSecured(this.ciaopr,xpaycta,100,1).subscribe((
        result=>{
          if (result.results.length > 0){
            // this.aliadoNombre = result.results[0].cuenta.nombrecorto
            this.xpayctanro = xpaycta
            this.dataSource = result
          } else {
            this.xpayctanro = ''
            this.snack.msgSnackBar('No se encontraron resultados','OK',undefined,'warning')
          }
        }
      ),error =>{
        if (error.error.mensaje == "No se encontraron resultados conincidentes con los criterios de búsqueda"){
          this.xpayctanro = xpaycta
        } else {
          console.log(error)
          this.xpayctanro = ''
          this.snack.msgSnackBar('No se encontraron resultados','OK',undefined,'warning')
        }
      })
    }
  }

  eliminarUsuarioXpayCta(user:usuarioXityPay):void{
    this.showSpinner = true

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme eliminación',`¿ ̉Desea quitar el acceso a la persona ${user.usuario.nombrecorto} sobre la cuenta XityPay del aliado ${user.cuenta.nombrecorto} ?`,'Eliminar','Cancelar')}).afterClosed().subscribe(
      result=>{
        if (!result){
          this.showSpinner = false
          return
        } else {
          this.service.eliminaUsuarioXpayCuenta(this.ciaopr, user.xpayctanro, user.nrousuario).subscribe(
            result=>{
                console.log(result)
                this.buscarUsuariosXPayCuenta(user.xpayctanro)
                this.showSpinner = false
            },
            error=>{
              console.log(error)
              this.snack.msgSnackBar(`Error al eliminar ${error.error}`,'OK',undefined,'warning')
              this.showSpinner = false
            }
          )
        }
      }
    )
  }

  agregaUsuarioXpayCuenta():void {
    if (this.xpayctanro === '' || this.xpayctanro === undefined || this.xpayctanro === null) return;
    this.dialog.open(CatalogoUsuariosComponent,{data:this.dataDialogo('Búsqueda de Usuarios',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:UserView2Persona)=>{
        if (result){
          console.log(result)
          const user = new XpayUserXCuenta()
          user.ciaopr = this.ciaopr
          user.nrousuario = result.nrousuario
          user.xpayctanro = this.xpayctanro
          user.rol_1='U'

          this.showSpinner = true

          this.service.asignaUsuarioXpayCuentaSecured(this.ciaopr,user).subscribe(
            resultUser=>{
              if (resultUser){
                this.buscarUsuariosXPayCuenta(this.xpayctanro)
              } else {
                this.snack.msgSnackBar('Error al registrar','OK',undefined,'warning')
              }
              this.showSpinner = false
            },
            (error:HttpErrorResponse)=>{
              console.log(error)
              if (error.error.mensaje.includes('ERROR: duplicate')){
                this.snack.msgSnackBar(`${result.persona.nombrecorto} (${result.alias}) ya es usuario de la cuenta ${this.aliadoNombre}`,'OK',undefined,'warning')
              } else {
                this.snack.msgSnackBar(`Error al registrar: ${error.error.mensaje}`,'OK',undefined,'warning')
              }
              this.showSpinner = false
            }
          )

          this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme la asignación',`¿ Desea adicionalmente asignar a ${result.persona.nombrecorto} como persona en cuenta a la cuenta XityPay del aliado ${this.aliadoNombre} ?`,'SI','NO')})
            .afterClosed()
            .subscribe(
                resultPregunta=>{
                  if (resultPregunta){
                    this.preparaPersonaEnCuenta(user,result)
                  }
                }
              )

      }
    })
  }

  preparaPersonaEnCuenta(user:XpayUserXCuenta,persona_user:UserView2Persona):void{
    const qrData:QrUrl[] = [
      {
        size:256,
        url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(user.xpayctanro)}/monto?pid=${persona_user.nropersona}`,
        file_name:`qr_pd`,
        file_path:`/xitypay/${user.xpayctanro}/pec/${persona_user.nropersona}`,
        qr_field_name:`url_qr1`,
      },
      {
        size:256,
        url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(user.xpayctanro)}/pago?pid=${persona_user.nropersona}`,
        file_name:`qr_pa`,
        file_path:`/xitypay/${user.xpayctanro}/pec/${persona_user.nropersona}`,
        qr_field_name:`url_qr2`,
      }
    ]
    this.service.createPersonaEnCuentaQr(this.ciaopr,qrData).subscribe(
      res=>{
        const persona = new PersonaXityPay()
        persona.ciaopr = this.ciaopr
        persona.nropersona = persona_user.nropersona
        persona.xpayctanro = this.xpayctanro

        if (this.xpaycta.url_avatar1!=undefined && this.xpaycta.url_avatar1!='' && this.xpaycta.url_avatar1!=null){
          persona.url_avatar1 = this.xpaycta.url_avatar1
        }

        persona.cta_titular_nombre= persona_user.persona.nombrecorto
        persona.bancocta_tipnip= persona_user.persona.tipnip
        persona.bancocta_codnip= persona_user.persona.codnip
        persona.bancocta_telfcodpais= persona_user.persona.telefonos? persona_user.persona.telefonos[0].telefonocodigopais.replace('+','+0'):''
        persona.bancocta_telfcodarea= persona_user.persona.telefonos?persona_user.persona.telefonos[0].telefonocodigoarea:''
        persona.bancocta_telefono= persona_user.persona.telefonos? persona_user.persona.telefonos[0].telefononumero:''

        persona.participacion = 10
        persona.partc_tipo = 'D'

        if (this.xpaycta.cuenta_transitoria === 'N'){
          persona.bancocta_tipnip=this.xpaycta.bancocta_tipnip?this.xpaycta.bancocta_tipnip:''
          persona.bancocta_codnip=this.xpaycta.bancocta_codnip?this.xpaycta.bancocta_codnip:''
          persona.bancocod=this.xpaycta.bancocod?this.xpaycta.bancocod:''
          persona.bancoctanro=this.xpaycta.ctanro?this.xpaycta.ctanro:''
          persona.bancoctatipo=this.xpaycta.ctatipo?this.xpaycta.ctatipo:''
        }

        const personaConQr = {...persona,...res}
        this.addPersonaXpayCta(personaConQr)
      }
    )
  }


  verPersonasEnCuenta():void{
    this.route.navigate([`/persona-xitypay/${this.xpayctanro}`])
  }

  addPersonaXpayCta(persona:PersonaXityPay):void{

    this.showSpinner = true
    this.service.asignaPersonaXpayCuentaSecured(this.ciaopr, persona).subscribe(
      ()=>{
        this.showSpinner = false
        this.snack.msgSnackBar('Persona asignada correctamente','OK',undefined,'success')
      },
      error=>{
        console.log(error)
        this.snack.msgSnackBar(`Error al registrar: ${error.error.mensaje}`,'OK',undefined,'warning')
        this.showSpinner = false
      }
    )
  }

  updateUsuario(ev: MatSelectChange,user:XpayUserXCuenta){

    const updatedUser:XpayUserXCuenta = {...user, rol_1:ev.value}
    

    this.showSpinner = true

    this.service.asignaUsuarioXpayCuentaSecured(this.ciaopr,updatedUser).subscribe(
      resultUser=>{
        if (resultUser){
          this.buscarUsuariosXPayCuenta(this.xpayctanro)
        } else {
          this.snack.msgSnackBar('Error al Actualizar','OK',undefined,'warning')
        }
        this.showSpinner = false
      },
      (error:HttpErrorResponse)=>{
        console.log(error)
          this.snack.msgSnackBar(`Error al registrar: ${error.error.mensaje}`,'OK',undefined,'warning')
        this.showSpinner = false
      }
    )
  }


}



interface TipoUsuario{
  cod:string,
  desc:string
}
