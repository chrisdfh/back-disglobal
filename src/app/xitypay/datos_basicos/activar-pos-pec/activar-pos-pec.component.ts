import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { microMensaje, PersonaEnCuentaFiltro, PersonaXityPay, personaXpayCuenta, SendMailPayload, XitypayService, XpayCuenta, XpayUserXCuenta } from 'aliados';
import { LibEnvService, List, PersonasService, UserView2, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { ActivarPersonaEnCuentaPosComponent } from 'src/app/shared/activar-persona-en-cuenta-pos/activar-persona-en-cuenta-pos.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { Md5 } from 'ts-md5';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-activar-pos-pec',
  templateUrl: './activar-pos-pec.component.html',
  styleUrls: ['./activar-pos-pec.component.css']
})
export class ActivarPosPecComponent extends CrudImpl implements OnInit{

  ciaopr:string 
  dataSource = new List<personaXpayCuenta>()
  displayedColumns = ['avatar','nombre','eliminar']
  xpayctanro:string
  xpcta:XpayCuenta
  aliadoNombre:string
  aliadoNroPersona:number
  codnip:string

  @ViewChild('top') top:ElementRef
  tgIcon=this.sanitizer.bypassSecurityTrustHtml(`<svg class="h-100 w-100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                                                          <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                                            <path d="M 45 0 C 28.967 0 14.902 8.392 6.932 21.015 c 2.729 1.97 6.069 3.145 9.693 3.145 h 32.399 c 17.08 0 32.123 8.704 40.948 21.915 C 89.981 45.716 90 45.36 90 45 C 90 20.147 69.853 0 45 0 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(31,155,218); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                                                            <path d="M 90 45 c 0 -1.207 -0.062 -2.399 -0.155 -3.583 C 81.002 27.735 66.02 20.885 49.024 20.885 H 16.625 c -3.159 0 -6.101 -0.494 -8.614 -1.504 C 3.387 26.046 0.51 34.014 0.063 42.629 c 9.023 11.127 22.794 18.247 38.236 18.247 h 0.744 c 9.038 0 13.101 3.942 13.329 12.925 c 0.004 -0.143 0.022 -0.282 0.022 -0.426 c 0 8.417 -3.516 15.355 -11.172 16.456 C 42.469 89.934 43.726 90 45 90 C 69.853 90 90 69.853 90 45 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(29,144,203); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                                                            <path d="M 41.27 89.834 c 7.988 -1.072 14.169 -7.802 14.378 -16.034 c -0.228 -8.983 -7.566 -16.2 -16.604 -16.2 h -0.744 c -15.296 0 -28.947 -6.992 -37.973 -17.938 C 0.119 41.414 0 43.193 0 45 C 0 68.595 18.164 87.936 41.27 89.834 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(27,134,188); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                                                            <path d="M 36.371 52.976 l 19.271 14.237 c 2.2 1.214 3.786 0.586 4.334 -2.041 l 7.844 -36.964 c 0.803 -3.22 -1.227 -4.681 -3.331 -3.726 L 18.428 42.242 c -3.144 1.261 -3.125 3.016 -0.573 3.797 l 11.821 3.689 L 57.04 32.464 c 1.292 -0.783 2.478 -0.362 1.505 0.502 L 36.371 52.976 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(252,253,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                                                          </g>
                                                        </svg>`)

  constructor(
    private sanitizer:DomSanitizer,
    public dialog:MatDialog,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvService: LibEnvService,
    private service:XitypayService,
    private personaServive:PersonasService,
    private serviceUsuario:UsuariosService) 
  {
    super()
    this.form = this.formBuilder.group({
      personas:new FormArray([]),
      codnip: new FormControl('',Validators.required),
      username: new FormControl('',Validators.required),
      email_publico: new FormControl('',Validators.required),
      tipo_usuario: new FormControl(null),

      nombre: new FormControl(''),
      codnipFiltro: new FormControl(''),  
      activo: new FormControl<'S'|'N'>('N')
    })
  }

  ngOnInit(): void {
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
  }

