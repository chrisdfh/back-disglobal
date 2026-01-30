import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AliadoService, CategoriaTasker, ServiciosView, TaskerView, recursosServiciosTasker } from 'aliados';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoServicioTaskerComponent } from 'src/app/shared/borrame/catalogo-servicio-tasker/catalogo-servicio-tasker.component';
import { CrudImpl } from 'vcore';
import * as moment from 'moment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CatalogoCategoriaTaskerComponent } from 'src/app/shared/borrame/catalogo-categoria-tasker/catalogo-categoria-tasker.component';
import { CatalogoTaskerComponent } from 'src/app/shared/borrame/catalogo-tasker/catalogo-tasker.component';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent extends CrudImpl implements OnInit {

  defaults:object

  tablasApoyo:TablasApoyo

  visible:boolean

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
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: AliadoService,
    public dialog: MatDialog){
    super()
    this.form = this.formBuilder.group({
        ciaopr: new FormControl(''),
        nrotasker: new FormControl('',Validators.required),
        nroservicio: new FormControl(''),
        categoriacod: new FormControl(''),
        categorianombre: new FormControl(''),
        presentacion: new FormControl(''),
        descripcion1: new FormControl(''),
        descripcion2: new FormControl(''),
        descripcion3: new FormControl(''),
        servicio: new FormControl('',Validators.required),
        estatustipocod1: new FormControl(''),
        estatuscod1: new FormControl(''),
        estatustipocod2: new FormControl(''),
        estatuscod2: new FormControl(''),
        estatustipocod3: new FormControl(''),
        estatuscod3: new FormControl(''),
        estatustipocod4: new FormControl(''),
        estatuscod4: new FormControl(''),
        tipo_servicio1: new FormControl(''),
        tipo_servicio2: new FormControl(''),
        tipo_servicio3: new FormControl(''),
        vigente_desde: new FormControl('',Validators.required),
        vigente_hasta: new FormControl('',Validators.required),
        titulo_corto: new FormControl('',Validators.required),
        activo: new FormControl(''),
        vigente: new FormControl(''),
        verificado: new FormControl(''),
        aprobado: new FormControl(''),
        url_servicio: new FormControl(''),

        recursos: new FormArray([])
    })
  }


  ngOnInit(): void {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.setDefaults()
  }

  setDefaults(): void{
    this.defaults={
      estatustipocod1:  "ETT1",
      estatuscod1:  "SETT1",
      estatustipocod2:  "ETT2",
      estatuscod2:  "SETT2",
      estatustipocod3:  "ETT3",
      estatuscod3:  "SETT3",
      estatustipocod4:  "ETT4",
      estatuscod4:  "SETT4"
    }
  }




  // ACCIONES DE LOS BOTONES
  override incluirAction(): void {
    super.incluirAction()
    this.form.reset()
    this.form.patchValue(this.defaults)
    this.visible=true
    this.recursos.clear()

    this.dialog.open(CatalogoTaskerComponent,{data:this.dataDialogo("Búsqueda de Tasker",undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result:TaskerView)=>{
        if(result) {
          this.form.patchValue({
            nrotasker:result.nrotasker,
            categoriacod:result.categoriacod,
            categorianombre:result.categorianombre,
            descripcion1:result.descripcion1,
            descripcion3:result.descripcion3,
            presentacion:result.presentacion,
            vigente_desde: moment(result.fchafiliacion).format("YYYY-MM-DD"),
            vigente_hasta: moment(result.fchafiliacion).add(40,'years').format("YYYY-MM-DD")
          })
        }
      })
  }
  override cancelarAction(): void {
    super.cancelarAction()
    this.form.reset()
    this.form.disable()
    this.visible=false
    this.recursos.clear()
  }
  override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }

  override consultar(): void {
      
    super.consultar()
    this.form.enable()
    this.form.reset()
    this.recursos.clear()
    this.dialog.open(CatalogoServicioTaskerComponent,{data:this.dataDialogo("Búsqueda de Servicio",undefined,undefined,undefined,25)})
      .afterClosed().subscribe((result)=>{
        if(result){
          this.setServicio(result)
          this.form.disable()
          this.visible=false
        }
      })
    super.consultar()
  }
  // FIN ACCIONES DE BOTONES


  override incluir(): void {
    
    if (this.form.status == 'VALID'){
      super.incluir()
      this.showSpinner=true
      const servicio:ServiciosView = this.form.getRawValue()
    
      servicio.activo=this.form.value.activo==true?'S':'N'
      servicio.aprobado=this.form.value.aprobado==true?'S':'N'
      servicio.vigente=this.form.value.vigente==true?'S':'N'
      servicio.verificado=this.form.value.verificado==true?'S':'N' 

      servicio.vigente_desde = moment(this.form.get('vigente_desde')?.value).format('YYYY/MM/DD')
      servicio.vigente_hasta = moment(this.form.get('vigente_hasta')?.value).format('YYYY/MM/DD')

      this.service.creaServicio(this.libEnvService.getConfig().ciaopr.ciaopr,servicio).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Servicio creado exitósamente','OK',undefined,'success')
            this.setServicio(result)
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
      super.incluir()
      this.showSpinner=true
      const servicio:ServiciosView = this.form.getRawValue()
    
      servicio.activo=this.form.value.activo==true?'S':'N'
      servicio.aprobado=this.form.value.aprobado==true?'S':'N'
      servicio.vigente=this.form.value.vigente==true?'S':'N'
      servicio.verificado=this.form.value.verificado==true?'S':'N' 

      servicio.vigente_desde = moment(this.form.get('vigente_desde')?.value).format('YYYY/MM/DD')
      servicio.vigente_hasta = moment(this.form.get('vigente_hasta')?.value).format('YYYY/MM/DD')

      this.service.modificaServicio(this.libEnvService.getConfig().ciaopr.ciaopr,servicio).subscribe(
        result=>{
          if(result){
            this.form.reset()
            this.snack.msgSnackBar('Servicio modificado exitósamente','OK',undefined,'success')
            this.setServicio(result)
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
          this.snack.msgSnackBar(`Error al modificar (${error.statusText})`,'OK',undefined,'error')
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  get recursos():FormArray{
    return this.form.controls['recursos'] as FormArray
  }

  addRecursos(img: recursosServiciosTasker  | undefined | null): void {
    if (img) {
      this.recursos.push(new FormGroup({
        url: new FormControl(img?.url,Validators.required),
        texto_imagen: new FormControl(img?.texto_imagen),
        tipo_recurso: new FormControl(img?.tipo_recurso)
      }))
    } else {
      this.recursos.push(new FormGroup({
        url: new FormControl('',Validators.required),
        texto_imagen: new FormControl(''),
        tipo_recurso: new FormControl('IMG')
      }))
    }
  }
  deleteRecursos(i: number): void {
    this.recursos.removeAt(i)
  }

  // HANDLER DEL DRAG AND DROP
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form.get('recursos')?.value, event.previousIndex, event.currentIndex);
    this.form.patchValue({recursos:this.form.get('recursos')?.value})
  }
  // dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,opciones?:string){
  //   return {
  //     "titulo":titulo,
  //     "msg":mensaje || '',
  //     "btn_true_text":textoBotonTrue || 'Aceptar',
  //     "btn_false_text":textoBotonFalse || 'Cancelar',
  //     "cant_registros": cantRegistros || 25,
  //     "query":opciones || undefined,
  //   }
  // }

  catalogoCatTasker():void{
    this.dialog.open(CatalogoCategoriaTaskerComponent,
      {data: this.dataDialogo('Búsqueda de Categorías de Taskers',undefined,undefined,undefined,undefined,undefined)})
      .afterClosed().subscribe((result:CategoriaTasker)=>{
        if(result){
            this.form.patchValue({
              categoriacod:result.categoriacod,
              categorianombre:result.categorianombre

          })
        }
      }
    )
  }

  // paste(event:any){     
  //   event.preventDefault();

  //   const cuerpo = event.clipboardData.getData("text/plain").replace(/\r?\n/g, "<br>");

  //   document.execCommand("insertHTML", false, cuerpo);
  // }

  verServicio(){
    if(this.form.get('url_servicio')?.value ==null &&this.form.get('url_servicio')?.value==''){
      return
    }
    window.open(this.form.get('url_servicio')?.value,"_blank")
  }

  setServicio(servicio:ServiciosView):void{

    this.form.reset()
    this.recursos.clear()
    
    if (typeof servicio.vigente_desde != undefined ){
      servicio.vigente_desde = moment(servicio.vigente_desde).format('YYYY-MM-DD')
    }
    if (typeof servicio.vigente_hasta != undefined){
      servicio.vigente_hasta = moment(servicio.vigente_hasta).format('YYYY-MM-DD')
    }



    this.form.patchValue(servicio)

    this.form.patchValue({
      activo: servicio.activo=='N'? false :true,
      aprobado: servicio.aprobado=='N'? false :true,
      verificado: servicio.verificado=='N'? false :true,
      vigente: servicio.vigente=='N'? false :true,
    })

    if (servicio.recursos != undefined && servicio.recursos.length > 0){
      servicio.recursos.forEach(recurso=>{
        this.addRecursos(recurso)
      })
    }
  }

  clonarServicio(){
    this.modificarAction()
    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Servicio Clonado",`Este servicio ha sido clonado, realice las modificaciones necesarias y haga click en Aceptar para guardar`,"OK")}
    )
    this.form.patchValue({
      nroservicio:null,
      url_servicio:null,
      titulo_corto:null
    })
  }
}
