import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { PersonaXityPay, QrUrl, XitypayService, XpayCuenta, XpayUserXCuenta } from 'aliados';
// import moment from 'moment';
import * as moment from 'moment';
import { LibEnvService, PersonasService, PersonaView, TelefonoCorreo, UserView2, UsuariosService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { TipNip } from 'personas/lib/dto/tip-nip';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { Md5 } from 'ts-md5';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-crea-usuario-xp',
  templateUrl: './crea-usuario-xp.component.html',
  styleUrls: ['./crea-usuario-xp.component.css']
})
export class CreaUsuarioXpComponent extends CrudImpl implements OnInit {
// VERIFICAR FUNCIONAMIENTO, SE CAMBIÓ IMPORTACIÓN DE MOMENT

  tablasApoyo:TablasApoyo
  visible:boolean
  @ViewChild('main') top:ElementRef
  creaPersonaEnCuenta:string
  persona:PersonaView
  aliadoAvatar:string
  xpaycta:XpayCuenta

  constructor(
    private libEnvService: LibEnvService,
    private dialog: MatDialog,
    private snack:SnackbarService,
    private servicePersona:PersonasService,
    private serviceUsuario:UsuariosService,
    private serviceXityPay:XitypayService,
    private formBuilder:FormBuilder,
  ){
    super()
    this.form = this.formBuilder.group({
      creaPersonaEnCuenta: new FormControl(Boolean),
      tipnip: new FormControl('',Validators.required),
      codnip: new FormControl('',Validators.required),
      nombreprimero: new FormControl('',Validators.required),
      nombresegundo: new FormControl(''),
      apellidoprimero: new FormControl('',Validators.required),
      apellidosegundo: new FormControl(''),
      fechanacimiento: new FormControl('',Validators.required),
      sexo: new FormGroup({
        sexocod: new FormControl(''),
        sexonombre: new FormControl('')
      }),
      edocivil: new FormGroup({
        edocivilcod: new FormControl(''),
        edocivilnombre: new FormControl('')
      }),
      email1: new FormControl('',[Validators.email,Validators.required]),
      xpayctanro: new FormControl('',Validators.required),
      xpayctanombre: new FormControl('',Validators.required),
      telefonos: new FormArray([]),
    })
  }

  get telefonos() {
    return this.form.controls["telefonos"] as FormArray
  }

  addTelefono(tel: TelefonoCorreo | undefined | null): void {
    if (tel) {
      this.telefonos.push(new FormGroup({
        telefonotipcod: new FormControl(tel?.telefonotipcod,Validators.required),
        telefonocodigopais: new FormControl(tel?.telefonocodigopais,Validators.required),
        telefonocodigoarea: new FormControl(tel?.telefonocodigoarea,Validators.required),
        telefononumero: new FormControl(tel?.telefononumero,Validators.required)
      }))
    } else {
      this.telefonos.push(new FormGroup({
        telefonotipcod: new FormControl('CEL',Validators.required),
        telefonocodigopais: new FormControl('+58',Validators.required),
        telefonocodigoarea: new FormControl('',Validators.required),
        telefononumero: new FormControl('',Validators.required)
      }))
    }
  }

  deleteTelefono(i: number): void {
    this.telefonos.removeAt(i)
  }

  ngOnInit(): void {
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.incluirAction()
    this.setDefaults()
    this.addTelefono(undefined)
  }

  setDefaults():void{
    this.form.patchValue({
      tipnip:'V',
      sexo:{
        sexocod:'M'
      },
      edocivil:{
        edocivilcod:'S'
      }
    })
  }

  protected override incluirAction(): void {
      super.incluirAction()
      this.visible=true;
  }

  changeNip(e:MatSelectChange):void{
    if (e.value == 'T' || e.value == 'S'){
      this.form.get('codnip')?.setValue('0')
      // this.form.get('codnip')?.disable()
    } else {
      this.form.get('codnip')?.setValue('')
      this.form.get('codnip')?.enable()
    }
  }

