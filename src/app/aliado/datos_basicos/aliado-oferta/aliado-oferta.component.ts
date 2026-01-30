import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AliadoService, OfertaService, OfertaView, Recursos } from 'aliados';
import * as moment from 'moment';
// import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { LibEnvService } from 'personas';
import { Config, TablasApoyo } from 'personas/lib/dto/config';
import { config } from 'rxjs';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoAliadoOfertaComponent } from 'src/app/shared/borrame/catalogo-aliado-oferta/catalogo-aliado-oferta.component';
import { CatalogoAliadoComponent } from 'src/app/shared/borrame/catalogo-aliado/catalogo-aliado.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-aliado-oferta',
  templateUrl: './aliado-oferta.component.html',
  styleUrls: ['./aliado-oferta.component.css']
})
export class AliadoOfertaComponent extends CrudImpl implements OnInit {
  tablasApoyo:TablasApoyo

  defaults: object

  visible:boolean

  sliderEnabled:boolean

  private serviceAliado:AliadoService

  nroaliado:number

  modo:number

  recursosDefault: string[]

  // TOOLBAR DE NGX QUILL
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
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvServ: LibEnvService,
    private service:OfertaService,
    protected injector: Injector,
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
        vigente_desde: new FormControl('',Validators.required),
        vigente_hasta: new FormControl(''),
        tipo_oferta1: new FormControl(''),
        tipo_oferta2: new FormControl(''),
        titulo_corto: new FormControl('',Validators.required),
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
        recursos: new FormArray([])
      })
  }

  get recursos() {
    return this.form.controls["recursos"] as FormArray
  }

  ngOnInit(): void {

      this.nroaliado=365

      const configJson:Config = this.libEnvServ.getConfig()
      this.cancelarAction()
      this.tablasApoyo = configJson.tablasApoyo
      this.recursosDefault = configJson.recursosDefault
      this.setDefaults()
      this.sliderEnabled=false
      this.serviceAliado = this.injector.get(AliadoService)
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

  override cancelarAction(): void {
    super.cancelarAction()
    this.form.reset()
    this.form.disable()
    this.recursos.clear()
    this.visible=false
  }

  override incluirAction(): void {
    this.modo=1
    super.incluirAction()
    this.form.reset()
    this.recursos.clear()
    this.form.patchValue(this.defaults)
    this.visible=true
    this.cargaAliado(this.nroaliado)
    this.addDefaultRecursos()
  }


  override modificarAction(): void {

    if(this.esEditable()){
      this.snack.msgSnackBar('Esta oferta no puede ser modificada, no debe estar activada, aprobada ni verificada','OK',3000,'warning')
      return
    }

    this.modo=1
    super.modificarAction()
    this.visible=true

    /**
     * AJUSTES QUE CAMBIAN A DEFAULT CUANDO SE VA A MODIFICAR
     */
    this.form.patchValue({
      activo: false,
      aprobado: false,
      verificado: false,
      vigente: false,
      estatustipocod1: "EO1",
      estatuscod1:"SET1",
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

  override consultar(): void {
    super.consultar()
    this.form.enable()
    this.form.reset()
    this.recursos.clear()
    this.dialog.open(CatalogoAliadoOfertaComponent,{data:this.dataDialogo("Búsqueda de Oferta",undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=>{
        if(result){
          this.setOferta(result)
          this.form.disable()
          this.visible=false
        }
      })
  super.consultar()
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
            } else {
              this.showSpinner=false
              console.log('hubo un error')
              this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
            }
          },error=>{
            console.log('HUBO UN ERROR')
            console.log(error)
            this.showSpinner=false
            this.snack.msgSnackBar('Error al guardar','OK',undefined,'error')
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

      // console.log(JSON.stringify(oferta))
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


  cargaAliado(nroAliado:number){
    this.showSpinner=true
    this.serviceAliado.getAliadoWrap('1',nroAliado).subscribe(result=>{
      if(result){
        const data = {
          categoriacod:result.categoriacod,
          nroaliado:result.nroaliado,
          descripcion3: result.aliado_presentacion,
          presentacion: result.aliado_descripcion1,
          aliado:{
            persona:{
              nombrecorto:result.persona.nombrecorto
            }
          }
        }
        this.form.patchValue(data)
      }
      this.showSpinner=false
    })
  }
  esEditable():boolean{
    const activo =  this.form.get('activo')?.value
    const aprobado = this.form.get('aprobado')?.value
    const verificado = this.form.get('verificado')?.value

    return !(!activo && !aprobado && !verificado)
  }

  esClonable():boolean{
    const aprobado = this.form.get('activo')?.value
    const verificado = this.form.get('verificado')?.value

    return (aprobado && verificado)
  }

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

  //  dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number){
  //   return {
  //     "nroaliado":this.nroaliado,
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
            descripcion3: result.aliado_presentacion,
            presentacion: result.aliado_descripcion1,
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
    if(event.currentIndex == 0 && this.modo==1){
      this.snack.msgSnackBar('No se puede cambiar la primera imagen','OK',3000,'warning')
    } else {
      moveItemInArray(this.form.get('recursos')?.value, event.previousIndex, event.currentIndex);
    }
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


  verOferta(){
    const url = 'https://club.knoios.com'
    const aliado = this.form.get('nroaliado')?.value
    const nrooferta = this.form.get('nrooferta')?.value
    const oferta:string = this.form.get('oferta')?.value.replaceAll(' ','-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['".$%&*!@#+=`]+/g, '');
    
    window.open(`${url}/detalle/${aliado}/${nrooferta}-0-${oferta}`,"_blank")
  }

  clonarOferta(){
    if(!this.esClonable()){
      this.snack.msgSnackBar('Esta oferta no puede ser clonada, debe estar aprobada y verificada','OK',3000,'warning')
      return
    }

    super.modificarAction()
    this.visible=true

    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Oferta Clonada",`La oferta #${this.form.value.nrooferta} de ${this.form.value.aliado.persona.nombrecorto} ha sido clonada, realice las modificaciones necesarias y haga click en Aceptar para guardar`,"OK")}
    )
    this.form.patchValue({
      nrooferta:null,
      activo: false,
      aprobado: false,
      verificado: false,
      vigente: false,
      estatustipocod1: "EO1",
      estatuscod1:"SET1",
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

  // paste(event:any){     
  //   event.preventDefault();

  //   const cuerpo = event.clipboardData.getData("text/plain").replace(/\r?\n/g, "<br>");

  //   document.execCommand("insertHTML", false, cuerpo);
  // }


}//CIERRE DE CLASE
