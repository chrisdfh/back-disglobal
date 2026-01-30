import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaTasker, Locales, TaskerService, TaskerView } from 'aliados';
import { Direcciones, LibEnvService, TelefonoCorreo } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { TipNip } from 'personas/lib/dto/tip-nip';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoLocalidadComponent } from 'src/app/shared/borrame/catalogo-localidad/catalogo-localidad.component';
import { CatalogoOcupacionActividadComponent } from 'src/app/shared/borrame/catalogo-ocupacion-actividad/catalogo-ocupacion-actividad.component';
import { CrudImpl } from 'vcore';
import * as moment from 'moment';
import { CatalogoCategoriaTaskerComponent } from 'src/app/shared/borrame/catalogo-categoria-tasker/catalogo-categoria-tasker.component';
import { CatalogoTaskerComponent } from 'src/app/shared/borrame/catalogo-tasker/catalogo-tasker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasker',
  templateUrl: './tasker.component.html',
  styleUrls: ['./tasker.component.css']
})
export class TaskerComponent extends CrudImpl implements OnInit{

  defaults:object

  tablasApoyo:TablasApoyo

  visible:boolean

  avatar:string

  avatars:string[]

  @ViewChild('main') top:ElementRef

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

  constructor(
    private router:Router,
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: TaskerService,
    public dialog: MatDialog){
    super()
    this.form = this.formBuilder.group({
        ciaopr: new FormControl(''),
        nrotasker: new FormControl(''),
        nropersona: new FormControl(''),
        categoriacod: new FormControl('',Validators.required),
        categorianombre: new FormControl(''),
        email_publico: new FormControl('',Validators.required),
        rs_twitter: new FormControl(''),
        fchafiliacion: new FormControl(''),
        rs_facebook: new FormControl(''),
        rs_instagram: new FormControl(''),
        alias: new FormControl('',Validators.required),
        pagina_web: new FormControl(''),
        presentacion: new FormControl(''),
        descripcion1: new FormControl(''),
        descripcion2: new FormControl(''),
        descripcion3: new FormControl(''),
        url_avatar1: new FormControl(''),
        datos_extra: new FormGroup({
          nrotasker: new FormControl(''),
          oro_plata_bronce: new FormControl(''),
          xitytask_seguro: new FormControl(''),
          referencias_verificadas: new FormControl(''),
          antecedentes_verificados: new FormControl(''),
          alcaldia_verificado: new FormControl(''),
          ref_verif_fecha: new FormControl(''),
          ant_verif_fecha: new FormControl(''),
          alc_verif_fecha: new FormControl(''),
          nro_reg_org_fiscal: new FormControl(''),
          veces_contratado: new FormControl(''),
          nrovaloraciones: new FormControl(''),
          valoracion_1: new FormControl(''),
          valoracion_2: new FormControl(''),
          valoracion_3: new FormControl(''),
          valoracion_4: new FormControl(''),
          valoracion_5: new FormControl(''),
          cant_taskers: new FormControl(''),
          citas_dias_minimo: new FormControl(''),
          citas_dias_maximo: new FormControl(''),
          nrocta_1: new FormControl(''),
          entidadcod_1: new FormControl(''),
          tipocuenta_1: new FormControl(''),
          nrocta_2: new FormControl(''),
          entidadcod_2: new FormControl(''),
          tipocuenta_2: new FormControl(''),
        }),
        persona: new FormGroup({
          nombreprimero: new FormControl('',Validators.required),
          nombresegundo: new FormControl(''),
          apellidoprimero: new FormControl('',Validators.required),
          apellidosegundo: new FormControl(''),
          apellidocasada: new FormControl(''),
          fechanacimiento: new FormControl('',Validators.required),
          tipnip: new FormControl('',Validators.required),
          codnip: new FormControl('',Validators.required),
          localidad: new FormGroup({
            localidadcod: new FormControl(''),
            localidadnombre: new FormControl(''),
          }),
          ocupacion_actividad: new FormGroup({
            ocupactivcod: new FormControl(''),
            ocupactivnombre: new FormControl(''),
          }),
          nacionalidad: new FormGroup({
            nacionalidadcod: new FormControl(''),
          }),
          sexo: new FormGroup({
            sexocod: new FormControl(''),
            sexonombre: new FormControl('')
          }),
          edocivil: new FormGroup({
            edocivilcod: new FormControl(''),
            edocivilnombre: new FormControl('')
          }),
          telefonos: new FormArray([]),
          direcciones: new FormArray([])
        }),
        categorias: new FormArray([]),
        locales: new FormArray([]),

        para_crear_tags: new FormControl(''),
    })
  }



