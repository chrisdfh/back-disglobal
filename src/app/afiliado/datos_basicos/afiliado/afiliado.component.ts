import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudImpl } from 'vcore';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoPersonaComponent } from 'src/app/shared/borrame/catalogo-persona/catalogo-persona.component';
import { CatalogoAfiliadoComponent } from 'src/app/shared/borrame/catalogo-afiliado/catalogo-afiliado.component';
import { AfiliadoService, AfiliadoView } from 'aliados';
import { MatSelectChange } from '@angular/material/select';
import { TablasApoyo } from 'personas/lib/dto/config';
import { Direcciones, LibEnvService, TelefonoCorreo } from 'personas';
import { TipNip } from 'personas/lib/dto/tip-nip';
import * as moment from 'moment';
import { CatalogoLocalidadComponent } from 'src/app/shared/borrame/catalogo-localidad/catalogo-localidad.component';
import { Md5 } from 'ts-md5';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-afiliado',
  templateUrl: './afiliado.component.html',
  styleUrls: ['./afiliado.component.css']
})
export class AfiliadoComponent extends CrudImpl implements OnInit{

  defaults:object
  tablasApoyo:TablasApoyo
  visible:boolean
  @ViewChild('nroAfiliado') nroAfiliado:ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private snack:SnackbarService,
    private service:AfiliadoService,
    private libEnvService: LibEnvService,
    public dialog:MatDialog
  ){
    super()
    this.form = this.formBuilder.group({
      
      tipnip: new FormControl('', Validators.required),
      alias: new FormControl('', Validators.required),
      codnip: new FormControl(''),
      nroafiliado: new FormControl(''),
      nropersona: new FormControl(''),

      nombreprimero: new FormControl('', Validators.required),
      nombresegundo: new FormControl(''),
      apellidoprimero: new FormControl('', Validators.required),
      apellidosegundo: new FormControl(''),
      nombrecompleto: new FormControl(''),
      nombrecorto: new FormControl(''),

      edocivilcod: new FormControl(''),
      edocivilnombre: new FormControl(''),
      sexocod: new FormControl(''),
      sexonombre: new FormControl(''),

      email_publico: new FormControl('', [Validators.required,Validators.email]),
      email_secundario: new FormControl('',Validators.email),
      estatus01: new FormControl(''),
      estatus02: new FormControl(''),
      estatus03: new FormControl(''),
      fechanacimiento: new FormControl(''),
      nombrepersjuridica: new FormControl(''),
      pagina_web: new FormControl(''),

      rs_facebook: new FormControl(''),
      rs_instagram: new FormControl(''),
      rs_twitter: new FormControl(''),

      pregseguridad1: new FormControl(null),
      pregseguridad2: new FormControl(null),
      pregseguridad3: new FormControl(null),
      respuestaseguridad1: new FormControl(null),
      respuestaseguridad2: new FormControl(null),
      respuestaseguridad3: new FormControl(null),

      direcciones: new FormArray([]),
      telefonos:new FormArray([]),

      password: new FormControl(''),
    })
  }


  ngOnInit(): void {
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.cancelarAction()
    this.setDefaults()
  }

  setDefaults():void{
    this.defaults = {
      pagina_web:'https://',
      estatus01:'SE1',
      estatus02:'SE2',
      estatus03:'SE3',
      edocivilnombre:'Soltero',
      edocivilcod:'S',
      sexocod:'M',
      sexonombre:'Masculino',
      tipnip:'V'
    }
  }

  // #region BOTONES CRUD
  protected override incluirAction(): void {
    super.incluirAction()
    this.telefonos.clear()
    this.direcciones.clear()
    this.form.patchValue(this.defaults)
    this.visible=true
  }

  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoAfiliadoComponent,{data:this.dataDialogo('Búsqueda de afiliados',undefined,undefined,undefined,25)}).afterClosed()
      .subscribe((result:AfiliadoView)=> {
        if (result) {
          this.setAfiliado(result)
          this.form.disable()
          this.visible=false
          
        }
    })
  }
  protected override cancelarAction(): void {
    super.cancelarAction()
    this.visible=false
  }
  protected override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }


  // #region METODOS CRUD
  override incluir(): void {
    if (!this.form.valid) {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
      return
    }
    super.incluir()
    const afiliado:AfiliadoView = this.form.getRawValue()
    afiliado.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    if (afiliado.fechanacimiento !== undefined && afiliado.fechanacimiento !== null && afiliado.fechanacimiento !== '') {
      afiliado.fechanacimiento = moment(afiliado.fechanacimiento).format('YYYY/MM/DD')
    }
    
    const pwd = Md5.hashStr('123456789')
    afiliado.password = pwd

    this.showSpinner = true
    this.service.createAfiliado(afiliado.ciaopr,afiliado).subscribe(
      (result:AfiliadoView)=>{
        if (result) {
          this.snack.msgSnackBar('Afiliado incluido correctamente','Ok',undefined,'success')
          this.incluirAction()
          this.showSpinner = false
          this.setAfiliado(result)
        } else {
          console.log('hubo un error')
          this.showSpinner=false
          this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
        }
      },error=>{
        console.log('HUBO UN ERROR')
        console.log(error)
        this.snack.msgSnackBar(error.error.error||'Error al guardar','OK',undefined,'error')
        this.showSpinner=false
      },()=>{
        this.showSpinner=false
      }
    )
  }

  override modificar(): void {
    if (!this.form.valid) {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
      return
    }
    super.modificar()
    const afiliado:AfiliadoView = this.form.getRawValue()
    afiliado.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    afiliado.fechanacimiento = moment(afiliado.fechanacimiento).format('YYYY/MM/DD')

    console.log(afiliado)
    
  }

  // #region CATALOGOS
  catalogoPersona():void{
    this.dialog.open(CatalogoPersonaComponent, 
      {data: this.dataDialogo('Búsqueda de personas',undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=> {
      if (result) {
        this.form.patchValue(result)
      }
    })
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

  // #region CONTROLES DE DIRECCION Y TELEFONO

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

  get direcciones() {
    return this.form.controls["direcciones"] as FormArray
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


  parseGpsData(event:FocusEvent,i:number): void{
    const el = event.target as HTMLInputElement
    const gpsData = el.value.split(',')
    if (gpsData.length == 2){
      const data = {
        dir_latitud:parseFloat(gpsData[0]),
        dir_longitud:parseFloat(gpsData[1])
      }
      this.direcciones.at(i).patchValue(data)
    }
  }


  //#region METODOS DE CLASE

  formatAlias(e:KeyboardEvent):void{
    e.preventDefault()
    const el = e.target as HTMLInputElement
    this.form.patchValue({
      alias:el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:;]+/g, '').replace(/[ ]+/g, '-')
    })
  }
  changeNip(e:MatSelectChange):void{
    if (e.value == 'T'){
      this.form.get('codnip')?.setValue('0')
      this.form.get('codnip')?.disable()
    } else {
      this.form.get('codnip')?.setValue('')
      this.form.get('codnip')?.enable()
    }
  }
  personaNatural(dato:TipNip):boolean{
    return dato.personatipocod == 'N'
  }

  setAfiliado(afiliado:AfiliadoView):void{
    this.form.reset()

    this.nroAfiliado.nativeElement.innerText = afiliado.nroafiliado

    if (typeof afiliado.fechanacimiento != undefined){
      afiliado.fechanacimiento = moment(afiliado.fechanacimiento).format('YYYY-MM-DD') || ''
    }
    this.form.patchValue(afiliado)

    this.telefonos.clear()
    this.direcciones.clear()

    if (afiliado.telefonos != null) {
      for (let i = 0; i < afiliado.telefonos.length; i++) {
        this.addTelefono(afiliado.telefonos.at(i))
      }
    } 

    if (afiliado.direcciones != null) {
      for (let i = 0; i < afiliado.direcciones.length; i++) {
        this.addDireccion(afiliado.direcciones.at(i))
      }
    }
  }


  showForm():void{
    console.log(this.form.value)
  }
}
