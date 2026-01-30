import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AliadoRegWrap, AliadoService, AliadoWrap, Locales, PersonaRelacionadaWrap } from 'aliados';
import * as moment from 'moment';
import { Direcciones, LibEnvService, PersonaView, TelefonoCorreo } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { TipNip } from 'personas/lib/dto/tip-nip';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAliadoTemporalComponent } from 'src/app/shared/borrame/catalogo-aliado-temporal/catalogo-aliado-temporal.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoLocalidadComponent } from 'src/app/shared/borrame/catalogo-localidad/catalogo-localidad.component';
import { CatalogoOcupacionActividadComponent } from 'src/app/shared/borrame/catalogo-ocupacion-actividad/catalogo-ocupacion-actividad.component';
import { CatalogoPersonaComponent } from 'src/app/shared/borrame/catalogo-persona/catalogo-persona.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-solicitud-registro-aliado',
  templateUrl: './solicitud-registro-aliado.component.html',
  styleUrls: ['./solicitud-registro-aliado.component.css']
})
export class SolicitudRegistroAliadoComponent extends CrudImpl implements OnInit{

  defaults:object

  tablasApoyo:TablasApoyo

  visible:boolean

  @ViewChild('topRegAliado') top:ElementRef

  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons

      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'video'], // link and image, video
    ],
  };

  @ViewChild('nroAliado') nroAliado: ElementRef


  constructor(
    private libEnvService: LibEnvService,
    public dialog: MatDialog,
    private snack:SnackbarService,
    private formBuilder:FormBuilder,
    private service: AliadoService,
  ){
    super()
    this.form = this.formBuilder.group({
      nroaliado: new FormControl(''),
      aliado_descripcion1: new FormControl(''),
      aliado_descripcion2: new FormControl(''),
      aliado_presentacion: new FormControl(''),
      alias: new FormControl('',Validators.required),
      categoriacod: new FormControl('',Validators.required),
      email_publico: new FormControl('',[Validators.required,Validators.email]),
      fchafiliacion: new FormControl(''),
      campousuariochar_2:new FormControl(''),
      campousuariochar_3:new FormControl(''),
      campousuariochar_4:new FormControl(''),
      campousuariochar_5:new FormControl(''),
      pagina_web: new FormControl(''),
      rs_instagram: new FormControl(''),
      rs_facebook: new FormControl(''),
      rs_twitter: new FormControl(''),
      aliado_oferta1: new FormControl(''),

      oferta_monto_o_porc: new FormControl('M'),
      registro_completo: new FormControl('N'),
      oferta_valor: new FormControl<number>(0),
      ranking_publico: new FormControl<number>(0),
      ranking_editores: new FormControl<number>(0),

      pagoDb: new FormControl(''),
      pagoMc: new FormControl(''),
      pagoVs: new FormControl(''),
      pagoAm: new FormControl(''),
      pagoTt: new FormControl(''),
      pagoPm: new FormControl(''),
      pagoZl: new FormControl(''),
      wifi: new FormControl(''),
      publico_orientado: new FormControl(''),

      persona: new FormGroup({
        tipnip: new FormControl('',Validators.required),
        codnip: new FormControl('',Validators.required),
        nombrecompleto: new FormControl(''),
        nombrecorto: new FormControl(''),
        nombrepersjuridica: new FormControl('',Validators.required),
        fechanacimiento: new FormControl('',Validators.required),
        siglaspersjuridica: new FormControl('',Validators.required),
        campousuariochar_1: new FormControl(''),
        email1: new FormControl('',[Validators.required,Validators.email]),
        email2: new FormControl('',Validators.email),
        ocupactivcod: new FormControl(''),
        ocupacion_actividad: new FormGroup({
          ocupactivcod: new FormControl(''),
          ocupactivnombre: new FormControl(''),
        }),
        direcciones: new FormArray([]),
        telefonos: new FormArray([]),
      }),
      xpay_cuenta: new FormGroup({
        ciaopr: new FormControl(''),
        xpayctanro: new FormControl(''),
        nroaliado: new FormControl(''),
        bancocod: new FormControl(''),
        ctatipo: new FormControl(''),
        ctanro: new FormControl(''),
        nropersona: new FormControl(''),
        secretsyspago: new FormControl(''),
        telfcodpais: new FormControl(''),
        telefono: new FormControl(''),
        email: new FormControl(''),
        valor_def_1: new FormControl(''),
        valor_def_2: new FormControl(''),
        valor_def_3: new FormControl(''),
        mensaje_desc: new FormControl(''),
        activo: new FormControl(''),
      }),
      personas_relacionadas: new FormArray([]),
      locales: new FormArray([]),
    })
  }


  ngOnInit(): void {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.setDefaults()
    this.addPersonaRelacionada(undefined)
    this.locales.clear()
    this.form.disable()
    this.visible=false

    // this.resumenEditor = new Editor()
    // this.desc3Editor = new Editor()
  }


  setDefaults():void {
    this.defaults = {
      persona:{
        tipnip:"J",
      },
      pagina_web:'https://',
      campousuariochar_5:"Lunes a Viérnes: 8:00am - 5:00pm\nSábados: 8:00am - 2:00pm \nDomingo: No laboramos \nFeriados: No laboramos",
      oferta_monto_o_porc:'M',
      registro_completo:'N',
      oferta_valor:0,
      ranking_publico:0,
      ranking_editores:0,
      wifi:'NA',
      publico_orientado:"T",
      pagoDb: true,
      pagoMc: true,
      pagoVs: true,
      pagoAm: true,
      pagoTt: true,
      pagoPm: true,
      pagoZl: true,
    }
  }


  override incluirAction(): void {
    super.incluirAction()
    this.locales.clear()
    this.personas_relacionadas.clear()
    this.form.patchValue(this.defaults)
    // this.addLocal(undefined)
    this.addPersonaRelacionada(undefined)
    this.visible=true
  }

  override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }

  override cancelarAction(): void {
    super.cancelarAction()
    this.form.reset()
    this.form.disable()
    this.personas_relacionadas.clear()
    this.locales.clear()    
    this.visible=false
  }

  override consultar(): void {
    super.consultar()
    this.preAliado()
    // this.dialog.open(CatalogoAliadoComponent,{data:this.dataDialogo('Búsqueda de Aliado',undefined,undefined,undefined,25)})
    // .afterClosed().subscribe(result=>{
    //   if(result){
    //     this.setAliado(result)
    //     this.showSpinner=false
    //     this.form.disable()
    //     this.visible=false
    //   }
    // })
    
}
  // FUNCIÓN SERÁ ELIMINADA AL CONTAR CON UN CAMPO EN BD QUE ALMACENE LAS FORMAS DE PAGO
  setFormasPago():string{
    const aliadoPagos = {
      pagoDb:'',
      pagoMc:'',
      pagoVs:'',
      pagoAm:'',
      pagoTt:'',
      pagoPm:'',
      pagoZl:'',
    }
    aliadoPagos.pagoDb = this.form.get('pagoDb')?.value == true? 'on':'off'
    aliadoPagos.pagoMc = this.form.get('pagoMc')?.value == true? 'on':'off'
    aliadoPagos.pagoVs = this.form.get('pagoVs')?.value == true? 'on':'off'
    aliadoPagos.pagoAm = this.form.get('pagoAm')?.value == true? 'on':'off'
    aliadoPagos.pagoTt = this.form.get('pagoTt')?.value == true? 'on':'off'
    aliadoPagos.pagoPm = this.form.get('pagoPm')?.value == true? 'on':'off'
    aliadoPagos.pagoZl = this.form.get('pagoZl')?.value == true? 'on':'off'

    return    aliadoPagos.pagoDb
        +","+ aliadoPagos.pagoMc
        +","+ aliadoPagos.pagoVs
        +","+ aliadoPagos.pagoAm
        +","+ aliadoPagos.pagoTt
        +","+ aliadoPagos.pagoPm
        +","+ aliadoPagos.pagoZl
  }


  //MODIFICA ALIADO
  override modificar(): void {
    if (this.form.status === 'VALID'){
      super.modificar()
      this.showSpinner=true
      let aliado:AliadoRegWrap = this.form.getRawValue()
      aliado.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      aliado.fchafiliacion = moment(this.form.get('fchafiliacion')?.value).format('YYYY/MM/DD')
      aliado.persona.fechanacimiento = moment(this.form.value.persona.fechanacimiento).format('YYYY/MM/DD')
      for (let i=0;i<aliado.locales.length;i++){
        aliado.locales[i].local_principal = this.locales.at(i).value.local_principal_bool==true?'S':'N'
      }

      aliado.persona.campousuariochar_1 = this.setFormasPago()  
      aliado.campousuariochar_1 = this.form.get('wifi')?.value + "," + this.form.get('publico_orientado')?.value  


      const aliadoTemp:any = aliado

      if(aliadoTemp.persona.direcciones.length==0){
        delete aliadoTemp.persona.direcciones
      }
      if(aliadoTemp.persona.telefonos.length == 0){
        delete aliadoTemp.persona.telefonos
      }
      if(aliadoTemp.personas_relacionadas[0].persona.direcciones.length == 0){
        delete aliadoTemp.personas_relacionadas[0].persona.direcciones
      }
      if(aliadoTemp.personas_relacionadas[0].persona.telefonos.length==0){
        delete aliadoTemp.personas_relacionadas[0].persona.telefonos
      }

      aliado = new AliadoRegWrap()
      aliado = aliadoTemp

      // return

      this.service.upsertAliadoTemp(aliado.ciaopr,aliado).subscribe(
        result=>{
          if (result) {
            this.setAliado(result)
            // this.service.setNroAliadoRegistroAliado(result.ciaopr,result).subscribe()
            this.snack.msgSnackBar('Registro de Aliado Modificado exitósamente','OK',undefined,'success')
            this.showSpinner=false
            this.configBTNForms(false)
            this.visible = false
            this.form.disable()
            // this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            window.scrollTo(0,0)

            this.dialog.open(CatalogoGenericoComponent,{height:'250px', width:'350px', data:this.dataDialogo('Aviso',`El registro de ${this.form.value.persona.nombrecorto} fué actualizado, para convertirlo en Aliado, debe hacerlo utilizando el botón CREAR ALIADO`,'Ok','Cerrar',undefined)}).afterClosed().subscribe(
              ()=>{
                  return
                }
              )
          }
          else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          const msg = error.error.error||'Error al Modificar'
          this.snack.msgSnackBar(`Error al Modificar\n${msg}`,'OK',100000000,'error')
          this.showSpinner=false
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }


  //CREA ALIADO
  override incluir(): void {
    if (this.form.status === 'VALID'){
      super.incluir()
      this.showSpinner=true
      let aliado:AliadoRegWrap = this.form.getRawValue()

      aliado.persona.fechanacimiento = moment(this.form.value.persona.fechanacimiento).format('YYYY/MM/DD')
      
      // DATA DE ALIADO QUE NO SE PIDE EN EL FORM
      aliado.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      aliado.persona.nombrecompleto = this.form.get('persona')?.get('nombrepersjuridica')?.value
      aliado.persona.nombrecorto = this.form.get('persona')?.get('siglaspersjuridica')?.value

      for (let i=0;i<aliado.locales.length;i++){
        aliado.locales[i].local_principal = this.locales.at(i).value.local_principal_bool==true?'S':'N'
      }
      
      // MODIFICACION DEJA DE EXISTIR AL TENER DONDE GUARDAR LAS FORMAS DE PAGO
      aliado.persona.campousuariochar_1 = this.setFormasPago()
      aliado.campousuariochar_1 = this.form.get('wifi')?.value + "," + this.form.get('publico_orientado')?.value  

      const aliadoTemp:any = aliado

      if(aliadoTemp.persona.direcciones.length==0){
        delete aliadoTemp.persona.direcciones
      }
      if(aliadoTemp.persona.telefonos.length == 0){
        delete aliadoTemp.persona.telefonos
      }
      if(aliadoTemp.personas_relacionadas[0].persona.direcciones.length == 0){
        delete aliadoTemp.personas_relacionadas[0].persona.direcciones
      }
      if(aliadoTemp.personas_relacionadas[0].persona.telefonos.length==0){
        delete aliadoTemp.personas_relacionadas[0].persona.telefonos
      }

      aliado = new AliadoRegWrap()
      aliado = aliadoTemp
      console.log('incluir')

      this.service.upsertAliadoTemp(aliado.ciaopr,aliado).subscribe(
        result=>{
          if (result) {
            this.setAliado(result)
            this.snack.msgSnackBar('Solicitud de Aliado Creado exitósamente','OK',undefined,'success')
            this.showSpinner=false
            this.visible = false
            this.configBTNForms(false)
            this.form.disable()
            // this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            window.scrollTo(0,0)

            this.dialog.open(CatalogoGenericoComponent,{height:'250px', width:'350px', data:this.dataDialogo('Aviso',`El registro de ${this.form.value.persona.nombrecorto} fué creado, para convertirlo en Aliado, debe hacerlo utilizando el botón CREAR ALIADO`,'Ok','Cerrar',undefined)}).afterClosed().subscribe(
              ()=>{
                  return
                }
              )
          }
          else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al crear','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          console.log(error)
          const msg = error.error.error||'Error al crear'
          this.snack.msgSnackBar(msg,'OK',100000000,'error')
          this.showSpinner=false
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }


  // WATERFALL PARA LLEGAR A DIRECCIONES Y TELEFONOS DE PERSONA JURIDICA
  get persona_juridica(){
    return this.form.controls['persona'] as FormGroup
  }
  get direcciones(){
    return this.persona_juridica.controls['direcciones'] as FormArray
  }
  get telefonos(){
    return this.persona_juridica.controls['telefonos'] as FormArray
  }

  addDireccion(dir: Direcciones | undefined | null): void {
    if (dir) {
      this.direcciones.push(
        new FormGroup({
          dirtipocod: new FormControl(dir.dirtipocod),
          direccion1: new FormControl(dir.direccion1),
          direccion2: new FormControl(dir.direccion2),
          direccion3: new FormControl(dir.direccion3),
          direccion4: new FormControl(dir.direccion4),
          localidadcod: new FormControl(dir.localidadcod),
          localidadtexto: new FormControl(dir.localidadtexto),
          codpostalcod: new FormControl(dir.codpostalcod),
          dir_latitud: new FormControl<number | null>(dir.dir_latitud),
          dir_longitud: new FormControl<number | null>(dir.dir_longitud),
        })
      );
    }
  }
  addTelefono(tel: TelefonoCorreo | undefined | null): void {
    if (tel) {this.telefonos.push(
        new FormGroup({
          telefonotipcod: new FormControl(tel?.telefonotipcod),
          telefonocodigopais: new FormControl(tel?.telefonocodigopais),
          telefonocodigoarea: new FormControl(tel?.telefonocodigoarea),
          telefononumero: new FormControl(tel?.telefononumero),
        })
      );
    }
  }




  // WATERFALL PARA LLEGAR A DIRECCIONES Y TELEFONOS DE PERSONA RELACIONADA
  get personas_relacionadas(){
    return this.form.controls["personas_relacionadas"] as FormArray
  }
  get personaRelacionada(){
    return this.personas_relacionadas.controls[0] as FormGroup
  }
  get datoPersonaRelacionada(){
    return this.personaRelacionada.controls['persona'] as FormGroup
  }
  get telefonosPersonaRelacionada(){
    return this.datoPersonaRelacionada.controls['telefonos'] as FormArray
  }
  get direccionesPersonaRelacionada(){
    return this.datoPersonaRelacionada.controls['direcciones'] as FormArray
  }


  // FUNCIONES PARA ELIMINAR TELEFONO/DIRECCION DE PERSONA RELACIONADA
  deleteTelefonoPR(i:number){
    return this.telefonosPersonaRelacionada.removeAt(i)
  }
  deleteDireccionPR(i:number){
    this.direccionesPersonaRelacionada.removeAt(i)
  }


  //TELEFONOS DE PERSONA RELACIONADA
  addTelefonoPR(telefono:TelefonoCorreo | undefined | null){
    if (telefono){
      this.telefonosPersonaRelacionada.push(new FormGroup({
        telefonotipcod:new FormControl(telefono.telefonotipcod),
        telefonocodigopais: new FormControl(telefono.telefonocodigopais),
        telefonocodigoarea: new FormControl(telefono.telefonocodigoarea),
        telefononumero: new FormControl(telefono.telefononumero)
        })
      )
    } else {
      this.telefonosPersonaRelacionada.push(new FormGroup({
        telefonotipcod:new FormControl(''),
        telefonocodigopais: new FormControl(''),
        telefonocodigoarea: new FormControl(''),
        telefononumero: new FormControl('')
      }))
    }
  }
  //DIRECCIONES DE PERSONA RELACIONADA
  addDireccionPR(direccion:Direcciones | undefined | null){
    if(direccion){
      this.direccionesPersonaRelacionada.push(new FormGroup({
        dirtipocod: new FormControl(direccion.dirtipocod),
        direccion1: new FormControl(direccion.direccion1),
        direccion2: new FormControl(direccion.direccion2),
        direccion3: new FormControl(direccion.direccion3),
        direccion4: new FormControl(direccion.direccion4),
        codpostalcod: new FormControl(direccion.codpostalcod),
        dir_latitud: new FormControl<number>(direccion.dir_latitud),
        dir_longitud: new FormControl<number>(direccion.dir_longitud),
        localidadcod: new FormControl(direccion.localidadcod),
        localidadtexto: new FormControl(direccion.localidadtexto)
      }))

      }else {
        this.direccionesPersonaRelacionada.push(new FormGroup({
          dirtipocod: new FormControl(''),
          direccion1: new FormControl(''),
          direccion2: new FormControl(''),
          direccion3: new FormControl(''),
          direccion4: new FormControl(''),
          codpostalcod: new FormControl(''),
          dir_latitud: new FormControl<number>(10.48),
          dir_longitud: new FormControl<number>(-66.205),
          localidadcod: new FormControl(''),
          localidadtexto: new FormControl('')
        }))}
  }

  // AGREGO PERSONA RELACIONADA, SI VIENE DEL CATÁLOGO DE ALIADO
  addPersonaRelacionada(pers:PersonaRelacionadaWrap | undefined | null):void{
    this.personas_relacionadas.clear()
    if (pers && pers != undefined) {
      this.personas_relacionadas.push(new FormGroup({
        persrelstipcod: new FormControl(pers.persrelstipcod),
        persrelstipnombre: new FormControl(pers.persrelstipnombre),
        persona: new FormGroup({
          // nropersona: new FormControl<number>(pers.persona.nropersona),
          nombrecorto: new FormControl(pers.persona.nombrecorto),
          nombrecompleto: new FormControl(pers.persona.nombrecompleto),
          nombreprimero: new FormControl(pers.persona.nombreprimero),
          apellidoprimero: new FormControl(pers.persona.apellidoprimero),
          tipnip: new FormControl(pers.persona.tipnip),
          codnip: new FormControl(pers.persona.codnip),
          nombresegundo: new FormControl(pers.persona.nombresegundo),
          apellidosegundo: new FormControl(pers.persona.apellidosegundo),
          apellidocasada: new FormControl(pers.persona.apellidocasada),
          sexocod: new FormControl(pers.persona.sexocod),
          edocivilcod: new FormControl(pers.persona.edocivilcod),
          fechanacimiento: new FormControl(pers.persona.fechanacimiento),
          paginaweb: new FormControl(pers.persona.paginaweb),
          nacionalidadcod: new FormControl(pers.persona.nacionalidadcod),
          campousuariochar_1: new FormControl(pers.persona.campousuariochar_1),
          campousuariochar_2: new FormControl(pers.persona.campousuariochar_2),
          campousuariochar_3: new FormControl(pers.persona.campousuariochar_3),
          campousuariochar_4: new FormControl(pers.persona.campousuariochar_4),
          localidadcodnac: new FormControl(pers.persona.localidadcodnac),
          email1: new FormControl(pers.persona.email1),
          email2: new FormControl(pers.persona.email2),
          ocupactivcod: new FormControl(pers.persona.ocupactivcod),

          telefonos: new FormArray([]),
          direcciones: new FormArray([])
        })
      }))
      if (pers.persona.telefonos != undefined){
        pers.persona.telefonos.forEach(tel=>{
          this.addTelefonoPR(tel)
        })
      }
      if (pers.persona.direcciones != undefined){
        pers.persona.direcciones.forEach(dir=>{
          this.addDireccionPR(dir)
        })
      }
    } else {
      this.personas_relacionadas.push(new FormGroup({
        persrelstipcod: new FormControl('REP'),
        persrelstipnombre: new FormControl('Representante'),
        persona: new FormGroup({
          nombrecorto: new FormControl('Persona Campus'),
          nombrecompleto: new FormControl('Persona, Campus'),
          tipnip: new FormControl('V'),
          codnip: new FormControl('999999999'),
          // nombresegundo: new FormControl(''),
          // apellidosegundo: new FormControl(''),
          // apellidocasada: new FormControl(''),
          sexocod: new FormControl('X'),
          edocivilcod: new FormControl('X'),
          fechanacimiento: new FormControl('1999-01-01'),
          paginaweb: new FormControl('https://'),
          nacionalidadcod: new FormControl('VEN'),
          campousuariochar_1: new FormControl(''),
          campousuariochar_2: new FormControl('@inst'),
          campousuariochar_3: new FormControl('@face'),
          campousuariochar_4: new FormControl('@tweet'),
          localidadcodnac: new FormControl('302'),
          nombreprimero: new FormControl('Campus'),
          apellidoprimero: new FormControl('Persona'),
          email1: new FormControl('info@campusxity.com'),
          ocupactivcod: new FormControl('OTR'),
          telefonos: new FormArray([]),
          direcciones: new FormArray([])
        })
      }))
    }
  }

  // AGREGO PERSONA RELACIONADA, SI VIENE DEL CATÁLOGO PERSONA
  addPersonaRelacionadaFromPersona(persona:PersonaView | undefined | null):void{
    this.personas_relacionadas.clear()
    if (persona && persona != undefined) {
      this.personas_relacionadas.push(new FormGroup({
        persrelstipcod: new FormControl('REP'),
        persrelstipnombre: new FormControl('Representante'),
        persona: new FormGroup({
          // nropersona: new FormControl<number>(persona.nropersona),
          nombrecorto: new FormControl(persona.nombrecorto),
          nombrecompleto: new FormControl(persona.nombrecompleto),
          tipnip: new FormControl(persona.tipnip),
          codnip: new FormControl(persona.codnip),
          nombresegundo: new FormControl(persona.nombresegundo),
          apellidosegundo: new FormControl(persona.apellidosegundo),
          apellidocasada: new FormControl(persona.apellidocasada),
          sexocod: new FormControl(persona.sexo.sexocod),
          edocivilcod: new FormControl(persona.edocivil.edocivilcod),
          fechanacimiento: new FormControl(persona.fechanacimiento),
          paginaweb: new FormControl(persona.paginaweb),
          nacionalidadcod: new FormControl(persona.nacionalidad.nacionalidadcod),
          campousuariochar_1: new FormControl(persona.campousuariochar_1),
          campousuariochar_2: new FormControl(persona.campousuariochar_2),
          campousuariochar_3: new FormControl(persona.campousuariochar_3),
          campousuariochar_4: new FormControl(persona.campousuariochar_5),
          localidadcodnac: new FormControl(persona.localidad.localidadcod),
          nombreprimero: new FormControl(persona.nombreprimero),
          apellidoprimero: new FormControl(persona.apellidoprimero),
          email1: new FormControl(persona.email1),
          email2: new FormControl(persona.email2),
          ocupactivcod: new FormControl(persona.ocupacion_actividad.ocupactivcod),

          telefonos: new FormArray([]),
          direcciones: new FormArray([])
        }),
      }))
      if (persona.telefonos != undefined){
        persona.telefonos.forEach(tel=>{
          this.addTelefonoPR(tel)
        })
      }
      if(persona.direcciones != undefined){
        persona.direcciones.forEach(dir=>{
          this.addDireccionPR(dir)
        })
      }
    }
  }


  get locales() {
    return this.form.controls["locales"] as FormArray
  }

  addLocal(local: Locales | undefined | null): void {
    if (local) {
      this.locales.push(new FormGroup({
        aliado_localnro:new FormControl<number>(local.aliado_localnro),
        sucursal_nombre: new FormControl(local.sucursal_nombre,Validators.required),
        dir_ciudad:new FormControl(local.dir_ciudad),
        dir_estado:new FormControl(local.dir_estado),
        dir_lin1:new FormControl(local.dir_lin1),
        dir_lin2:new FormControl(local.dir_lin2),
        dir_lin3:new FormControl(local.dir_lin3),
        dir_latitud:new FormControl<number>(local.dir_latitud,Validators.required),
        dir_longitud:new FormControl<number>(local.dir_longitud,Validators.required),
        local_principal: new FormControl(local.local_principal),
        local_principal_bool:new FormControl(local.local_principal == 'S'?true:false),
        localidad_texto:new FormControl(local.localidad_texto),
        localidadcod:new FormControl(local.localidadcod,Validators.required),
        telefonos:new FormControl(local.telefonos)
      }))
    } else {
      this.locales.push(new FormGroup({
        aliado_localnro:new FormControl<number>(this.locales.length+1),
        sucursal_nombre: new FormControl('Sede Principal',Validators.required),
        dir_ciudad:new FormControl(''),
        dir_estado:new FormControl(''),
        dir_lin1:new FormControl(''),
        dir_lin2:new FormControl(''),
        dir_lin3:new FormControl(''),
        dir_latitud:new FormControl<number>(10.4806,Validators.required),
        dir_longitud:new FormControl<number>(-66.9036,Validators.required),
        local_principal:new FormControl(this.locales.length==0?'S':'N'),
        local_principal_bool:new FormControl(this.locales.length==0?true:false),
        localidad_texto:new FormControl(''),
        localidadcod:new FormControl('',Validators.required),
        telefonos:new FormControl('')
      }))
    }
  }

  deleteLocal(i: number): void {
    this.locales.removeAt(i)
    this.locales.getRawValue().forEach((element,i) => {
      this.locales.at(i).patchValue({
        aliado_localnro:i+1
      })
    });
  }

  parseGpsData(event:FocusEvent,i:number): void{
    const el = event.target as HTMLInputElement
    const gpsData = el.value.split(',')
    if (gpsData.length == 2){
      const data = {
        dir_latitud:parseFloat(gpsData[0]),
        dir_longitud:parseFloat(gpsData[1])
      }
      this.locales.at(i).patchValue(data)
    }
  }
  
  personaJuridica(dato:TipNip):boolean{
    return dato.personatipocod == 'J'
  }

  buscarPerRelacionada():void {
    super.consultar()
    this.dialog.open(CatalogoPersonaComponent, 
      {data: this.dataDialogo('Búsqueda de personas',undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=> {
      if (result) {
        this.addPersonaRelacionadaFromPersona(result)
      }
    })
  }

  catalogoOcupacion():void{
    this.dialog.open(CatalogoOcupacionActividadComponent, 
      {data: this.dataDialogo('Búsqueda de Ocupación/Actividad',undefined,undefined,undefined,undefined,'A')})
      .afterClosed().subscribe((result)=> {
      if (result) {
        this.form.patchValue({
          persona:{
            ocupactivcod:result.ocupactivcod,
            ocupacion_actividad: result
        }})
      }
    })
  }

  catalogoPersonaJuridica():void{
    this.dialog.open(CatalogoPersonaComponent,
      {data: this.dataDialogo('Búsqueda de Persona Jurídica',undefined,undefined,undefined,25)}
    ).afterClosed().subscribe(result=>{
      if(result){
        const persona:PersonaView = result
        result.ocupactivcod = result.ocupacion_actividad.ocupactivcod
        this.form.patchValue({
          persona:result,
          pagina_web:result.paginaweb
        })
        if (Object.prototype.hasOwnProperty.call(persona,'direcciones')){
          persona.direcciones.forEach(dir=>{
            this.addDireccion(dir)
          }
        )
        } else {
          this.form.patchValue({
            persona:{
              direcciones:null
            }
          })
        }
        if (Object.prototype.hasOwnProperty.call(persona,'telefonos')){
            persona.telefonos.forEach(tel=>{
            this.addTelefono(tel)
          })
        } else {
          this.form.patchValue({
            persona:{
              telefonos:null
            }
          })
        }
    }})
  }
  catalogoLocalidad(i:number):void{
    this.dialog.open(CatalogoLocalidadComponent,
      {data: this.dataDialogo('Búsqueda de Localidad',undefined,undefined,undefined,25)})
      .afterClosed().subscribe(result=>{
        if(result){
          this.locales.at(i).patchValue(
            {
              localidad_texto: result.localidadnombre,
              localidadcod: result.localidadcod
            }
          )
        }
      })
  }


  /**
   * ESTABLECE EL LOCAL PRINCIPAL
   * Asegurándose que solo 1 quede activo en cualquier momoento
   * @param i 
   */
  setLocalPrincipal(i:number):void{
    this.locales.controls.forEach((local,j) => {
      this.locales.at(j).patchValue({
        local_principal: 'N',
        local_principal_bool:false
      })
    });
    this.locales.at(i).patchValue({
      local_principal: 'S',
      local_principal_bool:true
    })
  }


  setAliado(aliado:AliadoRegWrap|AliadoWrap):void{
    this.form.reset()
    this.locales.clear()
    this.direcciones.clear()
    this.telefonos.clear()
    this.personas_relacionadas.clear()
    console.log(aliado)
    
    this.nroAliado.nativeElement.innerHTML = aliado.nroaliado

    if (typeof aliado.persona.fechanacimiento != undefined){
      // aliado.persona.fechanacimiento = new DatePipe('en_US').transform(aliado.persona.fechanacimiento,'YYYY-MM-dd') || ''
      aliado.persona.fechanacimiento = moment(aliado.persona.fechanacimiento).format('YYYY-MM-DD') || ''
    }
    

    if (Object.prototype.hasOwnProperty.call(aliado.persona,'campousuariochar_1') && aliado.persona.campousuariochar_1.split(',').length == 7){
      const formasPago = aliado.persona.campousuariochar_1.split(',')
      this.form.patchValue({
        pagoDb: formasPago[0] == 'on'? true : false,
        pagoMc: formasPago[1] == 'on'? true : false,
        pagoVs: formasPago[2] == 'on'? true : false,
        pagoAm: formasPago[3] == 'on'? true : false,
        pagoTt: formasPago[4] == 'on'? true : false,
        pagoPm: formasPago[5] == 'on'? true : false,
        pagoZl: formasPago[6] == 'on'? true : false
      })
    }

    if (Object.prototype.hasOwnProperty.call(aliado,'campousuariochar_1') && aliado.campousuariochar_1.split(",").length == 2){
      const wifiPublicoOrientado = aliado.campousuariochar_1.split(",")
      this.form.patchValue({
        wifi:wifiPublicoOrientado[0],
        publico_orientado:wifiPublicoOrientado[1]
      })
    }

    if (aliado.locales != undefined){
      aliado.locales.forEach((local:Locales)=>{
        this.addLocal(local)
      })
    }

    if (Object.prototype.hasOwnProperty.call(aliado.persona,'direcciones')){
      aliado.persona.direcciones.forEach(direccion=>{
        this.addDireccion(direccion)
      })
    }
    if (Object.prototype.hasOwnProperty.call(aliado.persona,'telefonos')){
      aliado.persona.telefonos.forEach(telefono=>{
        this.addTelefono(telefono)
      })
    }

    if (Object.prototype.hasOwnProperty.call(aliado,'personas_relacionadas')){
      aliado.personas_relacionadas.forEach((persona:PersonaRelacionadaWrap)=>{
        this.addPersonaRelacionada(persona)
      })
    } else {
      this.addPersonaRelacionada(undefined)
    }

    this.form.patchValue(aliado)
  }


  preAliado():void{
    this.dialog.open(CatalogoAliadoTemporalComponent,{data:this.dataDialogo('Búsqueda de Solicitudes de Afiliación',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      result=>{
        if(result){
          this.setAliado(result)
              this.showSpinner=false
              this.form.disable()
              this.visible=false
        } else {
          this.cancelarAction()
        }
      }
    )
  }

  show(){
    console.log(this.form)
  }
  creaAliado():void{

    this.modificarAction()

    if (this.form.status !== 'VALID'){
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
      return
    }

    this.dialog.open(CatalogoGenericoComponent,{height:'250px', width:'350px', data:this.dataDialogo('Confirmar Aliado',`Está seguro de que desea convertir en aliado a ${this.form.value.persona.nombrecorto}`,'Registrar','Regresar',undefined)}).afterClosed().subscribe(
      result=>{
        if(result){
          this.guardaAliado()
        }else {
          this.form.disable()
          return
        }
      }
      )
    }

    guardaAliado():void{

      super.incluir()
      this.showSpinner=true
      let aliado:AliadoRegWrap = this.form.getRawValue()

      aliado.persona.fechanacimiento = moment(this.form.value.persona.fechanacimiento).format('YYYY/MM/DD')
      aliado.fchafiliacion = moment().format('YYYY/MM/DD')
      // DATA DE ALIADO QUE NO SE PIDE EN EL FORM
      aliado.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      aliado.persona.nombrecompleto = this.form.get('persona')?.get('nombrepersjuridica')?.value
      aliado.persona.nombrecorto = this.form.get('persona')?.get('siglaspersjuridica')?.value

      for (let i=0;i<aliado.locales.length;i++){
        aliado.locales[i].local_principal = this.locales.at(i).value.local_principal_bool==true?'S':'N'
      }
      
      // MODIFICACION DEJA DE EXISTIR AL TENER DONDE GUARDAR LAS FORMAS DE PAGO
      aliado.persona.campousuariochar_1 = this.setFormasPago()
      aliado.campousuariochar_1 = this.form.get('wifi')?.value + "," + this.form.get('publico_orientado')?.value  

      const aliadoTemp:any = aliado

      if(aliadoTemp.persona.direcciones.length==0){
        delete aliadoTemp.persona.direcciones
      }
      if(aliadoTemp.persona.telefonos.length == 0){
        delete aliadoTemp.persona.telefonos
      }
      if(aliadoTemp.personas_relacionadas[0].persona.direcciones.length == 0){
        delete aliadoTemp.personas_relacionadas[0].persona.direcciones
      }
      if(aliadoTemp.personas_relacionadas[0].persona.telefonos.length==0){
        delete aliadoTemp.personas_relacionadas[0].persona.telefonos
      }

      aliado = new AliadoRegWrap()
      aliado = aliadoTemp

      this.service.createAliado(aliado.ciaopr,aliado).subscribe(
        result=>{
          if (result) {
            this.service.setNroAliadoRegistroAliado(result.ciaopr,result).subscribe(result=>{console.log(result)})

            this.setAliado(result)
            this.snack.msgSnackBar('Aliado Creado exitósamente','OK',undefined,'success')
            this.showSpinner=false
            this.visible = false
            this.configBTNForms(false)
            this.form.disable()
          }
          else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al crear','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          console.log(error)
          const msg = error.error.error||'Error al crear'
          this.snack.msgSnackBar(msg,'OK',100000000,'error')
          this.showSpinner=false
        }
      )
    }

    checkWebPage(e:FocusEvent):void{
      const el = e.target as HTMLInputElement
      if(el.value.trim()==='') return
      if(el.value.substring(0,4) !== 'http'){
        this.form.patchValue({
          pagina_web:'https://' + el.value
        })
      }
    }
    
    formatAlias(e:KeyboardEvent):void{
      e.preventDefault()
      const el = e.target as HTMLInputElement
      this.form.patchValue({
        alias:el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:; ]+/g, '')
      })
    }


}
