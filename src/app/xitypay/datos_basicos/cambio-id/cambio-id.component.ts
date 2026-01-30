import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GetPersonaUsrRequest, PersonaUsuarioXpay, XitypayService } from 'aliados';
import { cambioTipnipCodnipRequest, LibEnvService, List, PersonasService, PersonaView, UserView2, UserView2Persona, UserViewFiltro, UsuariosService } from 'personas';
import { Subscription } from 'rxjs';
import { ServicioCompartidoComponent } from 'src/app/layout/servicio-compartido/servicio-compartido.component';
import { ServicioLocalstorage } from 'src/app/layout/servicio-localstorage.service';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-cambio-id',
  templateUrl: './cambio-id.component.html',
  styleUrls: ['./cambio-id.component.css']
})
export class CambioIdComponent implements OnInit{
  subscription:Subscription

  private servicioCompartido:ServicioCompartidoComponent = new ServicioCompartidoComponent() 
  private localStorageService:ServicioLocalstorage = new ServicioLocalstorage()
  modoCliente = false
  titulo:string

  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    this.subscription = this.servicioCompartido.getJwtData().subscribe((e)=>console.log("EN INICIO",e))
    
    const data = this.localStorageService.getItem('1uswK2yh')

    if (data) {
      const parsedData:miniXPCuenta = JSON.parse(data)
      if (parsedData.xpayctanro){
        this.modoCliente = true
        this.titulo = parsedData.xpayctanro
        this.xpayctanro = parsedData.xpayctanro
      }

  }
}

  form:FormGroup
  persona:PersonaUsuarioXpay = new PersonaUsuarioXpay()

  // personaForm:FormGroup

  showSpinner = false
  idChanged = false
  idChangedMessage:string
  ciaopr:string 
  codnip:string
  xpayctanro:string

  constructor(
    public dialog:MatDialog,
    private snack:SnackbarService,
    private service:UsuariosService,
    private personaService:PersonasService,
    private xitypayService: XitypayService,
    private userService:UsuariosService,
    private activeRouter: ActivatedRoute,
    private usuarioService:UsuariosService,
    public libEnvService: LibEnvService,
  ){
    this.form = new FormGroup({
      codnip: new FormControl('',Validators.required),
      new_codnip: new FormControl('',Validators.required),
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

  getPersona():void{

    if(this.form.get('codnip')?.value.trim() === ''){
      this.form.get('codnip')?.markAsTouched()
      return
    }

    this.idChanged=false
    this.idChangedMessage=''

    this.showSpinner = true
    const codnip:string = this.form.get('codnip')?.value.trim()

    const personaUsrQuery:GetPersonaUsrRequest = new GetPersonaUsrRequest()
    personaUsrQuery.codnip_usr = codnip
    personaUsrQuery.tipnip_usr = 'S'

    this.xitypayService.getPersonaUsuarioEnCuenta(this.ciaopr,this.xpayctanro,personaUsrQuery).subscribe({
      next: (result:PersonaUsuarioXpay)=>{
        this.persona = result
        // this.getUser(result.tipnip,result.codnip)
      },error: (err:HttpErrorResponse) => {
        console.log(err)
        this.snack.msgSnackBar('Error al hacer la consulta o no existe serial registrado','OK',undefined,'warning')
        this.showSpinner = false
      },
      complete: () => {
        this.showSpinner = false
      }
  })
    
  }

  clearPersona():void{
    console.log('limpiando persona')
    this.persona = new PersonaUsuarioXpay()
    // this.usuario = new UserView2()
  }

  cambiaSerial():void{
    if (this.form.status !== 'VALID') {
      this.form.markAllAsTouched()
      return
    }

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme actualización',`¿ Desea actualizar el serial del equipo registrado a ${this.persona.nombrecorto} ?`,'Actualizar','Cancelar')}).afterClosed().subscribe({
      next: (result:boolean) => {
        if (result) {
          this.showSpinner = true
          this.persona.codnip = this.form.get('new_codnip')?.value.trim().toUpperCase()
          this.cambiaTipnipCodnipAlias()
        }
      }
    })
    

  }

  cambiaTipnipCodnipAlias():void{
    const cambioPayload:cambioTipnipCodnipRequest = new cambioTipnipCodnipRequest()
    cambioPayload.codnip_nuevo = this.form.get('new_codnip')?.value.trim()
    cambioPayload.tipnip_nuevo = this.persona.tipnip
    cambioPayload.nrousuario = this.persona.nrousuario

    this.usuarioService.cambioTipnipCodnip(this.ciaopr,cambioPayload,'X000000077').subscribe({
      next:()=>{
        this.form.reset()
        this.persona = new PersonaUsuarioXpay()
        this.snack.msgSnackBar('Serial actualizado correctamente','Ok',undefined,'success')
        this.showSpinner = false
      },
      error: (err:HttpErrorResponse) => {
        console.log(err)
        this.snack.msgSnackBar('Error al cambiar el serial','OK',undefined,'warning')
        this.showSpinner = false
      }
    })
  }

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