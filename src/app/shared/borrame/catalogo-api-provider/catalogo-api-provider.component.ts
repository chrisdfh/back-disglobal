import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { XitypayService, XpayApiProvider, XpayCtaProviderFiltro } from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-api-provider',
  templateUrl: './catalogo-api-provider.component.html',
  styleUrls: ['./catalogo-api-provider.component.css']
})
export class CatalogoApiProviderComponent  extends CatalogoComponent<XpayApiProvider> implements OnInit,AfterViewInit{

  private service:XitypayService


  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("input") inputAliado:ElementRef

  override ngOnInit(): void {
        super.ngOnInit()
        this.displayedColumns = ['provcod','provnombre','descripcion']
        this.service = this.injector.get(XitypayService)
        this.form = this.builder.group({
          provcod: new FormControl(null),
          provnombre: new FormControl(null),
        })
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
        this.inputAliado.nativeElement.focus();
      }, 0);
      this.buscar()
  }


    override buscar(): void {
        super.buscar()
        const filtro: XpayCtaProviderFiltro = this.form.value
        const ciaopr = this.ciaopr
        this.service.getListApiProviders(ciaopr,filtro,this.data.cant_registros||10,1).subscribe(
          {
            next: (value:List<XpayApiProvider>)=>{
              this.dataSource = value
            },
            error: (err)=>{
              console.log('Hubo un error')
              console.log(err)
              this.dataSource = new List<XpayApiProvider>
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
        const filtro: XpayCtaProviderFiltro = this.form.value
        const ciaopr = this.ciaopr
        if (event.pageIndex == this.dataSource.pagina - 1) {
          console.log('')
        } else {
          this.service.getListApiProviders(ciaopr,filtro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
            {
              next: (value:List<XpayApiProvider>)=>{
                this.dataSource = value
              },
              error: (err)=>{
                console.log('Hubo un error')
                console.log(err)
                this.dataSource = new List<XpayApiProvider>
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
