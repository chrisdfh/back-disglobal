import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LibEnvService } from 'personas';
import { Config, TablasApoyo } from 'personas/lib/dto/config';
import { CrudImpl } from 'vcore';
import { CatalogoOfertaComponent } from 'src/app/shared/borrame/catalogo-oferta/catalogo-oferta.component';
import { AliadoWrap, HashTags, OfertaService, OfertaView, Recursos } from 'aliados';
import { CatalogoAliadoComponent } from 'src/app/shared/borrame/catalogo-aliado/catalogo-aliado.component';
import * as moment from 'moment';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { DestacaOfertaRangoComponent } from 'src/app/shared/borrame/destaca-oferta-rango/destaca-oferta-rango.component';
import { CatalogoHashtagsComponent } from 'src/app/shared/borrame/catalogo-hashtags/catalogo-hashtags.component';
import { ActivatedRoute } from '@angular/router';

// import { Editor, Toolbar, toHTML, } from 'ngx-editor';
// import { Schema } from "prosemirror-model";
// import { nodes, marks } from "ngx-editor/schema";

@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.css']
})
export class OfertaComponent extends CrudImpl implements OnInit  {
  
  tablasApoyo:TablasApoyo

  defaults: object

  visible:boolean

  recursosDefault: string[]

  @ViewChild('hashtags') hashtags: ElementRef
  @ViewChild('para_crear_tags') para_crear_tags: ElementRef

  // EDITORES NGX-EDITOR

  // presentacionEditor:Editor
  // desc1Editor:Editor
  // desc2Editor:Editor
  // desc3Editor:Editor

  // toolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline'],
  //   ['blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  //   ['format_clear']
  // ];

