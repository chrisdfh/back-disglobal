import { Component, OnInit } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { AliadoService, DestacaOfertaRequest, OfertaCalDestacadas, OfertaCalDestacadasRequest, OfertaView, OfertasDestacadasRequest } from 'aliados';
import * as moment from 'moment'
import { CatalogoOfertaRangofechaComponent } from '../catalogo-oferta-rangofecha/catalogo-oferta-rangofecha.component';

@Component({
  selector: 'app-edita-gilla',
  templateUrl: './edita-gilla.component.html',
  styleUrls: ['./edita-gilla.component.css']
})
export class EditaGillaComponent  extends CatalogoComponent<OfertaCalDestacadas> implements OnInit{

  private service:AliadoService

  request:OfertasDestacadasRequest = new OfertasDestacadasRequest()

  consultaGrillaRequest:OfertaCalDestacadasRequest = new OfertaCalDestacadasRequest()

  datosGrilla:OfertaCalDestacadas = new OfertaCalDestacadas()

  ofertasGrilla:OfertaView[] = []

  ofertaADestacar:any

  dataOfertaDestacar:DestacaOfertaRequest = new DestacaOfertaRequest()

  override ngOnInit(): void {
      super.ngOnInit()
      this.service = this.injector.get(AliadoService)
      this.consulta()

  }

  consulta(){

    this.request = {
      ciaopr: this.ciaopr,
      categoriacod: this.data.categoriacod,
      estatuscod: this.data.estatuscod,
      estatustipocod: this.data.estatustipocod,
      fechas: [this.data.fecha]
    }

    this.consultaGrillaRequest = {
      ciaopr:this.ciaopr,
      categoriacod:this.data.categoriacod,
      estatuscod:this.data.estatuscod,
      estatustipocod:this.data.estatustipocod,
      fecha_desde:this.data.fecha,
      fecha_hasta:this.data.fecha
    }


    this.service.consultaDestacadas(this.ciaopr,this.request).subscribe(
      result=>{
        const grillaOferta:any = result
        this.ofertasGrilla = grillaOferta
      }, error=>{
        console.log(error)
        this.ofertasGrilla = []
      }
    )

    // console.log(this.consultaGrillaRequest)
    // console.log(JSON.stringify(this.consultaGrillaRequest))
    this.service.consultaGrilla(this.ciaopr,this.consultaGrillaRequest).subscribe(
      result=>{
        // console.log(result)
        this.datosGrilla = result[0]
      }, error=>{
        console.log(error)
      }
    )
  }

  corrigeFecha(fecha:string):string{
    return moment(fecha).format('DD/MM/YYYY')
  }

  desDestacarOferta(event:OfertaView):void{

    this.dataOfertaDestacar = {
      ciaopr: this.ciaopr,
      nroaliado: event.nroaliado,
      nrooferta: event.nrooferta,
      estatustipocod: this.datosGrilla.estatustipocod,
      estatuscod: this.datosGrilla.estatuscod,
      fechas: [this.datosGrilla.fecha],
      categoriacod: this.datosGrilla.categoriacod
    }

    this.showSpinner=true
    this.service.desDestacarOferta(this.ciaopr,this.dataOfertaDestacar).subscribe(
      result=>{
        this.snack.msgSnackBar(result.mensaje,'OK',3000,'success')
        this.consulta()
        this.showSpinner=false
      }, error=>{
        this.snack.msgSnackBar(error.error.error||error.statusText,'OK',3000,'error')
        this.showSpinner=false
        console.log(error)
      }
    )
  }

  cargaOferta():void{
    this.showSpinner=true
    this.dialog.open(CatalogoOfertaRangofechaComponent,{data:this.dataDialogo("Búsqueda de Oferta",undefined,undefined,undefined,25,this.data.fecha)}).afterClosed().subscribe(
      result=>{
        if(result){
          this.ofertaADestacar = result
          this.showSpinner=false
          console.log(result)
        } else {
          this.showSpinner=false
          this.ofertaADestacar = undefined
        }
      },error=>{
        this.snack.msgSnackBar(error.error.error||error.statusText,'OK',3000,'error')
        this.showSpinner=false
        console.log(error)
      }
    )
  }


  dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,fecha?:string){
    return {
      "titulo":titulo,
      "msg":mensaje || '',
      "btn_true_text":textoBotonTrue || 'Aceptar',
      "btn_false_text":textoBotonFalse || 'Cancelar',
      "cant_registros": cantRegistros || 25,
      "fecha":fecha || moment().format('YYYY/MM/DD')
    }
  }

  destacarOferta():void{
    this.dataOfertaDestacar = {
      ciaopr: this.ciaopr,
      nroaliado: this.ofertaADestacar.nroaliado,
      nrooferta: this.ofertaADestacar.nrooferta,
      estatustipocod: this.datosGrilla.estatustipocod,
      estatuscod: this.datosGrilla.estatuscod,
      fechas: [this.datosGrilla.fecha],
      categoriacod: this.datosGrilla.categoriacod,
      cantidad_max:this.datosGrilla.cantidad_max
    }

    console.log(JSON.stringify(this.dataOfertaDestacar))

    this.showSpinner=true
    this.service.destacaOfertaGrilla(this.ciaopr,this.dataOfertaDestacar).subscribe(
      result=>{
        this.snack.msgSnackBar(result.mensaje,"OK",3000,'success')
        this.showSpinner=false
        this.ofertaADestacar = undefined
        this.consulta()
      },error=>{
        console.log(error)
        this.snack.msgSnackBar(error.error.error||error.statusText,'OK',3000,'error')
        this.showSpinner=false
      }
    )

  }

}
