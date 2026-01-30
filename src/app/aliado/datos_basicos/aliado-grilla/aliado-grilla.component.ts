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

@Component({
  selector: 'app-aliado-grilla',
  templateUrl: './aliado-grilla.component.html',
  styleUrls: ['./aliado-grilla.component.css']
})
export class AliadoGrillaComponent extends CrudImpl implements OnInit{

  tablasApoyo:TablasApoyo

  consulta:OfertaCalDestacadasRequest

  // dataGrilla:OfertaCalDestacadas[]=Array(new OfertaCalDestacadas())

  columnasVisibles: string[] = ['categoria','fecha1','fecha2','fecha3','fecha4','fecha5','fecha6','fecha7']

  nivelDestacados:string[] = []

  tablaVisible:boolean

  diasConsulta:string[]=[]

  tableData:OfertaCalDestacadas[]=Array(new OfertaCalDestacadas())


  // cambiar dto de OfertaCalDestacadasRequest a que tenga campos opcionales
  tempVar:OfertaCalDestacadasRequest

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
    })
  }


  ngOnInit(): void {
    this.tablaVisible=false
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.nivelDestacados = this.libEnvService.getConfig().nivelesDestacamiento
    this.form.patchValue({
      fecha_desde:moment()
    })
    this.getGrilla()
  }

  restaurar():void{
    this.form.patchValue({
      categoriacod:'',
      estatuscod:''
    })
    this.ngOnInit()
  }

  getGrilla():void{
    if (this.form.status ==='VALID'){
      this.tempVar = this.form.value
      this.tempVar.fecha_desde = moment(this.form.get('fecha_desde')?.value).format('YYYY/MM/DD')
      const fechaInicial = moment(this.form.get('fecha_desde')?.value).format('DD/MM/YYYY')
      const fechaFinal = moment(this.form.get('fecha_desde')?.value).add(6,'days').format('DD/MM/YYYY')
      this.tempVar.fecha_hasta =moment(this.form.get('fecha_desde')?.value).add(6,'days').format('YYYY/MM/DD')

      // this.tempVar.fecha_hasta = moment(this.form.get('fecha_hasta')?.value).format('YYYY/MM/DD')
      if(this.form.get('categoriacod')?.value.trim()==''){
        delete this.tempVar.categoriacod
      }
      if(this.form.get('estatuscod')?.value.trim()==''){
        delete this.tempVar.estatuscod
      }

      this.tempVar.estatustipocod = "EO1"
      this.tempVar.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      
      this.showSpinner=true
      this.service.consultaGrilla('1',this.tempVar).subscribe(
        result=>{
          if (result) {
            this.tablaVisible=true
            // this.dataGrilla = this.preparaGrilla(result,'categoriacod','estatuscod')
            this.tableData = Object.values(this.preparaGrilla(result,'categoriacod','estatuscod'))
            this.showSpinner=false
          }
          else {
            this.snack.msgSnackBar(`Error consultando grilla`,'OK',5000,'warning')
            this.showSpinner=false
            this.tablaVisible=false
          }
        },error=>{
          console.log('HUBO UN ERROR',error)
          this.snack.msgSnackBar(`Error consultando grilla entre fechas ${fechaInicial} - ${fechaFinal}`,'OK',5000,'warning')
          // this.dataGrilla=[]
          this.tableData=[]
          this.showSpinner=false
          this.tablaVisible=false
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }


  groupBy(array:any[],key:any){
    return array.reduce((result:any[],currentValue:any[])=>{
      if(!result[currentValue[key]]){
        result[currentValue[key]]=[]
      }
      result[currentValue[key]].push(currentValue)
      return result
    },{})
  }


  preparaGrilla(array:any[],key:any,key2:any):OfertaCalDestacadas[]{

    this.diasConsulta=[]
    for (let index = 0; index < 7; index++) {
      this.diasConsulta.push(moment(this.form.get('fecha_desde')?.value).add(index,'day').format('ddd DD/MM'))
    }

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

  corrigeFecha(fecha:string):string{
    return moment(fecha).format('DD/MM/YYYY')
  }

  showForm():void{
    this.consulta = this.form.value
    this.consulta.fecha_desde = moment(this.form.get('fecha_desde')?.value).format('YYYY/MM/DD')
    this.consulta.fecha_hasta = moment(this.form.get('fecha_desde')?.value).add(6,'day').format('YYYY/MM/DD')
    console.log(this.consulta)
  }

  creaGrilla():void{
    this.dialog.open(VentanaCrearGrillaComponent,{maxWidth: '450px', width: '95%', maxHeight: '200px', height: '90%'})
    .afterClosed().subscribe(
      result=>{
        if (this.form.status==='VALID'){
          this.getGrilla()
        }
    },error=>{
      console.log(error)
    })
  }

  editaGrilla(event:OfertaCalDestacadas):void{
    this.dialog.open(EditaGillaComponent,{data:event})
    .afterClosed().subscribe(
      result=>{
        if (this.form.status==='VALID'){
          this.getGrilla()
        }
    },error=>{
      console.log(error)
    })
  }

  setClass(e:OfertaCalDestacadas):string{
    if (e!=undefined){
      const fixedClass=" cp bg-gradient"
      if(e.cantidad==e.cantidad_max)return 'color-red'+fixedClass
      if(e.cantidad_disp==e.cantidad_max)return 'color-green'+fixedClass
      return 'color-yellow'+fixedClass
    }
    return ''
  }

  show(e:any){
    console.log(e)
  }

}