  @ViewChild('top') top:ElementRef

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
    public dialog:MatDialog,
    private router:ActivatedRoute,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvServ: LibEnvService,
    private service:OfertaService
    ){
      super()
      this.form = this.formBuilder.group({
        nroaliado:new FormControl('',Validators.required),
        aliado:new FormGroup({
          aliado_presentacion: new FormControl(''),
          aliado_descripcion1: new FormControl(''),
          persona:new FormGroup({
            nombrecorto:new FormControl('')
          })
        }),
        nrooferta: new FormControl(''),
        categoriacod:new FormControl('',Validators.required),
        presentacion: new FormControl('',Validators.required),
        monto_o_porc: new FormControl('',Validators.required),
        monto: new FormControl(''),
        titulo_corto: new FormControl('',Validators.required),
        url_oferta: new FormControl(''),
        vigente_desde: new FormControl('',Validators.required),
        vigente_hasta: new FormControl(''),
        tipo_oferta1: new FormControl(''),
        tipo_oferta2: new FormControl(''),
        tipo_oferta3: new FormControl(''),
        estatustipocod1: new FormControl(''),
        estatuscod1: new FormControl(''),
        estatustipocod2: new FormControl(''),
        estatuscod2: new FormControl(''),
        estatustipocod3: new FormControl(''),
        estatuscod3: new FormControl(''),
        estatustipocod4: new FormControl(''),
        estatuscod4: new FormControl(''),
        oferta: new FormControl('',Validators.required),
        descripcion1: new FormControl(''),
        descripcion2: new FormControl(''),
        descripcion3: new FormControl(''),
        activo: new FormControl(''),
        vigente: new FormControl(''),
        verificado: new FormControl(''),
        aprobado: new FormControl(''),
        aliado_localnro: new FormControl(''),

        para_crear_tags: new FormControl(''),
        hashtags: new FormControl(''),
        recursos: new FormArray([])
      })
  }
  ngOnInit(): void {
      this.cancelarAction()
      const configJson:Config = this.libEnvServ.getConfig()
      this.tablasApoyo =configJson.tablasApoyo
      this.recursosDefault = configJson.recursosDefault
      this.setDefaults()

      this.router.params.subscribe(params => {
        if (params['nroaliado'] && params['nrooferta']){
          this.form.reset()
          this.recursos.clear()
          this.service.getOfertaAliadoV(this.libEnvServ.getConfig().ciaopr.ciaopr,params['nroaliado'],params['nrooferta']).subscribe({
            next:(resp)=>{
              this.setOferta(resp)
              this.form.disable()
              this.visible=false
              this.crud.btnModificar.disabled=false
          },
          error:(err)=>{
            this.snack.msgSnackBar(err.error,'OK',undefined,'error')
            console.log(err)
          }
        })
        }
      })

      // this.presentacionEditor=new Editor()
      // this.desc1Editor=new Editor()
      // this.desc2Editor=new Editor()
      // this.desc3Editor=new Editor()

      // console.log(new DatePipe('en_US').transform('2021-01-01','YYYY-MM-dd'))
  }

  override cancelarAction(): void {
    super.cancelarAction()
    this.form.reset()
    this.form.disable()
    this.recursos.clear()
    this.visible=false
  }
  override incluirAction(): void {
    super.incluirAction()
    this.form.reset()
    this.recursos.clear()
    // this.addRecursos(undefined)
    this.form.patchValue(this.defaults)
    this.visible=true
    this.catalogoAliados()
    
    this.addDefaultRecursos()
  }
  override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }
  override incluir(): void {
    if (this.form.status == 'VALID'){
        super.incluir()
        this.showSpinner=true
        const oferta:OfertaView = this.form.getRawValue()
        oferta.ciaopr = this.libEnvServ.getConfig().ciaopr.ciaopr
        oferta.activo=this.form.value.activo==true?'S':'N'
        oferta.aprobado=this.form.value.aprobado==true?'S':'N'
        oferta.vigente=this.form.value.vigente==true?'S':'N'
        oferta.verificado=this.form.value.verificado==true?'S':'N'

        oferta.vigente_desde = moment(this.form.get('vigente_desde')?.value).format('YYYY/MM/DD')
        oferta.vigente_hasta = moment(this.form.get('vigente_hasta')?.value).format('YYYY/MM/DD')

        
      // VERIFICACIÓN DE QUE SEA UN OBJETO DE NGX-EDITOR PARA CONVERTIRSE EN TIPO HTML
        // if (this.form.get('presentacion')?.value != null && 
        //     Object.prototype.hasOwnProperty.call(this.form.value.presentacion,'type')){
        //   oferta.presentacion = toHTML(this.form.get('presentacion')?.value)
        // }
        // if (this.form.get('descripcion1')?.value != null && 
        //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion1,'type')){
        //   oferta.descripcion1 = toHTML(this.form.get('descripcion1')?.value)
        // }
        // if (this.form.get('descripcion2')?.value != null && 
        //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion2,'type')){
        //   oferta.descripcion2 = toHTML(this.form.get('descripcion2')?.value)
        // }
        // if (this.form.get('descripcion2')?.value != null && 
        //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion3,'type')){
        //   oferta.descripcion3 = toHTML(this.form.get('descripcion3')?.value)
        // }
        this.service.upsertOferta(oferta.ciaopr,oferta).subscribe(
          result=>{
            if(result){
              this.form.reset()
              this.snack.msgSnackBar('Oferta creada exitósamente','OK',undefined,'success')
              this.setOferta(result)
              this.showSpinner=false
              this.configBTNForms(false)
              this.form.disable()
              this.visible = false
              this.top.nativeElement.scrollIntoView({ block: 'start',  behavior: 'smooth' })
            } else {
              this.showSpinner=false
              console.log('hubo un error')
              this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
            }
          },error=>{
            console.log('HUBO UN ERROR')
            console.log(error)
            this.showSpinner=false
            this.snack.msgSnackBar(`Error al guardar (${error.statusText})`,'OK',undefined,'error')
          }
        )
      } else {
        this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
        this.form.markAllAsTouched()
      }

  }
  override modificar(): void {
    
    if (this.form.status == 'VALID'){
      super.modificar()
      this.showSpinner=true
      const oferta:OfertaView = this.form.getRawValue()
      oferta.ciaopr = this.libEnvServ.getConfig().ciaopr.ciaopr
      oferta.activo=this.form.value.activo==true?'S':'N'
      oferta.aprobado=this.form.value.aprobado==true?'S':'N'
      oferta.vigente=this.form.value.vigente==true?'S':'N'
      oferta.verificado=this.form.value.verificado==true?'S':'N'

      oferta.vigente_desde = moment(this.form.get('vigente_desde')?.value).format('YYYY/MM/DD')
      oferta.vigente_hasta = moment(this.form.get('vigente_hasta')?.value).format('YYYY/MM/DD')


      // VERIFICACIÓN DE QUE SEA UN OBJETO DE NGX-EDITOR PARA CONVERTIRSE EN TIPO HTML
      // if (this.form.get('presentacion')?.value != null && 
      //     Object.prototype.hasOwnProperty.call(this.form.value.presentacion,'type')){
      //   oferta.presentacion = toHTML(this.form.get('presentacion')?.value)
      // }
      // if (this.form.get('descripcion1')?.value != null && 
      //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion1,'type')){
      //     oferta.descripcion1 = toHTML(this.form.get('descripcion1')?.value) //.replaceAll('&lt;','<').replaceAll('&gt;','>')
      // }
      // if (this.form.get('descripcion2')?.value != null && 
      //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion2,'type')){
      //   oferta.descripcion2 = toHTML(this.form.get('descripcion2')?.value)
      // }
      // if (this.form.get('descripcion2')?.value != null && 
      //     Object.prototype.hasOwnProperty.call(this.form.value.descripcion3,'type')){
      //   oferta.descripcion3 = toHTML(this.form.get('descripcion3')?.value)
      // }

      // console.log(JSON.stringify(oferta))
      // return;
      this.service.upsertOferta(oferta.ciaopr,oferta).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Modificado con éxito','OK',undefined,'success')
            this.setOferta(result)
            this.showSpinner=false
            this.form.disable()
            this.visible = false
            this.configBTNForms(false)
            this.top.nativeElement.scrollIntoView({ block: 'start',  behavior: 'smooth' })
          } else {
            this.showSpinner=false
            console.log('hubo un error')
            this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
          }
        },error=>{
          console.log('HUBO UN ERROR')
          console.log(error)
          this.showSpinner=false
          this.snack.msgSnackBar('Error al modificar','OK',undefined,'error')
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }
  override consultar(): void {
    super.consultar()
    this.form.reset()
    this.recursos.clear()
    this.dialog.open(CatalogoOfertaComponent,{data:this.dataDialogo("Búsqueda de Oferta",undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=>{
        if(result){
          this.setOferta(result)
          this.form.disable()
          this.visible=false
        }
      })
  super.consultar()
  }
  get recursos() {
    return this.form.controls["recursos"] as FormArray
  }
  setDefaults():void{
    this.defaults = {
      estatuscod1:"OND",
      estatustipocod1: "EO1",
      estatustipocod2: "EO2",
      estatuscod2: "SET2",
      estatustipocod3: "EO3",
      estatuscod3: "SET3",
      estatustipocod4: "EO4",
      estatuscod4: "SET4",
      monto_o_porc:"M",
      vigente_desde:"2021-01-01",
      vigente_hasta:"2024-12-31",
      monto:0.00,
      aliado_localnro:null
    }

  }
// OJO QUITAR DE SETOFERTAS EL ALIADO_LOCALNRO=NULL
  addDefaultRecursos():void{
    this.recursosDefault.forEach((rec,i)=>{
      const recImg:Recursos = new Recursos()

      recImg.ciaopr='1'
      recImg.url=rec
      recImg.texto_imagen=`Xity Club #${i+1}`
      recImg.estatustipocod1='ER1'
      recImg.estatuscod1='CRRP'
      recImg.activo='S'

      this.addRecursos(recImg)
    })
  }
  addRecursos(img: Recursos  | undefined | null): void {
    if (img) {
      this.recursos.push(new FormGroup({
        url: new FormControl(img?.url),
        texto_imagen: new FormControl(img?.texto_imagen),
        estatustipocod1:new FormControl('ER1'),
        estatuscod1:new FormControl('CRRP'),
        activo:new FormControl('S'),
      }))
    } else {
      this.recursos.push(new FormGroup({
        url: new FormControl(''),
        texto_imagen: new FormControl(''),
        estatustipocod1:new FormControl('ER1'),
        estatuscod1:new FormControl('CRRP'),
        activo:new FormControl('S'),
      }))
    }
  }
  deleteRecursos(i: number): void {
    this.recursos.removeAt(i)
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
  catalogoAliados():void {
    this.dialog.open(CatalogoAliadoComponent,{data: this.dataDialogo("Búsqueda de Aliado", undefined,undefined,undefined,25)})
      .afterClosed().subscribe(result=>{
        if(result){
          const data = {
            categoriacod:result.categoriacod,
            nroaliado:result.nroaliado,
            descripcion1: result.aliado_oferta1,
            descripcion3: result.aliado_presentacion,
            presentacion: result.aliado_descripcion1,
            hashtags: result.aliado_descripcion2,
            aliado:{
              persona:{
                nombrecorto:result.persona.nombrecorto
              }
            }
          }
          this.form.patchValue(data)
        }
      })
  }
  // HANDLER DEL DRAG AND DROP
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form.get('recursos')?.value, event.previousIndex, event.currentIndex);
    this.form.patchValue({recursos:this.form.get('recursos')?.value})
  }
  setOferta(oferta:OfertaView):void{

    this.form.reset()
    this.recursos.clear()

    if (typeof oferta.vigente_desde != undefined ){
      oferta.vigente_desde = moment(oferta.vigente_desde).format('YYYY-MM-DD')
      // DATEPIPE DA ERROR PARA LA FECHA 2021-01-01, LO CONVIERTE EN 2020-01-01
      // oferta.vigente_desde = new DatePipe('en_US').transform(oferta.vigente_desde,'YYYY-MM-dd') || ''
    }
    if (typeof oferta.vigente_hasta != undefined){
      oferta.vigente_hasta = moment(oferta.vigente_hasta).format('YYYY-MM-DD')
      // oferta.vigente_hasta = new DatePipe('en_US').transform(oferta.vigente_hasta,'YYYY-MM-dd') || ''
    }

    this.form.patchValue(oferta)
    if (oferta.recursos != undefined){
      oferta.recursos.forEach((img)=>{
        this.addRecursos(img)
      })
    }

    this.form.patchValue({
      activo: oferta.activo=='N'? false :true,
      aprobado: oferta.aprobado=='N'? false :true,
      verificado: oferta.verificado=='N'? false :true,
      vigente: oferta.vigente=='N'? false :true,
    })

    this.form.patchValue({
      estatustipocod1: "EO1",
      estatustipocod2: "EO2",
      estatuscod2: "SET2",
      estatustipocod3: "EO3",
      estatuscod3: "SET3",
      estatustipocod4: "EO4",
      estatuscod4: "SET4",
      aliado_localnro:null
      //QUITAR LOCALNRO EN LO QUE LO TENGAMOS CONFIGURADO
    })
  }

  preparaSlug(){


    if(
      this.form.get('titulo_corto')?.value == undefined 
    || this.form.get('titulo_corto')?.value ==null 
    || this.form.get('titulo_corto')?.value=='' 
    || this.form.get('nrooferta')?.value != null
    ){
      return
    }
    const specialChars = "!@#$^&%*()+=[]/{}|:<>?,.'\"~";

    const titulo_corto:string = this.form.get('titulo_corto')?.value.replaceAll(' ','-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@#+=`:,;]+/g, '');
    const nombreComercial:string = this.form.get('aliado')?.get('persona')?.get('nombrecorto')?.value.replaceAll(' ','-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@#+=`:,;]+/g, '');
    let urlOferta = `${nombreComercial}-${titulo_corto}`

    for (const caracter of specialChars) {
      urlOferta = urlOferta.replace(new RegExp('\\' + caracter, 'gi'), '');
    }

    this.form.patchValue({
      url_oferta: urlOferta.substring(0,100)
    })
  }

  verOferta(){
    if(this.form.get('url_oferta')?.value ==null &&this.form.get('url_oferta')?.value==''){
      return
    }
    // const url = 'https://www.xityclub.com'
    // const aliado = this.form.get('nroaliado')?.value
    // const nrooferta = this.form.get('nrooferta')?.value
    // const oferta:string = this.form.get('oferta')?.value.replaceAll(' ','-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@#+=`]+/g, '');
    
    window.open(this.form.get('url_oferta')?.value,"_blank")
  }

  clonarOferta(){
    this.modificarAction()
    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Oferta Clonada",`La oferta #${this.form.value.nrooferta} de ${this.form.value.aliado.persona.nombrecorto} ha sido clonada, realice las modificaciones necesarias y haga click en Aceptar para guardar`,"OK")}
    )
    this.form.patchValue({
      nrooferta:null,
      url_oferta:null,
    })
  }

  destacaOferta(){
    this.dialog.open(DestacaOfertaRangoComponent,{data:this.form.getRawValue()})
  }

// #region TAGS
  appendTags(e:FocusEvent):void{
    const el = e.target as HTMLTextAreaElement
    if(el.value.trim()==='') return

    const tagsConHash = [... new Set(el.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:;# ]+/g, '').split(','))].map(tag => {
      // if (tag.charAt(0) === '#') return tag.trim()
      return '#' + tag.trim().replace(/ /g, '')
    })
    const tagsConHashSinRepetir = [... new Set(tagsConHash)]

    let tags:string[] = []
    let tagsExistentes = this.form.get('hashtags')?.value
    if (tagsExistentes == '') tagsExistentes=null

    if (tagsExistentes !== null){
      const tagExistentesArray = tagsExistentes.split(', ')
      const joinTags:string[] = tagExistentesArray.concat(tagsConHashSinRepetir)
      tags = [... new Set(joinTags)]
    } else {
      tags = tagsConHashSinRepetir
    }
    this.form.patchValue({
      hashtags:tags.join(', '),
      para_crear_tags:''
    })
  }


  removeDuplicateTags(e:FocusEvent){
    e.target as HTMLTextAreaElement
    this.removeDuplicateTagsFromList()
  }

  removeDuplicateTagsFromList(){
    const el = this.hashtags.nativeElement as HTMLTextAreaElement
    if (el.value.trim() === '') return

    const tags = el.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@+=`:;# ]+/g, '').split(',')
    let tagsSinRepetir = [... new Set(tags)]
    console.log('==>')
    console.log(tagsSinRepetir)
    tagsSinRepetir = tagsSinRepetir.map(tag => {return '#'+tag.trim()})

    this.form.patchValue({
      hashtags:tagsSinRepetir.join(', '),
    })
    
  }
  
  getHashTagsDialog():void{

    if(this.form.get('nroaliado')?.value ==null
    || this.form.get('nrooferta')?.value ==null 
    || this.form.get('nroaliado')?.value=='' 
    || this.form.get('nrooferta')?.value==''
    ){return}

    this.dialog.open(CatalogoHashtagsComponent,{data:{ciaopr:this.libEnvServ.getConfig().ciaopr.ciaopr,nroaliado:this.form.get('nroaliado')?.value,nrooferta:this.form.get('nrooferta')?.value}})
    .afterClosed().subscribe(
      (result:string[])=>{
        if(!result) return
        this.form.patchValue({para_crear_tags:result.join(', ')})
        this.para_crear_tags.nativeElement.focus()
      }
    )
  }

  show(){
    console.log(this.form.getRawValue())
  }

}