  /**
   * Initializes the component with default values and configurations.
   *
   * @return {void} 
   */
  ngOnInit(): void {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.avatars = this.libEnvService.getConfig().avatars
    this.setDefaults()
  }


  // ACCIONES DE LOS BOTONES
  override incluirAction(): void {
    super.incluirAction()
    this.form.reset()
    this.form.patchValue(this.defaults)
    this.updateAvatar()
    this.visible=true

    this.telefonos.clear()
    this.direcciones.clear()
    this.categorias.clear()
    this.locales.clear()
  }
  override cancelarAction(): void {
    super.cancelarAction()
    this.form.reset()
    this.form.disable()
    this.visible=false
    this.avatar=''
    
    this.telefonos.clear()
    this.direcciones.clear()
    this.categorias.clear()
    this.locales.clear()
  }
  override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }

  override consultar(): void {
      
    super.consultar()
    this.form.enable()
    this.form.reset()
    this.categorias.clear()
    this.telefonos.clear()
    this.direcciones.clear()
    this.locales.clear()
    this.avatar=''
    this.dialog.open(CatalogoTaskerComponent,{data:this.dataDialogo("Búsqueda de Tasker",undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=>{
        if(result){
          console.log(result)
          this.setTasker(result)
          this.form.disable()
          this.visible=false
        }
      })
  super.consultar()
  }
  // FIN ACCIONES DE BOTONES

  // INTERACCIÓN CON BD
  
  override incluir(): void {
    if (this.form.status == 'VALID'){
      super.incluir()
      this.showSpinner=true
      const tasker:TaskerView = this.form.getRawValue()

      console.log(JSON.stringify(tasker))
      tasker.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      tasker.fchafiliacion = moment().format('YYYY/MM/DD')
      tasker.persona.fechanacimiento = moment(this.persona.get('fechanacimiento')?.value).format('YYYY/MM/DD')

      this.service.creaTasker(tasker.ciaopr,tasker).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Tasker creado exitósamente','OK',undefined,'success')

            this.setTasker(result)

            this.showSpinner=false
            this.configBTNForms(false)
            this.form.disable()
            this.visible = false
            this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al guardar (${error.error.error || error.statusText})`,'OK',undefined,'error')
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  override modificar(): void {
    if (this.form.status == 'VALID'){
      super.incluir()
      this.showSpinner=true
      const tasker:TaskerView = this.form.getRawValue()
      
      tasker.datos_extra.nrotasker = tasker.nrotasker
      tasker.datos_extra.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr


      tasker.fchafiliacion = tasker.fchafiliacion!=null ? tasker.fchafiliacion : moment().format('YYYY/MM/DD')
      tasker.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      tasker.persona.fechanacimiento = moment(this.persona.get('fechanacimiento')?.value).format('YYYY/MM/DD')

      // console.log(tasker)
      // this.showSpinner=false
      // if (!confirm('guarda?')) return
      this.service.creaTasker(tasker.ciaopr,tasker).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Tasker modificado exitósamente','OK',undefined,'success')

            this.setTasker(result)

            this.showSpinner=false
            this.configBTNForms(false)
            this.form.disable()
            this.visible = false
            this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar(`Error al modificar (${error.error.error || error.statusText})`,'OK',undefined,'error')
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  // FIN INTERACCIÓN CON BD
  setDefaults():void{
    this.defaults = {
        ciaopr:this.libEnvService.getConfig().ciaopr.ciaopr,
        pagina_web:'',
        url_avatar1:'https://scienceoxford.com/wp-content/uploads/2018/03/avatar-male.jpg',

      persona:{
        ciaopr:this.libEnvService.getConfig().ciaopr.ciaopr,
        tipnip:'V',
        nacionalidad:{
          nacionalidadcod:'VEN',
        },

        sexo:{
          sexocod:'M'
        }
      }
    }

  }


  // WATERFALL PARA LLEGAR A DIRECCIONES Y TELEFONOS DE PERSONA
  get persona():FormGroup{
    return this.form.controls['persona'] as FormGroup
  }
  get direcciones(){
    return this.persona.controls['direcciones'] as FormArray
  }
  get telefonos(){
    return this.persona.controls['telefonos'] as FormArray
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
    } else {
      this.direcciones.push(
        new FormGroup({
          dirtipocod: new FormControl(''),
          direccion1: new FormControl(''),
          direccion2: new FormControl(''),
          direccion3: new FormControl(''),
          direccion4: new FormControl(''),
          localidadcod: new FormControl(''),
          localidadtexto: new FormControl(''),
          codpostalcod: new FormControl(''),
          dir_latitud: new FormControl<number | null>(null),
          dir_longitud: new FormControl<number | null>(null),
        })
      );
    }
  }
  addTelefono(tel: TelefonoCorreo | undefined | null): void {
    if (tel) {
      this.telefonos.push(
        new FormGroup({
          telefonotipcod: new FormControl(tel?.telefonotipcod),
          telefonocodigopais: new FormControl(tel?.telefonocodigopais),
          telefonocodigoarea: new FormControl(tel?.telefonocodigoarea),
          telefononumero: new FormControl(tel?.telefononumero),
        })
      );
    } else {
      this.telefonos.push(
        new FormGroup({
          telefonotipcod: new FormControl(''),
          telefonocodigopais: new FormControl(''),
          telefonocodigoarea: new FormControl(''),
          telefononumero: new FormControl(''),
        })
      );
    }
  }
  deleteTelefono(i: number): void {
    this.telefonos.removeAt(i)
  }
  deleteDireccion(i: number): void {
    this.direcciones.removeAt(i)
  }


  get categorias():FormArray{
    return this.form.controls['categorias'] as FormArray
  }
  addCategoria(cat: CategoriaTasker | undefined):void{
    if (cat == undefined){
      this.categorias.push(new FormGroup({
        ciaopr: new FormControl(null, Validators.required),
        categoriacod: new FormControl(null, Validators.required),
        categorianombre: new FormControl(null),
        categoriadescripcion: new FormControl(null),
        categoriapadrecod: new FormControl(null),
        valorpordefecto: new FormControl(null)
      }))
      this.catalogoCatTasker((this.categorias.length-1))
    } else {
      this.categorias.push(new FormGroup({
        ciaopr: new FormControl(cat.ciaopr, Validators.required),
        categoriacod: new FormControl(cat.categoriacod, Validators.required),
        categorianombre: new FormControl(cat.categorianombre),
        categoriadescripcion: new FormControl(cat.categoriadescripcion),
        categoriapadrecod: new FormControl(cat.categoriapadrecod),
        valorpordefecto: new FormControl(cat.valorpordefecto)
      }))
    }
  }
  deleteCategoria(i:number):void{
    this.categorias.removeAt(i)
  }
  updateCategorias():void{
    const arrayCatTasker:string[] = this.form.get('categoriastasker')?.value
    if (arrayCatTasker == null) return
    this.categorias.clear()
    arrayCatTasker.forEach(cat=>{
      const catTasker = new CategoriaTasker()
      catTasker.categoriacod = cat
      this.addCategoria(catTasker)
    })

    console.log(this.form.get('categoriatasker')?.value)
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



  parseGpsData(event:FocusEvent,i:number): void{

    const rawGpsData = event.target as HTMLInputElement
    const gpsData = rawGpsData.value.split(',')
    if (gpsData.length == 2){
      const data = {
        dir_latitud:parseFloat(gpsData[0]),
        dir_longitud:parseFloat(gpsData[1])
      }
      this.locales.at(i).patchValue(data)
    }
  }

  personaNatural(dato:TipNip):boolean{
    return dato.personatipocod == 'N'
  }
  

  catalogoLocalidad(i?:number,local?:boolean):void{
    this.dialog.open(CatalogoLocalidadComponent, 
      {data: this.dataDialogo('Búsqueda de localidad')})
      .afterClosed().subscribe((result)=> {
      if (result) {
        if (i==undefined){
            this.form.patchValue({
              persona:{
                localidad:result
              }
        })}else if (local!= undefined && local){
        this.locales.at(i).patchValue({
          localidad_texto: result.localidadnombre,
          localidadcod: result.localidadcod
        })
        }else {
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
          persona:{
            ocupacion_actividad: result
          }
        })
      }
    })
  }

  catalogoCatTasker(i?:number,esPadre?:boolean):void{
    esPadre=esPadre||false
    this.dialog.open(CatalogoCategoriaTaskerComponent,
      {data: this.dataDialogo('Búsqueda de Categorías de Taskers',undefined,undefined,undefined,undefined, (!esPadre? this.getCatPadre(): undefined))})
      .afterClosed().subscribe((result:CategoriaTasker)=>{
        if(result){
          if(i!==undefined){
            console.log(typeof result)
            this.categorias.at(i).setValue(result)
          } else {
            this.form.patchValue({
              categoriacod:result.categoriacod,
              categorianombre:result.categorianombre
            })
          } 
        } //else if (i !== undefined){
          //this.deleteCategoria(i)
        //}
      }
    )
  }

  getCatPadre():(string|undefined) {
    if (this.form.value.categoriacod != null)return this.form.value.categoriacod.split('-')[0]+'-'
    return undefined
  }


  setTasker(tasker:TaskerView):void {
    this.categorias.clear()
    this.direcciones.clear()
    this.telefonos.clear()
    this.locales.clear()

    if (typeof tasker.persona.fechanacimiento != undefined ){
      tasker.persona.fechanacimiento = moment(tasker.persona.fechanacimiento).format('YYYY-MM-DD')
    }

    this.form.patchValue(tasker)
    
    if (tasker.categorias != null && tasker.categorias.length > 0){
      tasker.categorias.forEach(cat=>{
        this.addCategoria(cat)
      })
    }

    if (tasker.persona.direcciones!= null && tasker.persona.direcciones.length > 0 ){
      tasker.persona.direcciones.forEach(dir=>{
        this.addDireccion(dir)
      })
    }

    if (tasker.persona.telefonos != null && tasker.persona.telefonos.length > 0){
      tasker.persona.telefonos.forEach(tel=>{
        this.addTelefono(tel)
      })
    }

    if (tasker.locales != null && tasker.locales.length > 0){
      tasker.locales.forEach(loc=>{
        this.addLocal(loc)
      })
    }

    this.updateAvatar()
  }

  updateAvatar():void{
    this.avatar = this.form.get('url_avatar1')?.value
  }

  setAvatar(e:MouseEvent):void{
    const imgHtml = e.target as HTMLImageElement
    this.form.patchValue({
      url_avatar1:imgHtml.src
    })
    this.updateAvatar()
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

  appendTags(e:FocusEvent):void{
    const el = e.target as HTMLTextAreaElement
    if(el.value.trim()==='') return

    const tagsConHash = [... new Set(el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:;]+/g, '').split(','))].map(tag => {
      if (tag.charAt(0) === '#') return tag.trim()
      return '#' + tag.trim().replace(/ /g, '')
    })
    const tagsConHashSinRepetir = [... new Set(tagsConHash)]

//.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@#+=`:,;]+/g, '')

    let tags:string[] = []
    let tagsExistentes = this.form.get('descripcion2')?.value

    if (tagsExistentes == '') tagsExistentes=null

    if (tagsExistentes !== null){
      const tagExistentesArray = tagsExistentes.split(', ')
      
      const joinTags:string[] = tagExistentesArray.concat(tagsConHashSinRepetir)
      tags = [... new Set(joinTags)]
    } else {
      tags = tagsConHashSinRepetir
    }
    this.form.patchValue({
      descripcion2:tags.join(', '),
      para_crear_tags:''
    })

  }
  removeDuplicateTags(e:FocusEvent){
    const el = e.target as HTMLTextAreaElement
    if (el.value.trim() === '') return
    const tags = el.value.trim().replace(/[# ]/g,'').split(',')
    let tagsSinRepetir = [... new Set(tags)]
    tagsSinRepetir = tagsSinRepetir.map(tag => {return '#'+tag.trim()})

    this.form.patchValue({
      hashtags:tagsSinRepetir.join(', '),
    })
  }


  formatAlias(e:KeyboardEvent):void{
    e.preventDefault()
    const el = e.target as HTMLInputElement
    this.form.patchValue({
      alias:el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:; ]+/g, '')
    })
  }

  showForm(){
    console.log(this.form.value)
  }
}