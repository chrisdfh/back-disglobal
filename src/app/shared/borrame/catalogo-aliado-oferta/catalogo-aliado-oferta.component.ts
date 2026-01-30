import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { OfertaService, OfertaView } from 'aliados';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-aliado-oferta',
  templateUrl: './catalogo-aliado-oferta.component.html',
  styleUrls: ['./catalogo-aliado-oferta.component.css']
})
export class CatalogoAliadoOfertaComponent extends CatalogoComponent<OfertaView> implements OnInit, AfterViewInit{

  private service: OfertaService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("nroOferta") nroOferta:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nroaliado','aliado','nrooferta','categoriacod','oferta','fch_desde','fch_hasta']
    this.service = this.injector.get(OfertaService)
    this.form = this.builder.group({
      nroaliado:new FormControl(null),
      nrooferta:new FormControl(null),
      categoriacod:new FormControl(null),
      aliado:new FormGroup({
        persona:new FormGroup({
          nombrecorto:new FormControl(null)
        })
      })
      })
      this.buscar()
  }

  ngAfterViewInit(): void {
      setTimeout(()=>{this.nroOferta.nativeElement.focus()},0)
  }

  fixDate(date:string):string{
    return moment(date).format('DD/MM/YYYY')
  }

  override buscar(): void {
    super.buscar()
    const filtro: OfertaView = this.form.value
    filtro.ciaopr = this.ciaopr
    filtro.nroaliado = this.data.nroaliado || null
    this.service.getOfertas(this.ciaopr,filtro, this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<OfertaView>)=>{
          console.log(value)
          this.dataSource = value
        },
        error:(err)=>{
          this.dataSource;
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<OfertaView>
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
      const filtro: OfertaView = this.form.value
      filtro.ciaopr = this.ciaopr
      if (event.pageIndex == this.dataSource.pagina -1) {
        console.log('')
      } else {
        this.service.getOfertas(this.ciaopr,filtro, this.data.cant_registros||10,(++event.pageIndex)).subscribe(
          {
            next: (value:List<OfertaView>)=>{
              this.dataSource = value
            },
            error: (err)=>{
              console.log('Hubo un error')
              console.log(err)
              this.dataSource = new List<OfertaView>
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