  personaNatural(dato:TipNip):boolean{
    return dato.personatipocod == 'N'
  }

  catalogoXityPayCta():void{
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:XpayCuenta)=>{
        console.log(result)
        this.form.patchValue({
          xpayctanro:result.xpayctanro?result.xpayctanro:'',
          xpayctanombre:result.nombrecorto?result.nombre:''
        })
        this.xpaycta = result
        this.aliadoAvatar = result.url_avatar1?result.url_avatar1:''
    })
  }

  crearUsuarioXP():void{
    if (this.form.status !== 'VALID'){
      this.form.markAllAsTouched()
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      return
    }
    if (this.telefonos.controls.length < 1){
      this.snack.msgSnackBar('Debe registrar por lo menos un telefono','Agregar',undefined,'warning')
      return
    }


    this.servicePersona.getPersonaViewXTipnipCodnip(this.libEnvService.getConfig().ciaopr.ciaopr,this.form.get('tipnip')?.value,this.form.get('codnip')?.value).subscribe(
      result=>{
        console.log('existe')
        console.log(result)
        this.dialog.open(CatalogoGenericoComponent,
          {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
            data: this.dataDialogo("Usuario XityPay",`La persona "${result.nombrecorto}" ya existe, ¿desea continuar?`,'SI','NO')}).afterClosed().subscribe(result=>{
              if(result){
                this.creaPersona()
              } else {
                return
              }
            })
      },(error:HttpErrorResponse)=>{
        console.log('no existe')
        this.creaPersona()
        console.log(error.error)
      },()=>{
        console.log('terminó de buscar persona')
      }
    )
  }

  creaPersona():void{
    this.showSpinner = true
    const persona: PersonaView = this.form.getRawValue()
    persona.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    persona.fechanacimiento = moment(this.form.get('fechanacimiento')?.value).format('YYYY/MM/DD')
    if (persona.tipnip == 'T' || persona.tipnip == 'S') {
      // persona.nombrecorto = persona.apellidoprimero + ' ' + persona.apellidosegundo
      // persona.nombrecompleto = persona.apellidoprimero + ' ' + persona.apellidosegundo + ', ' + persona.nombreprimero + ' ' + persona.nombresegundo
      // persona.nombrecompleto = persona.apellidoprimero + persona.apellidosegundo? ' '+persona.apellidosegundo:'' + ', ' + persona.nombreprimero + ' ' + persona.nombresegundo?' '+persona.nombresegundo:''
    }
    this.servicePersona.upserPersona(persona.ciaopr,persona).subscribe(
      result=>{
        if(result){
          console.log('persona creada')
          const newUser:UserView2 = new UserView2()
          newUser.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
          newUser.alias = result.tipnip.toUpperCase()+result.codnip
          newUser.password = Md5.hashStr(result.codnip)
          newUser.email_publico = result.email1
          newUser.nropersona = result.nropersona
          newUser.nro_not_ws = result.telefonos[0].telefonocodigopais+result.telefonos[0].telefonocodigoarea+result.telefonos[0].telefononumero
          this.showSpinner = false
          this.persona = result
          if (this.form.value.creaPersonaEnCuenta == true){
            const persXpay:PersonaXityPay = new PersonaXityPay()
            persXpay.activo = 'S'
            persXpay.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
            persXpay.nropersona = result.nropersona
            
            persXpay.xpayctanro = this.form.get('xpayctanro')?.value
            persXpay.activo = 'S'
            persXpay.email_not = result.email1
            persXpay.url_avatar1 = this.aliadoAvatar
            persXpay.tlf_not_sms = result.telefonos[0].telefonocodigopais+result.telefonos[0].telefonocodigoarea+result.telefonos[0].telefononumero
            persXpay.tlf_not_ws = result.telefonos[0].telefonocodigopais+result.telefonos[0].telefonocodigoarea+result.telefonos[0].telefononumero
            persXpay.partc_tipo = 'D'
            persXpay.participacion = 10

            if (result.telefonos.length > 0){
              persXpay.bancocta_telfcodpais = result.telefonos[0].telefonocodigopais
              persXpay.bancocta_telfcodarea = result.telefonos[0].telefonocodigoarea
              persXpay.bancocta_telefono = result.telefonos[0].telefononumero
            }


            this.asignaPersona(persXpay)

            // this.snack.msgSnackBar(`La persona fue asignada a la cuenta XityPay Suministrada`,'OK',undefined,'success')
          } else {
            this.creaUsuario(newUser)
          }
        }
      },(error:HttpErrorResponse)=>{
        console.log(error)
        this.snack.msgSnackBar(`Error al crear la persona ${error.error.mensaje}`,'OK',undefined,'warning')
        this.showSpinner = false
      }
    )
  }



  creaUsuario(user:UserView2):void{
    console.log(user)
    this.showSpinner = true
      this.serviceUsuario.createUsuarioSecured(this.libEnvService.getConfig().ciaopr.ciaopr,user).subscribe({
        next:(usuario)=>{
          console.log('usuario creado')
          const assignedUser = new XpayUserXCuenta()
          console.log(usuario)
          assignedUser.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
          assignedUser.nrousuario = usuario.nrousuario
          assignedUser.xpayctanro = this.form.get('xpayctanro')?.value
          assignedUser.rol_1 = 'U'
          this.showSpinner = false
          this.asignaUsuario(assignedUser,user)
        },

        error:(err:HttpErrorResponse)=>{
          this.showSpinner = false
          console.log(err)
          if (err.error.mensaje === 'error.alias.o.email.usado'){
            this.snack.msgSnackBar(`Error creando usuario, el alias "${user.alias}" o el correo "${user.email_publico}" ya se encuentra en uso por otro usuario. La persona fue creada, no se pudo crear el usuario.`,'OK',undefined,'warning')
          } else {
            this.snack.msgSnackBar(`Error al crear usuario ${err.error.mensaje}. La persona fue creada.`,'OK',undefined,'warning')
          }
        },
        complete:()=>{
          this.showSpinner = false
        }
      })
    }

    asignaUsuario(assignedUser:XpayUserXCuenta,user:UserView2):void{
      // console.log('asigna usuario, recibiendo ->')
      // console.log(assignedUser)
      // console.log(user)
      this.showSpinner = true
      this.serviceXityPay.asignaUsuarioXpayCuentaSecured(this.libEnvService.getConfig().ciaopr.ciaopr,assignedUser).subscribe({
        next:()=>{
          console.log('usuario asignado')
          const personaAsignada = new PersonaXityPay()
          personaAsignada.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
          personaAsignada.nropersona = user.nropersona
          personaAsignada.xpayctanro = this.form.get('xpayctanro')?.value
          personaAsignada.activo = 'S'
          personaAsignada.email_not = user.email_publico
          personaAsignada.url_avatar1 = this.aliadoAvatar
          personaAsignada.tlf_not_sms = user.nro_not_ws
          personaAsignada.tlf_not_ws = user.nro_not_ws

          personaAsignada.partc_tipo = 'D'
          personaAsignada.participacion = 10
          this.showSpinner = false
          this.asignaPersona(personaAsignada)
        },
        error:(err:HttpErrorResponse)=>{
          this.showSpinner = false
          console.log(err)
          this.snack.msgSnackBar(`Error al asignar usuario ${err.error.mensaje}`,'OK',undefined,'warning')
        }
      })
    }

    asignaPersona(personaXP:PersonaXityPay):void{
      this.showSpinner = true

      personaXP.cta_titular_nombre = this.form.get('apellidoprimero')?.value + ' ' + this.form.get('nombreprimero')?.value
      
      if (this.persona.telefonos.length > 0){
        personaXP.bancocta_telfcodpais = this.persona.telefonos[0].telefonocodigopais
        personaXP.bancocta_telfcodarea = this.persona.telefonos[0].telefonocodigoarea
        personaXP.bancocta_telefono = this.persona.telefonos[0].telefononumero
      }

      if (this.xpaycta.cuenta_transitoria === 'N'){
        personaXP.bancocta_tipnip=this.xpaycta.bancocta_tipnip?this.xpaycta.bancocta_tipnip:''
        personaXP.bancocta_codnip=this.xpaycta.bancocta_codnip?this.xpaycta.bancocta_codnip:''
        personaXP.bancocod=this.xpaycta.bancocod?this.xpaycta.bancocod:''
        personaXP.bancoctanro=this.xpaycta.ctanro?this.xpaycta.ctanro:''
        personaXP.bancoctatipo=this.xpaycta.ctatipo?this.xpaycta.ctatipo:''
      }

      const qrData:QrUrl[] = [
        {
          size:256,
          url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(personaXP.xpayctanro)}/monto?pid=${personaXP.nropersona}`,
          file_name:`qr_pd`,
          file_path:`/xitypay/${personaXP.xpayctanro}/pec/${personaXP.nropersona}`,
          qr_field_name:`url_qr1`,
        },
        {
          size:256,
          url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(personaXP.xpayctanro)}/pago?pid=${personaXP.nropersona}`,
          file_name:`qr_pa`,
          file_path:`/xitypay/${personaXP.xpayctanro}/pec/${personaXP.nropersona}`,
          qr_field_name:`url_qr2`,
        }
      ]

      this.serviceXityPay.createPersonaEnCuentaQr(personaXP.ciaopr,qrData).subscribe(
        result=>{
          const personaConQr = {...personaXP,...result}
          this.serviceXityPay.asignaPersonaXpayCuentaSecured(this.libEnvService.getConfig().ciaopr.ciaopr,personaConQr).subscribe(
            result=>{
              console.log('persona asignada')
              if (result){
                this.snack.msgSnackBar('Proceso culminado exitosamente','OK',undefined,'success')
              } else {
                this.snack.msgSnackBar('Error al crear usuario','OK',undefined,'error')
              }
            }, (error:HttpErrorResponse) => {
              this.snack.msgSnackBar('Error al asignar persona','OK',undefined,'error')
              this.showSpinner = false
              console.log(error)
            }, () =>{
              console.log('terminó')
              this.showSpinner = false
              this.form.reset()
              this.telefonos.clear()
              this.setDefaults()
              this.addTelefono(undefined)
            }
          )        
        }
      )
    }

    updatePersonaForm():void{
      this.showSpinner = true
      const tipnip = this.form.get('tipnip')?.value
      const codnip = this.form.get('codnip')?.value

      this.servicePersona.getPersonaViewXTipnipCodnip(this.libEnvService.getConfig().ciaopr.ciaopr,tipnip,codnip).subscribe(
        result=>{
          console.log('result')
          if (result){
            this.form.reset()
            this.form.patchValue(result)
            this.form.patchValue({fechanacimiento:moment(result.fechanacimiento).format('YYYY-MM-DD')})
          }
        },error=>{
          console.log('error')
          this.form.patchValue({
            nombreprimero: null,
            nombresegundo: null,
            apellidoprimero: null,
            apellidosegundo: null,
            fechanacimiento: null,
            sexo:{
              sexocod: null,
              sexonombre: null,
            },
            edocivil:{
              edocivilcod: null,
              edocivilnombre: null,
            },
            email1: null,
            xpayctanro: null,
            xpayctanombre: null
          })
          
          this.telefonos.clear()
          this.addTelefono(undefined)
          this.showSpinner = false
          console.log(error)
        },() =>{
          console.log('complete')
          this.showSpinner = false
        }
      )
    }

}