  catalogoXityPayCta(){
    this.xpcta = new XpayCuenta
    this.xpayctanro = ''
    this.aliadoNombre = ''
    this.aliadoNroPersona = 0
    this.dataSource = new List<personaXpayCuenta>()
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:XpayCuenta)=>{
        this.xpcta = result
        this.aliadoNroPersona = result.nropersona?result.nropersona:0
        this.aliadoNombre = result.nombre?result.nombre:''
        this.buscarPersonasXPayCuenta(result.xpayctanro)
    })
  }

  buscarPersonasXPayCuenta(xpaycta:string|undefined,page?:number,cant_registros?:number){
    page = page ? page : 1
    cant_registros = cant_registros ? cant_registros : 15

    if (xpaycta){
      const filtro:PersonaEnCuentaFiltro = new PersonaEnCuentaFiltro()
      filtro.activo = this.form.get('activo')?.value||'N'
      if(this.form.value.nombre !== ''){
        filtro.cta_titular_nombre = this.form.value.nombre
      }
      if(this.form.value.codnipFiltro !== ''){
        filtro.codnip = this.form.value.codnipFiltro
      }
      
      this.showSpinner = true
      this.service.getPersonasXpayCuentaConFiltro(filtro,this.ciaopr,xpaycta,cant_registros,page).subscribe((
        
        result=>{
          this.showSpinner = false
          // OJO !!! CAMBIAR ESTO
          // this.aliadoNombre = result.results[0].cuenta.nombrecorto ? result.results[0].cuenta.nombrecorto: ''
          if (result.results.length > 0){
            this.xpayctanro = xpaycta
            this.dataSource = result
          } else {
            this.xpayctanro = ''
            this.snack.msgSnackBar('No se encontraron resultados','OK',undefined,'warning')
          }
        }
      ),error =>{
        this.showSpinner = false
          this.dataSource = new List<personaXpayCuenta>()
          // this.snack.msgSnackBar('No se encontraron resultados','OK',undefined,'warning')
        if (error.error.mensaje == "error: No se encontraron registros"){
          this.xpayctanro = xpaycta
        } else {
          console.log(error)
          this.xpayctanro = ''
        }
      })
    }
  }

  activaPersonaXpayCta(personaXpCuenta:personaXpayCuenta):void{
    this.showSpinner = true

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme Activación',`¿ Desea ACTIVAR a la persona ${personaXpCuenta.persona.nombrecorto} en la lista de receptores de pago XityPay del aliado ${this.aliadoNombre} ?`,'Aceptar','Cancelar')}).afterClosed().subscribe(
      (result:boolean)=>{
        if (result){
          personaXpCuenta.activo = 'S'

          // CREANDO LA DATA PARA ASIGNAR USUARIO A LA XPAYCUENTA
          const newUserXpCuenta:UserView2 = new UserView2()
          newUserXpCuenta.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
          newUserXpCuenta.alias = personaXpCuenta.persona.tipnip.toUpperCase()+personaXpCuenta.persona.codnip
          newUserXpCuenta.password = Md5.hashStr(personaXpCuenta.persona.codnip)
          newUserXpCuenta.email_publico = personaXpCuenta.email_not
          newUserXpCuenta.nropersona = personaXpCuenta.nropersona
          newUserXpCuenta.nro_not_ws = personaXpCuenta.bancocta_telfcodpais+personaXpCuenta.bancocta_telfcodarea+personaXpCuenta.bancocta_telefono

          this.codnip = personaXpCuenta.persona.codnip

          this.addPersonaXpayCta(personaXpCuenta,newUserXpCuenta)
        } else {
          this.showSpinner = false
        }
      })
  }

  addPersonaXpayCta(persona:PersonaXityPay,newUserXpCuenta:UserView2):void{
    this.showSpinner = true
    this.service.asignaPersonaXpayCuenta(this.ciaopr, persona).subscribe(
      result=>{
        if (result){
          this.creaUsuario(newUserXpCuenta)
          this.buscarPersonasXPayCuenta(this.xpayctanro)
          this.showSpinner = false
        } else {
          this.snack.msgSnackBar('Error al registrar','OK',undefined,'warning')
          this.showSpinner = false
        }
      },(error:HttpErrorResponse)=>{
        console.log(error)
        this.snack.msgSnackBar(`Error al registrar: ${error.error.mensaje}`,'OK',undefined,'warning')
        this.showSpinner = false
      }
    )
  }

  creaUsuario(user:UserView2):void{
    this.showSpinner = true
    
    this.serviceUsuario.createUsuario(this.libEnvService.getConfig().ciaopr.ciaopr,user).subscribe({
      next:(usuario)=>{
        console.log('usuario creado')
        const assignedUser = new XpayUserXCuenta()
        console.log(usuario)
        assignedUser.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
        assignedUser.nrousuario = usuario.nrousuario
        assignedUser.xpayctanro = this.xpayctanro
        assignedUser.rol_1 = 'A'
        this.asignaUsuario(assignedUser,user)
        this.showSpinner = false
      },
      error:(err:HttpErrorResponse)=>{
        this.showSpinner = false
        console.log(err)
        this.snack.msgSnackBar(`Error al crear usuario ${err.error.mensaje}`,'OK',undefined,'warning')
      }
    })
  }

  asignaUsuario(assignedUser:XpayUserXCuenta,user:UserView2):void{
    this.showSpinner = true
    this.service.asignaUsuarioXpayCuenta(this.libEnvService.getConfig().ciaopr.ciaopr,assignedUser).subscribe({
      next:()=>{
        this.snack.msgSnackBar(`Usuario ${user.alias} Activado, email de notificación enviado a ${user.email_publico}`,'OK',undefined,'success')
        // this.sendMail(user.email_publico,'Activación de usuario XityPay',`El usuario se ha activado correctamente,<br><br>Debe ingresar utilizando el usuario ${user.alias} y como contraseña inicial, el ID del equipo. El sistema le pedirá cambiarlo en el primer inicio de sesión.<br><br>Equipo XityPay.`)
        this.sendMail(
            user.email_publico,
            'Acceso al Sistema: Credenciales y Primeros Pasos',
            `<p>Estimado(a) Cliente,</p><p>Su afiliación al sistema ha sido completada con éxito y su cuenta ya se encuentra activa.</p><p>A continuación, sus credenciales iniciales:</p><p>Usuario: ${user.alias}<br />Clave Temporal: ${this.codnip}</p><p>Por motivos de seguridad, el sistema le solicitará establecer una nueva contraseña personal de inmediato. Le recomendamos una combinación robusta de caracteres para proteger su cuenta.</p><p>Bienvenido a la red de cobros inmediatos de Banco Plaza.</p><p>Atentamente,<br>Equipo de Soporte Banco Plaza</p>`
         )
        this.showSpinner = false
      },
      error:(err:HttpErrorResponse)=>{
        this.showSpinner = false
        console.log(err)
        this.snack.msgSnackBar(`Error al asignar usuario ${err.error.mensaje}`,'OK',undefined,'warning')
      }
    })
  }

  eliminaPersonaXpayCta(user:personaXpayCuenta):void{
    this.showSpinner = true

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme eliminación',`¿ Desea ELIMINAR a la persona ${user.persona.nombrecorto} de la lista de receptores de pago XityPay del aliado ${this.aliadoNombre} ?`,'Eliminar','Cancelar')}).afterClosed().subscribe(
      result=>{
        if (!result){
          this.showSpinner = false
          return
        } else {
          const nropersona = user.nropersona
          if (nropersona == undefined) return
          
          this.upsertPersona(nropersona)
          
          const eliminaPersona:PersonaXityPay = new PersonaXityPay()
          eliminaPersona.ciaopr = this.ciaopr
          eliminaPersona.xpayctanro = user.xpayctanro?user.xpayctanro:'',
          eliminaPersona.nropersona = user.nropersona?user.nropersona:0
          
          this.service.eliminaPersonaXityPay(this.ciaopr,eliminaPersona).subscribe(
            result=>{
              console.log(result)
              this.buscarPersonasXPayCuenta(user.xpayctanro)
              this.sendMail(user.email_not,'Activación del punto de venta no se procesó','<p>Estimado(a) Cliente,</p><p>Hubo una inconsistencia de datos y por ende el punto de venta no se activó en el sistema de Plaza Tap</p><p>Por favor póngase en contacto con el equipo de Soporte.</p><p>Atentamente,<br />Equipo de Soporte Banco Plaza</p>')
              this.showSpinner = false
            },
            error=>{
              this.snack.msgSnackBar(`Error al eliminar ${error.error}`,'OK',undefined,'warning')
              this.showSpinner = false
            }
          )
        }
      }
    )
  }

  upsertPersona(nropersona:number):void{
    this.personaServive.getPersonaViewXNropersona(this.libEnvService.getConfig().ciaopr.ciaopr,nropersona).subscribe({
      next:(persona)=>{
        persona.codnip = `DES ${persona.codnip}`
        this.personaServive.upserPersona(this.libEnvService.getConfig().ciaopr.ciaopr,persona).subscribe({
          next:()=>{
            this.showSpinner = false
            this.buscarPersonasXPayCuenta(this.xpayctanro)
          },
          error:(err:HttpErrorResponse)=>{
            this.showSpinner = false
            console.log(err)
            this.snack.msgSnackBar(`Error al desincorporar el serial ${err.error.mensaje}`,'OK',undefined,'warning')
          }
        })
      },
      error:(err:HttpErrorResponse)=>{
        this.showSpinner = false
        console.log(err)
        this.snack.msgSnackBar(`Error al desincorporar el serial ${err.error.mensaje}`,'OK',undefined,'warning')
      }
    })
  }

  updatePersonaXpayCta(persona:PersonaXityPay):void{
    this.showSpinner = true
    this.service.asignaPersonaXpayCuenta(this.ciaopr, persona).subscribe(
      result=>{
        if (result){
          this.buscarPersonasXPayCuenta(this.xpayctanro)
          this.showSpinner = false
        } else {
          this.snack.msgSnackBar('Error al registrar','OK',undefined,'warning')
          this.showSpinner = false
        }
      }
    )
  }

  updateAvatar(persona:personaXpayCuenta):void{
    const dialogData = {
      titulo: 'Consultar Datos Cuenta',
      msg: 'Introduzca una nueva URL para el avatar, y el nombre a mostrar, si no se desa cambiar, presione CANCELAR',
      avatar:persona.url_avatar1,
      avatar2:persona.url_avatar2,
      avatar3:persona.url_avatar3,
      url_qr:persona.url_qr,
      url_qr1:persona.url_qr1,
      url_qr2:persona.url_qr2,
      btn_true_text: 'Actualizar',
      btn_false_text: 'Cancelar',
      participacion: persona.participacion,
      participacionTipo:persona.partc_tipo,
      activo: persona.activo == 'S'?true:false,
      notifica_webhook :persona.notifica_webhook == 'S'?true:false,
      url_webhook:persona.url_webhook,
      email_not:persona.email_not,
      tlf_not_sms:persona.tlf_not_sms,
      tlf_not_ws:persona.tlf_not_ws,
      telegram_chat_id:persona.telegram_chat_id,

      // DATOS BANCARIOS
      cta_titular_nombre:persona.cta_titular_nombre || persona.persona.nombrecorto,
      bancocta_tipnip:persona.bancocta_tipnip || persona.persona.tipnip,
      bancocta_codnip:persona.bancocta_codnip || persona.persona.codnip,

      bancocod:persona.bancocod,
      bancoctanro:persona.bancoctanro,
      bancoctatipo:persona.bancoctatipo,

      bancocta_telfcodpais: persona.bancocta_telfcodpais,
      bancocta_telfcodarea:persona.bancocta_telfcodarea,
      bancocta_telefono:persona.bancocta_telefono,


      xpayctanro: this.xpayctanro,
      nropersona:persona.nropersona
    }

    this.dialog.open(ActivarPersonaEnCuentaPosComponent,{maxWidth: '650px', width: '100%', maxHeight: '750px', height: '90%', data:dialogData}).afterClosed().subscribe(
      result=>{
        if (result){
          if (persona.nropersona && persona.xpayctanro){
            const personaXp:PersonaXityPay = new PersonaXityPay()
            personaXp.ciaopr = persona.ciaopr
            personaXp.nropersona = persona.nropersona
            personaXp.xpayctanro = persona.xpayctanro
            personaXp.url_avatar1 = result.avatar
            personaXp.url_avatar2 = result.avatar2
            personaXp.url_avatar3 = result.avatar3
            personaXp.url_qr = result.url_qr
            personaXp.url_qr1 = result.url_qr1
            personaXp.url_qr2 = result.url_qr2
            personaXp.participacion = result.participacion
            personaXp.partc_tipo = result.participacionTipo
            personaXp.activo = result.activo == true? 'S':'N'
            personaXp.notifica_webhook = result.notifica_webhook == true? 'S':'N'
            personaXp.url_webhook = result.url_webhook
            personaXp.email_not = result.email_not
            personaXp.tlf_not_sms = result.tlf_not_sms
            personaXp.tlf_not_ws = result.tlf_not_ws
            personaXp.telegram_chat_id = result.telegram_chat_id

            personaXp.cta_titular_nombre = result.cta_titular_nombre
            personaXp.bancocta_tipnip = result.bancocta_tipnip
            personaXp.bancocta_codnip = result.bancocta_codnip
            personaXp.bancocod = result.bancocod,
            personaXp.bancoctanro = result.bancoctanro,
            personaXp.bancoctatipo = result.bancoctatipo,
            personaXp.bancocta_telfcodpais =  result.bancocta_telfcodpais,
            personaXp.bancocta_telfcodarea = result.bancocta_telfcodarea,
            personaXp.bancocta_telefono = result.bancocta_telefono
            
            this.updatePersonaXpayCta(personaXp)
          }
        } else {
          this.showSpinner = false
          this.buscarPersonasXPayCuenta(this.xpayctanro)
        }
      }
    )
  }

  onPageChange(event:PageEvent):void{
    const filtro:string = this.xpayctanro
    // if (event.pageIndex == this.dataSource.pagina - 1) {
      // this.buscarPersonasXPayCuenta(filtro,event.pageIndex+1,event.pageSize)
      // this.top.nativeElement.scrollIntoView({behavior: "smooth", block: "start"})
    // } else {
      if (filtro != null){
        this.buscarPersonasXPayCuenta(filtro,event.pageIndex+1,event.pageSize)
        this.top.nativeElement.scrollIntoView({behavior: "smooth", block: "start"})
      }
    // }
  }

  updateSearchActivoStatus(event:MatSlideToggleChange):void{
    this.dataSource = new List<personaXpayCuenta>()
    this.form.patchValue({
      activo: event.checked ? 'S':'N' 
    })
    this.refreshList()
  }

  refreshList():void{
    this.buscarPersonasXPayCuenta(this.xpayctanro)
  }

  sendMail(destinoEmail:string,asuntoEmail:string,cuerpoEmail:string):void{
    if (!(destinoEmail || asuntoEmail || cuerpoEmail)){
      return;
    }
    let mail:SendMailPayload
    if (this.xpcta.email_remitente_not){
      mail = {
        remitente: this.xpcta.email_remitente_not,
        destinatarios: [destinoEmail],
        subject: asuntoEmail,
        html_code: cuerpoEmail
      }
    } else {
      mail = new SendMailPayload()
      return
    }

    this.service.sendMail(mail).subscribe({
      next:(data:microMensaje)=>{
        this.snack.msgSnackBar(data.mensaje,'OK',undefined,'success')
      }, error:(err:HttpErrorResponse)=>{
        this.snack.msgSnackBar(err.error.message,'OK',undefined,'danger')
        this.showSpinner = false
      }, complete:()=>{
        this.showSpinner = false
      }
  })}

  buttonEvent(){
    this.sendMail('chrisdfh@gmail.com','TEST Email from xitypay','<h1>TEST Email from xitypay</h1><p>TEST Email from xitypay</p>')
  }

}
