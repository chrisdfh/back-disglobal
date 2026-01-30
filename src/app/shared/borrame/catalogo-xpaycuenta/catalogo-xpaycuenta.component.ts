import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { XitypayService, XpayCuenta, XpayCuentaBusqueda } from 'aliados';
import { List } from 'personas';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ServicioCompartidoComponent } from 'src/app/layout/servicio-compartido/servicio-compartido.component';
import { ServicioLocalstorage } from 'src/app/layout/servicio-localstorage.service';

@Component({
  selector: 'app-catalogo-xpaycuenta',
  templateUrl: './catalogo-xpaycuenta.component.html',
  styleUrls: ['./catalogo-xpaycuenta.component.css']
})
export class CatalogoXpaycuentaComponent  extends CatalogoComponent<XpayCuenta> implements OnInit,AfterViewInit{

  private service: XitypayService
  modoCliente = false
  cliente:miniXPCuenta|null
  subscription:Subscription
  titulo:string
  private servicioCompartido:ServicioCompartidoComponent = new ServicioCompartidoComponent() 
  private localStorageService:ServicioLocalstorage = new ServicioLocalstorage()

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("input") input:ElementRef

  override ngOnInit(): void {

    super.ngOnInit()
    this.displayedColumns = ['xpayctanro','activo','alias','codnip','nombre']
    this.service = this.injector.get(XitypayService)
    this.form = this.builder.group({
      xpayctanro: new FormControl(null),
      username: new FormControl(null),
      codnip: new FormControl(null),
      nombre:new FormControl(null),
    })


    this.subscription = this.servicioCompartido.getJwtData().subscribe((e)=>console.log("EN INICIO",e))
    
    const data = this.localStorageService.getItem('1uswK2yh')
    if (data) {
      const parsedData:miniXPCuenta = JSON.parse(data)
      if (parsedData.xpayctanro){
        this.modoCliente = true
        this.titulo = parsedData.xpayctanro
        this.form.patchValue({
          xpayctanro:parsedData.xpayctanro
        })
    }
  }


    this.buscar()
}




  ngAfterViewInit(): void {
      
    setTimeout(()=>{this.input.nativeElement.focus()},0)
  }


  override buscar(): void {
    super.buscar()
    const filtro: XpayCuentaBusqueda = this.form.value
    filtro.ciaopr = this.ciaopr
    this.service.listXpayCuentas(this.ciaopr,filtro,this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<XpayCuenta>)=>{
          this.dataSource = value
        },
        error: (err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<XpayCuenta>
          this.showSpinner = false
        },
        complete: ()=>{
          this.showSpinner = false
        }
      }
    )
}

override onPageChange(event: PageEvent): void {
    super.onPageChange(event)
    const filtro: XpayCuentaBusqueda = this.form.value
    filtro.ciaopr = this.ciaopr
    if (event.pageIndex == this.dataSource.pagina - 1) {
      console.log('')
    } else {
      this.service.listXpayCuentas(this.ciaopr,filtro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<XpayCuenta>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<XpayCuenta>
            this.showSpinner = false
          },
          complete: ()=>{
            this.showSpinner = false
          }
        }
      )
    }
    if (this.tableContainer != undefined){
      this.tableContainer.nativeElement.scrollTo({
        top:0,
        behavior: "smooth", 
        block: "start" 
      })
    }
}



}

class miniXPCuenta{
  xpayctanro: string;
  email: string;
  cuenta_transitoria: string;
  federado_estricto: string;
  nombre: string;
  alias: string;
  email_publico: string;
  url_avatar1: string;
  nombrepersjuridica: string;
  siglaspersjuridica: string;
  nombrecompleto: string;
  nombrecorto: string;
  usr_x_cta: Usrxcta;
}

interface Usrxcta {
  rol_1: string;
}