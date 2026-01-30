import { Component } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl, Validators } from '@angular/forms';
import { AliadoService, CreaGrillaRequest } from 'aliados';
import * as moment from 'moment';

@Component({
  selector: 'app-ventana-crear-grilla',
  templateUrl: './ventana-crear-grilla.component.html',
  styleUrls: ['./ventana-crear-grilla.component.css']
})
export class VentanaCrearGrillaComponent extends CatalogoComponent<string>{

  private service:AliadoService
  datosGrilla: CreaGrillaRequest

  override ngOnInit(): void {
      super.ngOnInit()
      this.service = this.injector.get(AliadoService)
      this.form = this.builder.group({
        ciaopr:new FormControl(this.ciaopr),
        fecha_desde:new FormControl('',Validators.required),
        fecha_hasta:new FormControl('',Validators.required),
      })
  }
  showForm(){
    console.log(this.form.value)
    console.log(this.form.getRawValue)
  }

  creaGrilla():void{

    if(this.form.status != "VALID"){
      this.form.markAllAsTouched()
      return
    }

    this.datosGrilla = this.form.value
    this.datosGrilla.fecha_desde = moment(this.form.get('fecha_desde')?.value).format('YYYY/MM/DD')
    this.datosGrilla.fecha_hasta = moment(this.form.get('fecha_hasta')?.value).format('YYYY/MM/DD')
    // this.datosGrilla.estatustipocod=this.libEnvService.getConfig().estatusTipoCod
    // this.datosGrilla.estatuscod = this.libEnvService.getConfig().nivelesDestacamiento

    console.log(this.datosGrilla)

    console.log('Json stringificado=>')
    console.log(JSON.stringify(this.datosGrilla))

    this.showSpinner=true
    this.service.creaGrilla(this.ciaopr,this.datosGrilla).subscribe(
      result=>{
        console.log(result)
        alert('Registros creados exitosamente')
        this.showSpinner=false
      },error=>{
        console.log(error)
        alert(error.error)
        this.showSpinner=false
      }
    )
  }

}
