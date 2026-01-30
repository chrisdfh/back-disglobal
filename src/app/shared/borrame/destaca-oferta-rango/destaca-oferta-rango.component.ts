import { Component, OnInit } from '@angular/core';
import { AliadoService, DestacaOfertaRequest, OfertaView } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-destaca-oferta-rango',
  templateUrl: './destaca-oferta-rango.component.html',
  styleUrls: ['./destaca-oferta-rango.component.css']
})
export class DestacaOfertaRangoComponent  extends CatalogoComponent<OfertaView> implements OnInit{


  nivelDestacados:string[] = []
  startDate:string
  endDate:string
  arrayFechas:string[]=[]
  dateError = false
  service:AliadoService
  destacaOfertaRequest:DestacaOfertaRequest = new DestacaOfertaRequest()

  override ngOnInit(): void {
      super.ngOnInit()
      this.nivelDestacados = this.libEnvService.getConfig().nivelesDestacamiento
      this.service = this.injector.get(AliadoService)
      this.form = this.builder.group({
        categoriacod:new FormControl(this.data.categoriacod,Validators.required),
        estatuscod:new FormControl('',Validators.required)
      })
      this.dateError=true
  }

  destacaOferta():void{

    if (this.form.status==='VALID'){
      this.destacaOfertaRequest = {
        ciaopr:this.ciaopr,
      categoriacod:this.form.get('categoriacod')?.value,
      estatuscod:this.form.get('estatuscod')?.value,
      estatustipocod:this.libEnvService.getConfig().estatusTipoCod,
      fechas:this.arrayFechas,
      nroaliado:this.data.nroaliado,
      nrooferta:this.data.nrooferta,
    }

    this.showSpinner=true
    this.service.destacaOfertaGrilla(this.ciaopr,this.destacaOfertaRequest).subscribe(
      result=>{
        this.showSpinner=false
        this.snack.msgSnackBar(result.mensaje,'OK',3000,'success')
        console.log(result)
      },error=>{
        this.showSpinner=false
        this.snack.msgSnackBar(error.error.error,'OK',3000,'error')
        console.log(error)
      }
      )
    } else {
      this.form.markAllAsTouched()
    }
  }

  log(msg:string,e: MatDatepickerInputEvent<Date>){

    if (msg=='start'){
      this.startDate = moment(e.value).format('YYYY/MM/DD')
    }
    if(msg=='end'){
      this.endDate=moment(e.value).format('YYYY/MM/DD')
    }

    const diferencia = (parseInt(moment(this.endDate).format('X')) - parseInt(moment(this.startDate).format('X')))
    const dias = diferencia/86400
    if ( diferencia > 0){
      this.arrayFechas=[]
      let tempDate = this.startDate
      this.arrayFechas.push(tempDate)

      for (let index = 0; index < dias; index++) {
        tempDate = moment(tempDate).add(1,'day').format('YYYY/MM/DD')
        this.arrayFechas.push(tempDate)
      }
    } else if (diferencia == 0){
      this.arrayFechas = []
      this.arrayFechas.push(this.startDate)
    }

    this.dateError=false
    if(dias >= 7){
      this.dateError = true
    } 


  }


  /**
   * ciaopr,
   * nroaliado,
   * nrooferta,
   * estatustipocod,
   * estatuscod,
   * fechas (este es un arreglo de strings que contiene las fechas en las que se quiere destacar una oferta.. formato YYYY/mm/dd),
   * cantidad_max, 
   * categoriacod.
   */
}
