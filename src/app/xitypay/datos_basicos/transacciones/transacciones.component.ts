import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { personaXpayCuenta, Transaccion, TransaccionFiltro, XitypayService, XpayCuenta } from 'aliados';
import * as moment from 'moment';
import { LibEnvService, List } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoPersonasEnCuentaComponent } from 'src/app/shared/borrame/catalogo-personas-en-cuenta/catalogo-personas-en-cuenta.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { DetalleTransaccionComponent } from 'src/app/shared/detalle-transaccion/detalle-transaccion.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent extends CrudImpl implements OnInit{

  tablasApoyo:TablasApoyo
  aliadoNombre:string
  dataSource =  new List<Transaccion>()
  displayedColumns:string[] =['info','monto']
  @ViewChild('botonera') botonera:ElementRef


  ngOnInit(): void {
    this.cancelarAction()
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.showSpinner = false
    this.modificarAction()
  }


  constructor(
    private libEnvService: LibEnvService,
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    private service: XitypayService,
    public dialog: MatDialog) {
      super()
      this.form = this.formBuilder.group({
        nropersona: new FormControl(null),
        xpayctanro: new FormControl(null),
        fecha_desde: new FormControl(''),
        fecha_hasta: new FormControl(''),
        status:new FormControl(null),
        personaEnCuentaNombre: new FormControl('')
      })
    }


  catalogoXityPayCta(){
    this.dataSource = new List<Transaccion>()
    this.form.patchValue({
      xpayctanro:'',
      fecha_desde:null,
      fecha_hasta:null,
      status:null
    })
    this.aliadoNombre = ''
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe(
      (result:XpayCuenta)=>{
        this.form.patchValue({xpayctanro:result.xpayctanro?result.xpayctanro:''})
        this.aliadoNombre = result.nombrecorto?result.nombrecorto:''
        if (result.xpayctanro){
          const filtro:TransaccionFiltro = {xpayctanro:result.xpayctanro}
          this.buscarTransacciones(filtro,1,15)
        }
    })
  }

  buscarTransacciones(filtro:TransaccionFiltro,pagina:number,cantRegistros:number):void{
    if (!filtro.xpayctanro){return}
    if (filtro.fecha_desde){filtro.fecha_desde = moment(filtro.fecha_desde).format('YYYY-MM-DD')}
    if (filtro.fecha_hasta){filtro.fecha_hasta = moment(filtro.fecha_hasta).add(1,'d').format('YYYY-MM-DD')}

    // this.dataSource = new List<Transaccion>()
    this.showSpinner = true

    this.service.listTransacciones(this.libEnvService.getConfig().ciaopr.ciaopr,filtro, cantRegistros, pagina).subscribe({

      next:(transacciones)=>{
          this.dataSource = transacciones
          setTimeout(() => {
            this.botonera.nativeElement.scrollIntoView({ behavior: 'smooth'})
          }, 100);
      },error:(err)=> {
          console.log(err)
          let msg = 'Error al obtener registros'
          if (err.error.mensaje){
            msg = err.error.mensaje
          }
          this.dataSource = new List<Transaccion>()
          this.snack.msgSnackBar(msg,'OK',undefined,'error')
          this.showSpinner = false
      },complete:()=>{
        this.showSpinner = false
      }
    })
  }

  buscarEstatus(status:string| null):void{
    this.form.patchValue({status})
    const filtro:TransaccionFiltro = this.form.getRawValue()
    console.log(filtro)
    
    this.buscarTransacciones(filtro,1,15)
  }


  buscarPersonaEnCuenta():void{
    this.form.patchValue({status:null})
    const filtro:TransaccionFiltro = this.form.getRawValue()

    this.dialog.open(CatalogoPersonasEnCuentaComponent,{data:this.dataDialogo('Búsqueda de Personas en Cuenta',undefined,undefined,undefined,25,filtro.xpayctanro?filtro.xpayctanro:'')}).afterClosed().subscribe(
      (result:personaXpayCuenta)=>{
        if (result){
          console.log(result)
          this.form.patchValue({
            nropersona:result.nropersona,
            personaEnCuentaNombre:result.persona.nombrecorto
          })
          filtro.nropersona = result.nropersona
          this.buscarTransacciones(filtro,1,15)
        } else {
          this.form.patchValue({
            nropersona:null,
            personaEnCuentaNombre:null
          })
          const filtro:TransaccionFiltro = this.form.getRawValue()
          filtro.nropersona = null
          this.buscarTransacciones(filtro,1,15)

        }
        
      }
    )

    this.buscarTransacciones(filtro,1,15)
  }


  status(status:string):string{
    if (status === 'ACCP') return 'Aprobado'
    if (status === 'RJCT') return 'Rechazado'
    return ''
  }

  viewTransaction(data:Transaccion):void{
    console.log(data.concepto)
    this.dialog.open(DetalleTransaccionComponent,{width:'90%', maxWidth:'550px',height:'auto',maxHeight:'90svh',data:data})
  }

  formatNumber(number:number):string{
    if (typeof number !== 'number') return '0.00'
    return number.toLocaleString('es-VE', { maximumFractionDigits: 2,minimumFractionDigits: 2 })
  }
//2024-12-02T21:38:26.782706-04:00
  formatDate(date:string):string{
    return moment(date).format('D/M/Y hh:mm a')
  }

  onPageChange(event:PageEvent):void{

    const filtro:TransaccionFiltro = this.form.getRawValue()
    
    if (event.pageIndex == this.dataSource.pagina - 1) {
      this.buscarTransacciones(filtro,event.pageIndex+1,event.pageSize)
    } else {
      if (filtro.xpayctanro != null){
        this.buscarTransacciones(filtro,event.pageIndex+1,event.pageSize)
      }
    }
  }

  eliminaFiltros():void{
    this.form.patchValue({
      nropersona:null,
      personaEnCuentaNombre:null
    })
    this.buscarTransacciones(this.form.getRawValue(),1,15)
  }

  drawMoneda(data:Transaccion):string{
    // if (data.moneda === 'VES') return `Bs. ${this.formatNumber(data.monto)}`
    // return `Bs. ${this.formatNumber(data.monto*data.rate)}`
    if (typeof data.monto_ves !== 'number' || data.monto_ves === 0.00) return `Bs. ${this.formatNumber(data.pay_amt)}`
    return `Bs. ${this.formatNumber(data.monto_ves)}`;
  }

}
