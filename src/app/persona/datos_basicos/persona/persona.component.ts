import { DatePipe } from '@angular/common'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PersonaView, PersonasService, Direcciones, TelefonoCorreo, LibEnvService } from 'personas'
import { TablasApoyo } from 'personas/lib/dto/config'
import { TipNip } from 'personas/lib/dto/tip-nip'
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component'
import { CatalogoLocalidadComponent } from 'src/app/shared/borrame/catalogo-localidad/catalogo-localidad.component'
import { CatalogoOcupacionActividadComponent } from 'src/app/shared/borrame/catalogo-ocupacion-actividad/catalogo-ocupacion-actividad.component'
import { CatalogoPersonaComponent } from 'src/app/shared/borrame/catalogo-persona/catalogo-persona.component'
import { CrudImpl } from 'vcore'

import * as moment from 'moment'
import { SnackbarService } from 'src/app/layout/snackbar.service'
import { MatSelectChange } from '@angular/material/select'
import { CatalogoPersonasEnCuentaComponent } from 'src/app/shared/borrame/catalogo-personas-en-cuenta/catalogo-personas-en-cuenta.component'

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  providers: []
})
export class PersonaComponent extends CrudImpl implements OnInit {

  defaults:object

  tablasApoyo:TablasApoyo

  visible:boolean

  @ViewChild('main') top:ElementRef

  constructor(
    private libEnvService: LibEnvService,
    private service: PersonasService, 
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    public dialog: MatDialog) {
    super()
    this.form = this.formBuilder.group({
      nombreprimero: new FormControl('',Validators.required),
      nombresegundo: new FormControl(''),
      apellidoprimero: new FormControl('',Validators.required),
      apellidosegundo: new FormControl(''),
      apellidocasada: new FormControl(''),
      apodo: new FormControl(''),
      nombrecorto: new FormControl(''),
      nombrecompleto: new FormControl(''),
      tipnip: new FormControl('',Validators.required),
      codnip: new FormControl('',Validators.required),
      // ,Validators.pattern('[0-9]*')]
      sexo: new FormGroup({
        sexocod: new FormControl(''),
        sexonombre: new FormControl('')
      }),
      edocivil: new FormGroup({
        edocivilcod: new FormControl(''),
        edocivilnombre: new FormControl('')
      }),
      ocupacion_actividad: new FormGroup({
        ocupactivcod: new FormControl(''),
        ocupactivnombre: new FormControl(''),
      }),
      localidad: new FormGroup({
        localidadcod: new FormControl(''),
        localidadnombre: new FormControl(''),
      }),
      nacionalidad: new FormGroup({
        nacionalidadcod: new FormControl(''),
      }),
      fechanacimiento: new FormControl(''),
      email1: new FormControl('',[Validators.email,Validators.required]),
      email2: new FormControl('',Validators.email),
      telefonos: new FormArray([]),
      direcciones: new FormArray([]),
      nropersona: new FormControl(null)
    })
  }

  get direcciones() {
    return this.form.controls["direcciones"] as FormArray
  }

  get telefonos() {
    return this.form.controls["telefonos"] as FormArray
  }

  ngOnInit() {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo

    this.setDefaults()
    // this.crud.btnIncluir.visible=false
    this.crud.btnEliminar.visible=false
    this.crud.btnModificar.visible=false
    this.crud.btnIncluir.visible=false
    // this.crud.btnModificar.visible=false
  }

  setPersona(persona: PersonaView): void {
    this.form.reset()

    if (typeof persona.fechanacimiento != undefined){
      persona.fechanacimiento = new DatePipe('en_US').transform(persona.fechanacimiento,'YYYY-MM-dd') || ''
    }

    this.form.patchValue(persona)

    this.telefonos.clear()
    this.direcciones.clear()

    if (persona.telefonos != null) {
      for (let i = 0; i < persona.telefonos.length; i++) {
        this.addTelefono(persona.telefonos.at(i))
      }
    } 

    if (persona.direcciones != null) {
      for (let i = 0; i < persona.direcciones.length; i++) {
        this.addDireccion(persona.direcciones.at(i))
      }
    }

  }

