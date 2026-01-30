import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { AliadoWrap, SmsConfig, XitypayService, XpayCuenta, XpayPlantilla } from 'aliados';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAliadoComponent } from 'src/app/shared/borrame/catalogo-aliado/catalogo-aliado.component';
import { CatalogoApiProviderComponent } from 'src/app/shared/borrame/catalogo-api-provider/catalogo-api-provider.component';
import { CatalogoConfigSmsComponent } from 'src/app/shared/borrame/catalogo-config-sms/catalogo-config-sms.component';
import { CatalogoPlanCuentaXpComponent } from 'src/app/shared/borrame/catalogo-plan-cuenta-xp/catalogo-plan-cuenta-xp.component';
import { CatalogoPlantillaComponent } from 'src/app/shared/borrame/catalogo-plantilla/catalogo-plantilla.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { UtilsService } from 'src/app/shared/utils.service';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-plan-x-cuenta',
  templateUrl: './plan-x-cuenta.component.html',
  styleUrls: ['./plan-x-cuenta.component.css']
})
export class PlanXCuentaComponent  extends CrudImpl implements OnInit {

  tablasApoyo:TablasApoyo
  avatar:string
  visible:boolean
  modo=''

  // @ViewChild('cntaLabel') cntaLabel:ElementRef
  // @ViewChild('cntaInput') cntaInput:ElementRef
  // @ViewChild('cntaLabel2') cntaLabel2:ElementRef
  // @ViewChild('cntaInput2') cntaInput2:ElementRef
  @ViewChild('top') top:ElementRef


  ngOnInit(): void {

    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.setDefaults()
    this.showSpinner = false

    this.crud.btnIncluir.visible=false
  }

  protected override cancelarAction(): void {
      super.cancelarAction()
      this.modo = ''
  }

