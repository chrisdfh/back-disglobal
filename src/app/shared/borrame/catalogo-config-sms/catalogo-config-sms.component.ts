import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { SmsConfig, SmsConfigFiltro, XitypayService } from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-config-sms',
  templateUrl: './catalogo-config-sms.component.html',
  styleUrls: ['./catalogo-config-sms.component.css']
})
export class CatalogoConfigSmsComponent  extends CatalogoComponent<SmsConfig> implements OnInit, AfterViewInit{
  private service: XitypayService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("query") query:ElementRef


    override ngOnInit(): void {
      super.ngOnInit()
      this.displayedColumns = ['nombre','serviciocod']
      this.service = this.injector.get(XitypayService)
      this.form = this.builder.group({
        nombre: new FormControl(null),
        serviciocod: new FormControl(null)
      })
    }
  
    ngAfterViewInit(): void {
        setTimeout(()=>{this.query.nativeElement.focus()},0)
    }
  
    override buscar(): void {
      super.buscar()
      const filtro: SmsConfigFiltro = this.form.value
      filtro.ciaopr = this.ciaopr
      this.showSpinner=true
      this.service.listConfigSMS(this.ciaopr,filtro,this.data.cant_registros || 10,1).subscribe(
        {
          next: (value:List<SmsConfig>)=>{
            console.log(value)
            this.dataSource = value
          },
          error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<SmsConfig>
            this.showSpinner = false
          },
          complete:()=>{
            this.showSpinner = false
          }
        }
      )
    }
  
    override onPageChange(event: PageEvent): void {
        super.onPageChange(event)
        const filtro: SmsConfigFiltro = this.form.value
        filtro.ciaopr = this.ciaopr
        this.showSpinner = true
        if (event.pageIndex == this.dataSource.pagina -1) {
          console.log('')
        } else {
          this.service.listConfigSMS(this.ciaopr,filtro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
            {
              next: (value:List<SmsConfig>)=>{
                this.dataSource = value
              },
              error: (err)=>{
                console.log('Hubo un error')
                console.log(err)
                this.dataSource = new List<SmsConfig>
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