  setDefaults():void{
    this.defaults = {
      tipnip:this.tablasApoyo.tipNip.find(t=>t.valorpordefecto==='S')?.tipnipcod,
      sexo:{
        sexocod:this.tablasApoyo.sexo.find(t=>t.valorpordefecto==='S')?.sexocod
      },
      edocivil:{
        edocivilcod:this.tablasApoyo.edoCivil.find(t=>t.valorpordefecto==='S')?.edocivilcod
      },
      nacionalidad:{
        nacionalidadcod:this.tablasApoyo.nacionalidad.find(t=>t.valorpordefecto==='S')?.nacionalidadcod
      },
      telefonos:[{
          telefonotipcod:this.tablasApoyo.telefonoTipo.find(t=>t.valorpordefecto==='S')?.telefonotipcod,
          telefonocodigopais:"+58"
      }],
      direcciones:[{
        dirtipocod:this.tablasApoyo.tipoDireccion.find(t=>t.valorpordefecto==='S')?.dirtipocod
      }]
    }
  }

  override incluirAction(): void {
    super.incluirAction()
    this.setPersona(new PersonaView())
    // this.addTelefono(new TelefonoCorreo())
    // this.addDireccion(new Direcciones())
    this.visible=true

    // ASIGNA VALORES POR DEFECTO A LOS SELECTS DEL FORM
    this.form.patchValue(this.defaults)
  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoPersonasEnCuentaComponent, 
      {data: this.dataDialogo('Búsqueda de personas',undefined,undefined,undefined,25,'N')})
      .afterClosed().subscribe((result)=> {
      if (result) {
        this.buscaPersona(result.nropersona)
      }
    })
  }

  buscaPersona(nropersona:number):void{
    
    this.service.getPersonaViewXNropersonaSecured(this.libEnvService.getConfig().ciaopr.ciaopr,nropersona).subscribe(
      {
        next: (result:PersonaView) => {
          this.setPersona(result)
          this.form.disable()
          this.visible=false
        },
        error: (error) => {
          console.log(error)
          this.snack.msgSnackBar('Hubo un error','OK',undefined,'error')
        }
      }
    )
  }

  override modificarAction(): void {
      super.modificarAction()
      this.visible=true
  }
  override cancelarAction(): void {
      super.cancelarAction()
      this.telefonos.clear()
      this.direcciones.clear()
      this.visible=false
  }

  override eliminarAction(): void {
    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Eliminar Registro","Está seguro de que desea eliminar el registro","Eliminar")}).afterClosed().subscribe(
        (respuesta)=>{
          if (respuesta) {
            console.log('eliminamos a la persona')
          } else {
            console.log('nos arrepentimos de eliminar')
          }
        })
    super.eliminarAction()
  }

  // /**
  //  * 
  //  * @param titulo Texto que aparece en la cabecera del diálogo
  //  * @param mensaje Mensaje a mostrar
  //  * @param textoBotonTrue Texto que aparece el el botón afirmativo
  //  * @param textoBotonFalse Texto que aparece en el botón negativo
  //  * @param cantRegistros Número de registros que se muestran por página en los catálogos
  //  * @returns Objeto con la información necesaria para llenar un diálogo genérico
  //  */
  //  dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,opciones?:string){
  //   return {
  //     "titulo":titulo,
  //     "msg":mensaje || '',
  //     "btn_true_text":textoBotonTrue || 'Aceptar',
  //     "btn_false_text":textoBotonFalse || 'Cancelar',
  //     "cant_registros": cantRegistros || 25,
  //     "campousuariochar_1":opciones || undefined
  //   }
  // }

  // override aceptar(): void {
  //   console.log("Acción de aceptar")
  // }

  override incluir(): void {
    if(this.form.get('email1')?.value == this.form.get('email2')?.value){
      this.dialog.open(CatalogoGenericoComponent, {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Error de validación","Los correos deben ser distintos")}).afterClosed().subscribe(
      )
      return;
    }

    // esto debería suceder al aceptar, estando en modo incluir
    if (this.form.status == 'VALID'){
        super.incluir()
        this.showSpinner=true
        let persona:PersonaView = this.form.getRawValue()
        persona.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
        persona.fechanacimiento = moment(this.form.get('fechanacimiento')?.value || '1999/01/01').format('YYYY/MM/DD')

        // if (persona.nombrecompleto == null || persona.nombrecompleto.trim() == '') {
        //   persona.nombrecompleto = persona.apellidoprimero + persona.apellidosegundo? ' '+persona.apellidosegundo:'' + ', ' + persona.nombreprimero + ' ' + persona.nombresegundo?' '+persona.nombresegundo:''
        // }
        // if (persona.nombrecorto == null || persona.nombrecorto.trim() == '') {
        //   persona.nombrecorto =  persona.nombreprimero + ' ' + persona.apellidoprimero
        // }

        if (persona.tipnip == 'T' || persona.tipnip == 'S') {
          const pt:any = persona
          pt.codnip =null
          persona=pt
        }
        console.log('voy a guardar esto:=>')
        console.log(persona)

        this.service.upserPersona(persona.ciaopr,persona).subscribe(
          result=>{
            if(result){
              this.form.reset()
              this.snack.msgSnackBar('Guardado con éxito','OK',undefined,'success')
              this.setPersona(result)
              this.showSpinner=false
              this.visible = false
              this.configBTNForms(false)
              this.form.disable()
              this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
              super.consultar()
            } else {
              console.log('hubo un error')
              this.showSpinner=false
              this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
            }
          },error=>{
            console.log('HUBO UN ERROR')
            console.log(error)
            this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
            this.showSpinner=false
          }
        )
      } else {
        this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
        this.form.markAllAsTouched()
      }
  }

  override modificar(): void {
    if(this.form.get('email1')?.value == this.form.get('email2')?.value){
      this.dialog.open(CatalogoGenericoComponent, {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Error de validación","Los correos deben ser distintos")}).afterClosed().subscribe(
      )
      return;
    }

    
    
    // esto debería suceder al aceptar, estando en modo modificar
    if (this.form.status == 'VALID'){
      super.modificar()
      this.showSpinner=true
      const persona:PersonaView = this.form.getRawValue()
      persona.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      persona.fechanacimiento = moment(this.form.get('fechanacimiento')?.value || '1990/01/01').format('YYYY/MM/DD')

      this.service.upserPersona(persona.ciaopr,persona).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Modificado con éxito','OK',undefined,'success')
            this.setPersona(result)
            this.showSpinner=false
            this.visible = false
            this.configBTNForms(false)
            this.form.disable()
            this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            super.consultar()
          } else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
          console.log(error)
          this.showSpinner=false
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
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
        telefonotipcod: new FormControl('',Validators.required),
        telefonocodigopais: new FormControl('+58',Validators.required),
        telefonocodigoarea: new FormControl('',Validators.required),
        telefononumero: new FormControl('',Validators.required)
      }))
    }
  }

  deleteTelefono(i: number): void {
    this.telefonos.removeAt(i)
  }

  addDireccion(dir: Direcciones | undefined | null): void {
    if (dir) {
      this.direcciones.push(new FormGroup({
        dirtipocod: new FormControl(dir.dirtipocod,Validators.required),
        direccion1: new FormControl(dir.direccion1,Validators.required),
        direccion2: new FormControl(dir.direccion2),
        direccion3: new FormControl(dir.direccion3),
        direccion4: new FormControl(dir.direccion4),
        localidadcod: new FormControl(dir.localidadcod),
        localidadtexto: new FormControl(dir.localidadtexto),
        codpostalcod: new FormControl(dir.codpostalcod),
        dir_latitud: new FormControl<number|null>(dir.dir_latitud),
        dir_longitud: new FormControl<number|null>(dir.dir_longitud)
      }))
    } else {
      this.direcciones.push(new FormGroup({
        dirtipocod: new FormControl('',Validators.required),
        direccion1: new FormControl('',Validators.required),
        direccion2: new FormControl(''),
        direccion3: new FormControl(''),
        direccion4: new FormControl(''),
        localidadcod: new FormControl(''),
        localidadtexto: new FormControl(''),
        codpostalcod: new FormControl(''),
        dir_latitud: new FormControl<number|null>(null),
        dir_longitud: new FormControl<number|null>(null)
      }))
    }
  }

  deleteDireccion(i: number): void {
    this.direcciones.removeAt(i)
  }

  parseGpsData(event:any,i:number): void{
    const gpsData = event.target.value.split(',')
    console.log(gpsData)
    if (gpsData.length == 2){
      const data = {
        dir_latitud:parseFloat(gpsData[0]),
        dir_longitud:parseFloat(gpsData[1])
      }
      this.direcciones.at(i).patchValue(data)
    }
  }

  personaNatural(dato:TipNip):boolean{
    return dato.personatipocod == 'N'
  }

  catalogoLocalidad(i?:number):void{
    this.dialog.open(CatalogoLocalidadComponent, 
      {data: this.dataDialogo('Búsqueda de localidad')})
      .afterClosed().subscribe((result)=> {
      if (result) {
        if (i==undefined){
            this.form.patchValue({
              localidad: result
        })} else {
          this.direcciones.at(i).patchValue({
            localidadtexto: result.localidadnombre,
            localidadcod: result.localidadcod
          })
        }
      }
    })
  }

  catalogoOcupacion():void{
    this.dialog.open(CatalogoOcupacionActividadComponent, 
      {data: this.dataDialogo('Búsqueda de Ocupación/Actividad',undefined,undefined,undefined,undefined,'O')})
      .afterClosed().subscribe((result)=> {
      if (result) {
        this.form.patchValue({
          ocupacion_actividad: result
        })
      }
    })
  }

  /**
   * funcion temporal, eliminar
   */
  showFormValidity(){
    if (this.form.status == "VALID"){
      console.log('########################\nTodo bien con el form\n########################\n')
      this.snack.msgSnackBar('Todo bien','Cerrar',1000)
    } else {
      this.snack.msgSnackBar('Error de validación','Revisaré')
      console.log('########################\nREVISAR DATA\n########################\n')
    }


    // MUESTRA ERRORES EN CONSOLE
    let totalErrors = 0;
    const ve:ValidationErrors = {}
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key)?.errors || ve;
      if (controlErrors != null) {
         totalErrors++;
         Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
      }
    });
    console.log(`%c ==>> Errores de validación: ${totalErrors}`, 'color: red; font-weight: bold; font-size:25px;');
  
    // if (this.form.get('fechanacimiento')?.value!= null && 
      // Object.prototype.hasOwnProperty.call(this.form.get('fechanacimiento')?.value,'_isAMomentObject')){
      console.log('debo corregir fecha')
      console.log(this.form.get('fechanacimiento')?.value)
      console.log('fecha corregida')
      console.log(moment(this.form.get('fechanacimiento')?.value).format('YYYY/MM/DD'))
    // }

    // COMANDO QUE HACE LA MAGIA DE MARCARLAS EN ROJO
    this.form.markAllAsTouched()
  }

  changeNip(e:MatSelectChange):void{
    if (e.value == 'T' || e.value == 'S'){
      this.form.get('codnip')?.setValue('0')
      this.form.get('codnip')?.disable()
    } else {
      this.form.get('codnip')?.setValue('')
      this.form.get('codnip')?.enable()
    }
  }
  
}