  constructor(
    private util:UtilsService,
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: XitypayService,
    public dialog: MatDialog,
    private router: Router) {
      super()
      this.form = this.formBuilder.group({
        ciaopr: new FormControl(''),
        xpayctanro: new FormControl(''),
        // usersyspago: new FormControl(null),
        // secretsyspago: new FormControl(null),
        // usersypago: new FormControl(null),
        nroaliado: new FormControl(''),
        bancocod: new FormControl('',Validators.required),
        ctatipo: new FormControl('',Validators.required),
        ctanro: new FormControl('',Validators.required),
        nropersona: new FormControl(''),
        telfcodpais: new FormControl('',Validators.required),
        telfcodarea: new FormControl('',Validators.required),
        telefono: new FormControl('',Validators.required),
        email: new FormControl('',[Validators.email,Validators.required]),
        valor_def_1: new FormControl('',Validators.required),
        valor_def_2: new FormControl('',Validators.required),
        valor_def_3: new FormControl('',Validators.required),
        valor_def_4: new FormControl('',Validators.required),
        valor_def_5: new FormControl('',Validators.required),
        valor_def_6: new FormControl('',Validators.required),
        activo: new FormControl(''),
        web_hook: new FormControl(''),
        url_webhook: new FormControl(''),
        mensaje_desc: new FormControl('',Validators.required),
        hash_ctanro: new FormControl(''),
        modificable: new FormControl(''),
        vigente_por: new FormControl(''),
        porcentaje_xitypay: new FormControl('',Validators.required),
        calculo_xitypay: new FormControl(''),
        concepto_x_defecto: new FormControl(''),
        texto_1: new FormControl(''),
        texto_2: new FormControl(''),
        texto_3: new FormControl(''),
        texto_4: new FormControl(''),
        texto_5: new FormControl(''),
        tipnip: new FormControl(''),
        codnip: new FormControl(''),
        nombrecompleto: new FormControl(''),
        nombrecorto: new FormControl(''),
        nombrepersjuridica: new FormControl(''),
        siglaspersjuridica: new FormControl(''),
        email_publico: new FormControl('',Validators.email),
        url_avatar1: new FormControl(''),
        url_avatar2: new FormControl(''),
        url_avatar3: new FormControl(''),
        // xpayctanro_asociada: new FormControl(''),
        email_remitente_not: new FormControl('',Validators.required),
        cuenta_transitoria: new FormControl(''),

        bancocta_tipo: new FormControl(''),
        bancocta_tipnip: new FormControl(''),
        bancocta_codnip: new FormControl(''),
        cta_titular_nombre: new FormControl(''),

        bancocod_federado: new FormControl(''),
        ctatipo_federado: new FormControl(''),
        ctanro_federado: new FormControl(''),
        bancocta_tipnip_federado: new FormControl(''),
        bancocta_codnip_federado: new FormControl(''),
        federado_estricto: new FormControl(''),
        cta_titular_nombre_federado: new FormControl(''),
        nombre: new FormControl(''),

        notifica_email: new FormControl(''),
        notifica_tlg: new FormControl(''),
        notifica_ws: new FormControl(''),
        notifica_sms: new FormControl(''),
        notifica_webhook: new FormControl(''),

        id_plantilla: new FormControl(''),

        persona: new FormGroup({
          tipnip: new FormControl(''),
          codnip: new FormControl(''),
          nombreprimero: new FormControl(''),
          nombresegundo: new FormControl(''),
          apellidoprimero: new FormControl(''),
          apellidosegundo: new FormControl(''),
          nombrecompleto: new FormControl(''),
          nombrecorto: new FormControl(''),
        }),
        plan_cuenta: new FormGroup({
          ciaopr:new FormControl(''),
          xpayctanro:new FormControl(''),
          id_plan:new FormControl('',Validators.required),
          comision_ent_banco:new FormControl(''),
          comision_sal_banco:new FormControl(''),
          comision_sal_otro_banco:new FormControl(''),
          comision_xp:new FormControl(''),
          nombre:new FormControl(''),

          com_entr_bancocod: new FormControl(''),
          com_entr_bancocta: new FormControl(''),
          com_entr_ctatipo: new FormControl(''),
          com_entr_tipnip: new FormControl(''),
          com_entr_codnip: new FormControl(''),

          com_sal_bancocod: new FormControl(''),
          com_sal_bancocta: new FormControl(''),
          com_sal_ctatipo: new FormControl(''),
          com_sal_tipnip: new FormControl(''),
          com_sal_codnip: new FormControl(''),

          com_sal_otro_banco_bancocod: new FormControl(''),
          com_sal_otro_banco_bancocta: new FormControl(''),
          com_sal_otro_banco_ctatipo: new FormControl(''),
          com_sal_otro_banco_tipnip: new FormControl(''),
          com_sal_otro_banco_codnip: new FormControl(''),

          com_xp_bancocod: new FormControl(''),
          com_xp_bancocta: new FormControl(''),
          com_xp_ctatipo: new FormControl(''),
          com_xp_tipnip: new FormControl(''),
          com_xp_codnip: new FormControl(''),
        }),
        sms_config: new FormGroup({
          ciaopr: new FormControl(''),
          xpayctanro: new FormControl(''),
          serviciocod: new FormControl(''),
          verbo: new FormControl(''),
          url_service: new FormControl(''),
          from_number: new FormControl(''),
          dlr: new FormControl(''),
          dlr_level: new FormControl(''),
          auth_method: new FormControl(''),
          auth_credentials: new FormControl(''),
          nombre: new FormControl(''),
        }),
        api_provider: new FormGroup({
          provcod: new FormControl(''),
          provnombre: new FormControl(''),

          apikey: new FormControl(''),
          apisecret: new FormControl(''),
          usuario: new FormControl(''),
          key_1: new FormControl(''),
          key_2: new FormControl(''),
          key_3: new FormControl(''),
          key_4: new FormControl(''),
          key_5: new FormControl(''),

        })
      })
    }

  setDefaults(){
    this.form.patchValue({
      ciaopr:this.libEnvService.getConfig().ciaopr.ciaopr,
      vigente_por:1,
      // ctatipo:'CNTA',
      porcentaje_xitypay:0,
      email_remitente_not:'XityPay <enlaces@xitypay.com>',
    })
  }

  override incluirAction(): void {
    this.modo='Incluir'
    super.incluirAction()
    this.setDefaults()
    this.visible=true
    this.catalogoAliado()
  }

  protected override modificarAction(): void {
    super.modificarAction()
    this.modo = 'Modificar'
    this.visible=true
  }

