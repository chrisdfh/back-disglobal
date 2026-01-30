import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { XitypayService, XpayMoneda, XpayMonedaFiltro } from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-monedas',
  templateUrl: './catalogo-monedas.component.html',
  styleUrls: ['./catalogo-monedas.component.css']
})
export class CatalogoMonedasComponent extends CatalogoComponent<XpayMoneda> implements OnInit,AfterViewInit{


    private service: XitypayService
  
    @ViewChild("tableContainer") tableContainer:ElementRef
    @ViewChild("input") inputNombre:ElementRef
    
    override ngOnInit(): void {
      super.ngOnInit()
      this.displayedColumns = ['monedacod','monedanombre','estatus']
      this.service = this.injector.get(XitypayService)
  
      this.form = this.builder.group({
        nombre: new FormControl(null),
        moneda: new FormControl(null),
        activo: new FormControl(null),
      })

      this.buscar()
    }
  
    ngAfterViewInit(): void {
      setTimeout(()=>{this.inputNombre.nativeElement.focus()},0)
    }
  
    override buscar():void {
      super.buscar()
      const filtro: XpayMonedaFiltro  = this.form.getRawValue()
      this.service.getMonedas(this.ciaopr, filtro, this.data.cant_registros||10, 1).subscribe(
        {
          next: (value:List<XpayMoneda>) => {
            this.dataSource = value
            console.log(this.dataSource)
            this.showSpinner = false
          },error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<XpayMoneda>
            this.showSpinner = false
          }
        }
      )
    }
  
    override onPageChange(event: PageEvent) {
      super.onPageChange(event)
      const filtro: XpayMonedaFiltro  = this.form.getRawValue()
      if (event.pageIndex == this.dataSource.pagina -1) {
        console.log('')
      } else {
        this.service.getMonedas(this.ciaopr, filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
          {
            next: (value:List<XpayMoneda>) => {
              this.dataSource = value
              this.showSpinner = false
            },error:(err)=>{
              console.log('Hubo un error')
              console.log(err)
              this.dataSource = new List<XpayMoneda>
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
