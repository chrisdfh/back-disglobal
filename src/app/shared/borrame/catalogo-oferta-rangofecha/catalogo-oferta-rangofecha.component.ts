import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { OfertaService, OfertaView } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-oferta-rangofecha',
  templateUrl: './catalogo-oferta-rangofecha.component.html',
  styleUrls: ['./catalogo-oferta-rangofecha.component.css']
})
export class CatalogoOfertaRangofechaComponent  extends CatalogoComponent<OfertaView> implements AfterViewInit{

  private service: OfertaService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputAliado") inputAliado:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nroaliado','nrooferta','aliado','categoriacod','oferta','fch_desde','fch_hasta']
    this.service = this.injector.get(OfertaService)
    this.form = this.builder.group({
      nroaliado:new FormControl(null),
      nrooferta:new FormControl(null),
      vigente_desde:new FormControl(new Date(this.data.fecha)),
      vigente_hasta:new FormControl(new Date(this.data.fecha)),
      activo: new FormControl(false),
      vigente: new FormControl(false),
      verificado: new FormControl(false),
      aprobado: new FormControl(false),
      categoriacod:new FormControl(null),
      aliado:new FormGroup({
        persona:new FormGroup({
          nombrecorto:new FormControl(null)
        })
      })
      })
      this.form.patchValue({
        aprobado:true,
        activo:true,
        verificado:true,
        vigente:false
      })
  }

  ngAfterViewInit(): void {
      setTimeout(()=>{this.inputAliado.nativeElement.focus()},0)
  }

  fixDate(date:string):string{
    return moment(date).format('DD/MM/YYYY')
  }

  setStatus(filtro:OfertaView):OfertaView{
    filtro.activo = ''
    filtro.vigente = ''
    filtro.verificado = ''
    filtro.aprobado = ''

    if(this.form.get('activo') != null && this.form.get('activo')?.value == true){
      filtro.activo = 'S'
    }
    if(this.form.get('vigente') != null && this.form.get('vigente')?.value == true){
      filtro.vigente = 'S'
    }
    if(this.form.get('verificado') != null && this.form.get('verificado')?.value == true){
      filtro.verificado = 'S'
    }
    if(this.form.get('aprobado') != null && this.form.get('aprobado')?.value == true){
      filtro.aprobado = 'S'
    }

    filtro.vigente_desde=moment(this.form.get('vigente_desde')?.value).format('YYYY/MM/DD')
    filtro.vigente_hasta=moment(this.form.get('vigente_hasta')?.value).format('YYYY/MM/DD')

    return filtro;
  }

  override buscar(): void {
    super.buscar()
    const filtro: OfertaView = this.form.value
    // filtro.vigente_desde=moment().format('YYYY/MM/DD')
    filtro.ciaopr = this.ciaopr
    const filtroOferta = this.setStatus(filtro)
    console.log(filtroOferta)
    this.service.getOfertas(this.ciaopr,filtroOferta, this.data.cant_registros||10,1).subscribe(
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