  override incluir(): void {
    super.incluir()
    if (this.form.status === 'VALID'){
      this.showSpinner=true
      const xpCuenta:XpayCuenta = this.form.getRawValue()
      xpCuenta.activo = this.setSlideToggleFromBoolean(this.form.get('activo')?.value)
      xpCuenta.modificable = this.setSlideToggleFromBoolean(this.form.get('modificable')?.value)
      xpCuenta.cuenta_transitoria = this.setSlideToggleFromBoolean(this.form.get('cuenta_transitoria')?.value)
      xpCuenta.federado_estricto = this.setSlideToggleFromBoolean(this.form.get('federado_estricto')?.value)

      xpCuenta.notifica_email = this.setSlideToggleFromBoolean(this.form.get('notifica_email')?.value)
      xpCuenta.notifica_tlg = this.setSlideToggleFromBoolean(this.form.get('notifica_tlg')?.value)
      xpCuenta.notifica_ws = this.setSlideToggleFromBoolean(this.form.get('notifica_ws')?.value)
      xpCuenta.notifica_sms = this.setSlideToggleFromBoolean(this.form.get('notifica_sms')?.value)
      xpCuenta.notifica_webhook = this.setSlideToggleFromBoolean(this.form.get('notifica_webhook')?.value)

      xpCuenta.vigente_por = Math.round(parseFloat(this.form.get('vigente_por')?.value) * 3600)

      xpCuenta.plan_cuenta = (typeof xpCuenta.plan_cuenta?.id_plan === 'string') ? xpCuenta.plan_cuenta : null

      // if (xpCuenta.usersypago?.trim() == '' || xpCuenta.usersypago == null){
      //   xpCuenta.usersypago = null
      // }
      
      this.service.createXpayCuenta(this.libEnvService.getConfig().ciaopr.ciaopr,xpCuenta).subscribe(
        result => {
          if (result) {
            if (result.xpayctanro){
              this.setXpayCuenta(result)
              this.showSpinner=false
              this.snack.msgSnackBar('Cuenta de xitypay creada','OK',undefined,'success')
              this.configBTNForms(false)
              this.form.disable()
              this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            } else {
              this.showSpinner=false
              this.snack.msgSnackBar('Error al registrar','OK',undefined,'error')
            }
          } else {
            this.showSpinner=false
            this.snack.msgSnackBar('Error al registrar','OK',undefined,'error')
          }
        }, error => {
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al modificar ${error.error.mensaje}`,'OK',undefined,'error')
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  override modificar(): void {
    super.modificar()

    if (this.form.status === 'VALID'){
      this.showSpinner=true
      const xpCuenta:XpayCuenta = this.form.getRawValue()
      xpCuenta.activo = this.setSlideToggleFromBoolean(this.form.get('activo')?.value)
      xpCuenta.modificable = this.setSlideToggleFromBoolean(this.form.get('modificable')?.value)
      xpCuenta.cuenta_transitoria = this.setSlideToggleFromBoolean(this.form.get('cuenta_transitoria')?.value)
      xpCuenta.federado_estricto = this.setSlideToggleFromBoolean(this.form.get('federado_estricto')?.value)

      xpCuenta.notifica_email = this.setSlideToggleFromBoolean(this.form.get('notifica_email')?.value)
      xpCuenta.notifica_tlg = this.setSlideToggleFromBoolean(this.form.get('notifica_tlg')?.value)
      xpCuenta.notifica_ws = this.setSlideToggleFromBoolean(this.form.get('notifica_ws')?.value)
      xpCuenta.notifica_sms = this.setSlideToggleFromBoolean(this.form.get('notifica_sms')?.value)
      xpCuenta.notifica_webhook = this.setSlideToggleFromBoolean(this.form.get('notifica_webhook')?.value)

      xpCuenta.vigente_por = Math.round(parseFloat(this.form.get('vigente_por')?.value) * 3600)

      xpCuenta.plan_cuenta = (typeof xpCuenta.plan_cuenta?.id_plan === 'string') ? xpCuenta.plan_cuenta : null

      // if (xpCuenta.usersypago?.trim() == '' || xpCuenta.usersypago == null){
      //   xpCuenta.usersypago = null
      // }

      console.log(xpCuenta.url_webhook)

      this.service.createXpayCuenta(this.libEnvService.getConfig().ciaopr.ciaopr,xpCuenta).subscribe(
        result => {
          if (result) {
            this.setXpayCuenta(result)
            this.showSpinner=false
            this.snack.msgSnackBar('Cuenta de xitypay actualizada','OK',undefined,'success')
            this.configBTNForms(false)
            this.form.disable()
            this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            this.showSpinner=false
            this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
          }
        }, error => {
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al modificar ${error.error.mensaje}`,'OK',undefined,'error')
        }
      )

    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }


  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.setXpayCuenta(result)
        this.modo='Consultar'
      }
    })
  }

  updateAvatar():void{
    this.avatar = this.form.get('url_avatar1')?.value
  }

  // setAvatar(e:MouseEvent):void{
  //   const imgHtml = e.target as HTMLImageElement
  //   this.form.patchValue({
  //     url_avatar1:imgHtml.src
  //   })
  //   this.updateAvatar()
  // }

  catalogoApiProveedores():void{

    this.form.patchValue({
      api_provider:{
        provcod: '',
        provnombre: '',
      }
    })
    this.dialog.open(CatalogoApiProviderComponent,{data:this.dataDialogo('Búsqueda de Proveedor de API',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.form.patchValue({
          api_provider:result
        })
      }
    })
  }

  setXpayCuenta(xpayCta:XpayCuenta):void{
    this.form.reset()
    this.form.patchValue({
      plan_cuenta:{
        comision_sal_banco: xpayCta.plan_cuenta?.comision_sal_banco? xpayCta.plan_cuenta?.comision_sal_banco :0.00,
        comision_ent_banco: xpayCta.plan_cuenta?.comision_ent_banco? xpayCta.plan_cuenta?.comision_ent_banco :0.00,
        comision_sal_otro_banco: xpayCta.plan_cuenta?.comision_sal_otro_banco? xpayCta.plan_cuenta?.comision_sal_otro_banco :0.00,
        comision_xp: xpayCta.plan_cuenta?.comision_xp? xpayCta.plan_cuenta?.comision_xp :0.00
      },
    })
    
    this.form.patchValue(xpayCta)

    this.form.patchValue({
      nombre:xpayCta.nombre? xpayCta.nombre :xpayCta.nombrecorto,
      valor_def_1:xpayCta.valor_def_1? xpayCta.valor_def_1 :0,
      valor_def_2:xpayCta.valor_def_2? xpayCta.valor_def_2 :0,
      valor_def_3:xpayCta.valor_def_3? xpayCta.valor_def_3 :0,
      valor_def_4:xpayCta.valor_def_4? xpayCta.valor_def_4 :0,
      valor_def_5:xpayCta.valor_def_5? xpayCta.valor_def_5 :0,
      valor_def_6:xpayCta.valor_def_6? xpayCta.valor_def_6 :0,
      porcentaje_xitypay: xpayCta.porcentaje_xitypay? xpayCta.porcentaje_xitypay:0,
      activo: this.setSlideToggleFromString(xpayCta.activo),
      modificable: this.setSlideToggleFromString(xpayCta.modificable),
      cuenta_transitoria: this.setSlideToggleFromString(xpayCta.cuenta_transitoria),
      federado_estricto: this.setSlideToggleFromString(xpayCta.federado_estricto),

      notifica_email:this.setSlideToggleFromString(xpayCta.notifica_email),
      notifica_tlg:this.setSlideToggleFromString(xpayCta.notifica_tlg),
      notifica_ws:this.setSlideToggleFromString(xpayCta.notifica_ws),
      notifica_sms:this.setSlideToggleFromString(xpayCta.notifica_sms),
      notifica_webhook:this.setSlideToggleFromString(xpayCta.notifica_webhook),

      vigente_por: xpayCta.vigente_por? xpayCta.vigente_por / 3600:1
    })
    // this.cambiaLabelPlaceholderAction(xpayCta.ctatipo?xpayCta.ctatipo:'')
    this.updateAvatar()


    console.log(this.form)
    
    
  }

  setSlideToggleFromString(value:string|undefined):boolean{
    if (value == 'S') return true
    if (value == 'N') return false
    return false
  }
  setSlideToggleFromBoolean(value:boolean):string{
    if (value) return 'S'
    return 'N'
  }

  catalogoAliado():void{
    this.dialog.open(CatalogoAliadoComponent,{data:this.dataDialogo('Búsqueda de Aliado',undefined,undefined,undefined,25)})
    .afterClosed().subscribe(result=>{
      if(result){
        this.setAliado(result)
        this.showSpinner=false
        
      } else {
        this.cancelarAction()
      }
    })
  }

  setAliado(aliado:AliadoWrap):void{
    this.form.patchValue(aliado)
    this.form.patchValue({
      nombre:aliado.persona.nombrecorto,
      email:aliado.persona.email1,
      activo:false,
      modificable:false,
      nombrecompleto:aliado.persona.nombrecompleto,
      nombrecorto:aliado.persona.nombrecorto,
      nombrepersjuridica:aliado.persona.nombrepersjuridica,
      siglaspersjuridica:aliado.persona.siglaspersjuridica,
      tipnip:aliado.persona.tipnip,
      codnip:aliado.persona.codnip,
      url_avatar1:aliado.url_avatar1,

      cta_titular_nombre:aliado.persona.nombrecorto,
      bancocta_tipnip:aliado.persona.tipnip,
      bancocta_codnip:aliado.persona.codnip,
      
    })

    this.updateAvatar()
  }
  strToSeconds (stime:string):number{
    const timeIntArray:number[] = stime.split(':').map((item)=>{return parseInt(item,10)})
    return +(timeIntArray.reduce( (acc:number,time:number)=> { return +(60 * acc) + +time }));
  }

  show():void{
    const data:XpayCuenta = this.form.getRawValue() 
    console.log(data)
  }

  catalogoXpaycuenta():void{

    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.form.patchValue({
          xpayctanro_asociada:result.xpayctanro
        })
      }
    })
  }

  catalogoPlanCuenta(){
    this.dialog.open(CatalogoPlanCuentaXpComponent,{data:this.dataDialogo('Búsqueda de Planes XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.resetPlanCuenta()

        this.form.patchValue({
          plan_cuenta:{
            comision_ent_banco:0.00,
            comision_sal_banco:0.00,
            comision_sal_otro_banco:0.00,
            comision_xp:0.00,
          }
        })

        this.form.patchValue({
          plan_cuenta:result
        })
      }
    })
  }

  cambiaLabelPlaceholder(event:MatSelectChange){
    // this.cambiaLabelPlaceholderAction(event.value)
  }
  cambiaLabelPlaceholder2(event:MatSelectChange){
    // this.cambiaLabelPlaceholderAction2(event.value)
  }
  cambiaLabelPlaceholderAction(tipoCta:string){
    // switch(tipoCta){
    //   case 'CNTA':
    //     this.cntaLabel.nativeElement.innerText = 'Nro Cuenta (20 dígitos)' 
    //     this.cntaInput.nativeElement.placeholder = '01011234561234567890'
    //     break
    //   case 'CELE':
    //     this.cntaLabel.nativeElement.innerText = 'Nro Teléfono (04xx-1234567)'
    //     this.cntaInput.nativeElement.placeholder = '04121234567'
    //     break
    // }
  }
  cambiaLabelPlaceholderAction2(tipoCta:string){
    // switch(tipoCta){
    //   case 'CNTA':
    //     this.cntaLabel2.nativeElement.innerText = 'Nro Cuenta (20 dígitos)' 
    //     this.cntaInput2.nativeElement.placeholder = '01011234561234567890'
    //     break
    //   case 'CELE':
    //     this.cntaLabel2.nativeElement.innerText = 'Nro Teléfono (04xx-1234567)'
    //     this.cntaInput2.nativeElement.placeholder = '04121234567'
    //     break
    // }
  }

  resetPlanCuenta():void{
    this.form.patchValue({
      plan_cuenta:{
        id_plan:null,
        comision_ent_banco:null,
        comision_sal_banco:null,
        comision_sal_otro_banco:null,
        comision_xp:null,
        nombre:null,

        com_entr_bancocod:null,
        com_entr_bancocta:null,
        com_entr_ctatipo:null,
        com_entr_tipnip:null,
        com_entr_codnip:null,

        com_sal_bancocod:null,
        com_sal_bancocta:null,
        com_sal_ctatipo:null,
        com_sal_tipnip:null,
        com_sal_codnip:null,
    
        com_sal_otro_banco_bancocod:null,
        com_sal_otro_banco_bancocta:null,
        com_sal_otro_banco_ctatipo:null,
        com_sal_otro_banco_tipnip:null,
        com_sal_otro_banco_codnip:null,
        
        com_xp_bancocod:null,
        com_xp_bancocta:null,
        com_xp_ctatipo:null,
        com_xp_tipnip:null,
        com_xp_codnip:null,
      }
    })
  }
  
  resetConfigSms():void{
    this.form.patchValue({
      sms_config:{
        ciaopr: null,
        xpayctanro: null,
        serviciocod: null,
        verbo: null,
        url_service: null,
        from_number: null,
        dlr: null,
        dlr_level: null,
        auth_method: null,
        auth_credentials: null,
        nombre: null,
      }
    })
  }

  resetDatosComision(e:string):void{
    switch(e){
      case 'ent_banco':
        this.form.patchValue({
            plan_cuenta:{
              com_entr_bancocod: null,
              com_entr_bancocta: null,
              com_entr_ctatipo:null,
              com_entr_tipnip: null,
              com_entr_codnip: null
            }
          })
      break
      case 'sal_banco':
        this.form.patchValue({
          plan_cuenta:{
            com_sal_bancocod: null,
            com_sal_bancocta: null,
            com_sal_ctatipo:null,
            com_sal_tipnip: null,
            com_sal_codnip: null
          }
        })
      break
      case 'sal_otro_banco':
        this.form.patchValue({
          plan_cuenta:{
            com_sal_otro_banco_bancocod: null,
            com_sal_otro_banco_bancocta: null,
            com_sal_otro_banco_ctatipo:null,
            com_sal_otro_banco_tipnip: null,
            com_sal_otro_banco_codnip: null
          }
        })
      break
      case 'xp':
        this.form.patchValue({
          plan_cuenta:{
            com_xp_bancocod: null,
            com_xp_bancocta: null,
            com_xp_ctatipo:null,
            com_xp_tipnip: null,
            com_xp_codnip: null
          }
        })
      break
    }
  }

  catalogoSMS():void{
    this.dialog.open(CatalogoConfigSmsComponent,{data:this.dataDialogo('Búsqueda de Configuración SMS',undefined,undefined,undefined,25)})
    .afterClosed().subscribe(result=>{
      if(result){
        this.setConfigSMS(result)
        this.showSpinner=false
      }
    })
  }

  catalogoPlantilla():void{
    this.dialog.open(CatalogoPlantillaComponent,{data:this.dataDialogo('Búsqueda de Configuración SMS',undefined,undefined,undefined,25)})
    .afterClosed().subscribe((result:XpayPlantilla)=>{
      if(result){
        this.form.patchValue({
          id_plantilla:result.correlativo
        })
        this.showSpinner=false
      }
    })
  }

  setConfigSMS(config:SmsConfig){
    this.form.patchValue({
      sms_config:config
    })
  }

  abrirLink(url:string):void{
    this.util.openRouteNewTab(url)
  }

  floatNumber(num:string):number{
    console.log(num)
    return parseFloat(num.toString().replace(',','.'))
  }

  validarConcepto(e:KeyboardEvent):void{
    const el = e.target as HTMLInputElement
    const concepto = el.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".,#^$%&*!@+=`:;()]/g, '')
    this.form.patchValue({
      concepto_x_defecto:concepto,
      mensaje_desc:concepto
    })
  }

  emailString22 = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="es">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaccion XityPay</title>
        <style>
            body{font-family:Arial,sans-serif;font-size:22px;line-height:1.5;color:#333;margin:0;padding:0}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:10px}p{margin-top:0;margin-bottom:10px}a{color:#0073b7;text-decoration:none}.container{width:600px;margin:0 auto;background-color:#fff;border-radius:10px;box-shadow:0 0 20px rgb(0 0 0 / .1)}.header{font-size:17px;padding:20px;text-align:center;background-color:#656565;color:#fff;border-top-left-radius:10px;border-top-right-radius:10px;overflow:hidden;border-bottom:5px solid #f90}.logo{display:block;margin:0 auto;width:150px}.content{padding:20px}.footer{background-color:#f7f7f7;padding:20px;text-align:center}.button{background-color:#0073b7;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;font-weight:700}.RJCT{color:red}.ACCP{color:green}.OTRO{color:#ff0}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img class="logo" src="https://www.xitypay.com/assets/img/logo-xitypay-d.png" alt="Logo XityPay">
                <h1>Resultado de transacción XityPay Ambiente de Pruebas</h1>
            </div>
            <div class="content">
                {{if .cuerpo}}
                <p>{{.cuerpo}}</p>
                {{end}}
                <table>
                    <tbody>
                        <tr>
                            <td>Resultado</td>
                            <td>
                                <strong>
                                    {{if eq .transaccion.status "ACCP"}}
                                    <span class="ACCP">ACEPTADO</span>
                                    {{else if eq .transaccion.status "RJCT"}}
                                    <span class="RJCT">RECHAZADO &nbsp; ({{.transaccion.rejected_code}})</span>
                                    {{else}}
                                    <span class="OTRO">{{.transaccion.status}}</span>
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>ID</td>
                            <td>
                                <strong>
                                    {{if and (eq .transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                                    {{.transaccion_origen.id}}
                                    {{else}}
                                    {{.transaccion.id}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Receptor</td>
                            <td>
                                <strong>{{.xpay_cta_persona.cta_titular_nombre}}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Cta. XityPay</td>
                            <td>
                                <strong>{{.xpay_cuenta.nombre}} - {{.xpay_cuenta.xpayctanro}}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Ref. XityPay</td>
                            <td><strong>{{.transaccion.transaction_id}}</strong></td>

                        </tr>
                        <tr>
                            <td>Ref. IBP</td>
                            <td>
                                <strong>
                                    {{if and (eq .transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                                    {{.transaccion_origen.ref_ibp}}
                                    {{else}}
                                    {{.transaccion.ref_ibp}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Fecha</td>
                            <td><strong>{{transformaFechaDDMMYYYYHHmm .transaccion.fecha}}</strong></td>
                        </tr>
                        <tr>
                            <td>Banco origen</td>
                            <td>
                                <strong>
                                    {{if and ( or (eq .transaccion.tipo_transaccion "SAL")
                                    (eq .transaccion.tipo_transaccion "ENT")) .transaccion_origen}}
                                    {{.transaccion_origen.bancocodpagador}}
                                    {{else}}
                                    {{.transaccion.bank_code}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Origen</td>
                            <td>
                                <strong>
                                    {{if and (eq .transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                                    {{.transaccion_origen.ctanropagador}}
                                    {{else}}
                                    {{.transaccion.ctanropagador}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Cédula</td>
                            <td>
                                <strong>
                                    {{if and (eq .data.transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                                    {{.transaccion_origen.tipnip}} {{.transaccion_origen.codnip}}
                                    {{else}}
                                    {{.transaccion.tipnip}} {{.transaccion.codnip}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>

                        {{if .transaccion_origen}}
                        <tr>
                            <td>Monto solicitado</td>
                            <td>
                                <strong>
                                    Bs. {{if eq .transaccion.tipo_transaccion "SAL"}}
                                    {{.transaccion_origen.monto_ves}}
                                    {{else}}
                                    {{.transaccion.monto_ves}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                        {{end}}

                        <tr>
                            <td>Monto recibido</td>
                            <td><strong>Bs. {{.transaccion.monto_ves}}</strong></td>
                        </tr>
                        {{if and (eq .transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                        <tr>
                            <td>Costo transacción</td>
                            <td>
                                <strong>Bs. {{resta .transaccion_origen.monto_ves .transaccion.monto_ves 2}}
                                </strong>
                            </td>
                        </tr>
                        {{end}}
                        <tr>
                            <td>Concepto</td>
                            <td>
                                <strong>
                                    {{if and (eq .transaccion.tipo_transaccion "SAL") .transaccion_origen}}
                                    {{.transaccion_origen.concepto}}
                                    {{else}}
                                    {{.transaccion.concepto}}
                                    {{end}}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3 style="margin-top:10px">
                    <p>
                        <strong>Por favor, le sugerimos que confirme en su cuenta bancaria los datos que le
                            suministramos</strong>
                    </p>
                </h3>
            </div>
            <div class="footer">
                <p>
                    <a
                        href="https://www.misrevistas.com/xitymall/notas/23373/condiciones-de-uso-politicas-y-terminos-legales">Condiciones
                        de Uso, Políticas y Términos Legales</a>
                </p>
                <p>
                    <a href="https://www.misrevistas.com/xitymall/notas/23374/politica-de-privacidad">Política de
                        privacidad</a>
                </p>
                <p>&copy; XityPay 2025</p>
            </div>
        </div>
    </body>
    </html>`

}
