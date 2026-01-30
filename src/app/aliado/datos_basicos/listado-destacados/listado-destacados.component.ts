import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AliadoService, OfertaCalDestacadas, OfertaCalDestacadasRequest } from 'aliados';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CrudImpl } from 'vcore';
import * as moment from 'moment';
import { VentanaCrearGrillaComponent } from 'src/app/shared/borrame/ventana-crear-grilla/ventana-crear-grilla.component';
import { EditaGillaComponent } from 'src/app/shared/borrame/edita-gilla/edita-gilla.component';
import { DatoTablaApoyo } from 'personas/lib/dto/dato-tabla-apoyo';

@Component({
  selector: 'app-listado-destacados',
  templateUrl: './listado-destacados.component.html',
  styleUrls: ['./listado-destacados.component.css']
})
export class ListadoDestacadosComponent  extends CrudImpl implements OnInit{

  tablasApoyo:TablasApoyo

  consulta:OfertaCalDestacadasRequest

  dataGrilla:OfertaCalDestacadas[] = []

  columnasVisibles: string[] = ['fecha','categoria','des1','des2']

  tablaVisible:boolean

  nivelDestacados:string[] = []

  diasConsulta:any[] =[]

  // cambiar dto de OfertaCalDestacadasRequest a que tenga campos opcionales
  tempVar:any

  constructor(
    private libEnvService: LibEnvService,
    public dialog: MatDialog,
    private snack:SnackbarService,
    private formBuilder:FormBuilder,
    private service: AliadoService,
  ){
    super()
    this.form = this.formBuilder.group({
      categoriacod:new FormControl(''),
      estatuscod:new FormControl(''),
      fecha_desde: new FormControl<Date | null>(null,Validators.required),
      fecha_hasta: new FormControl<Date | null>(null,Validators.required),
    })
  }


  ngOnInit(): void {
    this.tablaVisible=false
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.nivelDestacados = this.libEnvService.getConfig().nivelesDestacamiento
  }

  getGrilla():void{

    if(this.form.status != "VALID"){
      this.form.markAllAsTouched()
      return
    }
    
    this.tempVar = this.form.value
    this.tempVar.fecha_desde = moment(this.form.get('fecha_desde')?.value).format('YYYY/MM/DD')
    this.tempVar.fecha_hasta = moment(this.form.get('fecha_hasta')?.value).format('YYYY/MM/DD')
    if(this.form.get('categoriacod')?.value.trim()==''){
      this.tempVar.categoriacod=null
    }
    if(this.form.get('estatuscod')?.value.trim()==''){
      this.tempVar.estatuscod=null
    }

    this.tempVar.estatustipocod = "EO1"
    this.tempVar.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    
    this.showSpinner=true
    this.service.consultaGrilla('1',this.tempVar).subscribe(
      result=>{
        if (result) {
          const fff = Object.values(this.preparaGrilla(result,'fecha','categoriacod'))
          this.dataGrilla = fff
          this.tablaVisible=true
          this.showSpinner=false
        } else {
          console.log('hubo un error')
          this.showSpinner=false
          this.tablaVisible=false
        }
      }
      ,error=>{
        this.snack.msgSnackBar(error.error.error,"OK",3000,'error')
        console.log('HUBO UN ERROR',error)
        this.dataGrilla=[]
        this.showSpinner=false
        this.tablaVisible=false
      }
    )
  }
  
  preparaGrilla(array:any[],key:any,key2:any):OfertaCalDestacadas[]{

    const parCatNivel:OfertaCalDestacadas[] = array.reduce((result:any[],currentValue:any[])=>{
      const keyArray:any=`${currentValue[key]}-${currentValue[key2]}`
      
      if(!result[keyArray]){
        result[keyArray]=[]
      }
      result[keyArray].push(currentValue)
      return result
    },{})

    return  Object.keys(parCatNivel).sort().reduce(function (result:any, key:any) {
      result[key] = parCatNivel[key];
      return result;
    }, {});

  }

  corrigeFecha(oferta:OfertaCalDestacadas):string{
    return moment(oferta.fecha).format('ddd DD/MM')
  }

  nombreCategoria(categoriacod:string):string{
    const categorias:DatoTablaApoyo[] = this.libEnvService.getConfig().tablasApoyo.categoria

    let catNombre=''

    categorias.forEach((cat,i)=>{
      if (categorias[i].cod==categoriacod){
        catNombre = categorias[i].nombre
      }
    })
   
    return catNombre
  }

  getOfertaDestacada(oferta:OfertaCalDestacadas[],destacado:string):OfertaCalDestacadas{
    if (oferta[0].estatuscod == destacado){
      return oferta[0]
    }
    return oferta[1]
  }


  setClass(e:OfertaCalDestacadas):string{
    if (e!=undefined){
      const fixedClass="cp bg-gradient"
      if(e.cantidad==e.cantidad_max)return 'color-red '+fixedClass
      if(e.cantidad_disp==e.cantidad_max)return 'color-green '+fixedClass
      return 'color-yellow '+fixedClass
    }
    return ''
  }
  
  getOfertaData(oferta:OfertaCalDestacadas[],nivel:string,campo:string):string{
    const nivelKey = oferta[0].estatuscod == nivel ? 0:1
    return Object.entries(oferta[nivelKey]).find(i=>i[0]==campo)?.[1]
  }

  restaurar():void{
    this.form.patchValue({
      categoriacod:'',
      estatuscod:'',
      fecha_desde:null,
      fecha_hasta:null
    })
    this.ngOnInit()
  }

  showForm():void{
    this.consulta = this.form.value
    this.consulta.fecha_desde = moment(this.form.get('fecha_desde')?.value).format('YYYY/MM/DD')
    this.consulta.fecha_hasta = moment(this.form.get('fecha_hasta')?.value).format('YYYY/MM/DD')
  }

  creaGrilla():void{
    this.dialog.open(VentanaCrearGrillaComponent,{maxWidth: '450px', width: '95%', maxHeight: '200px', height: '90%'})
    .afterClosed().subscribe(()=>{
      if(this.dataGrilla.length != 0) this.getGrilla()
    })
  }

  editaGrilla(event:OfertaCalDestacadas):void{
    this.dialog.open(EditaGillaComponent,{data:event})
    .afterClosed().subscribe(()=>{
        if(this.dataGrilla.length != 0) this.getGrilla()
    })
  }

}
