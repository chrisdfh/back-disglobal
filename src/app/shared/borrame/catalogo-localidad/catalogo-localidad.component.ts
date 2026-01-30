import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { ApoyoLocalidadService, List, Localidad, LocalidadQuery } from 'personas';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-localidad',
  templateUrl: './catalogo-localidad.component.html',
  styleUrls: ['./catalogo-localidad.component.css']
})
export class CatalogoLocalidadComponent extends CatalogoComponent<Localidad> implements OnInit,AfterViewInit{
  
  private service: ApoyoLocalidadService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputTxtLocalidad") inputLocalidad:ElementRef
  
  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['localidadcod','localidadnombre']
    this.service = this.injector.get(ApoyoLocalidadService)

    this.form = this.builder.group({
      localidadayudabusq: new FormControl('')
    })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputLocalidad.nativeElement.focus()},0)
  }

  override buscar():void {
    super.buscar()
    const filtro: LocalidadQuery  = (this.form.value)
    filtro.order_by = 'l.localidadcod asc'
    filtro.ciaopr = this.ciaopr
    this.service.getLocalidades(this.ciaopr, filtro, this.data.cant_registros||10, 1).subscribe(
      {
        next: (value:List<Localidad>) => {
          this.dataSource = value
          this.showSpinner = false
        },error:(err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<Localidad>
          this.showSpinner = false
        }
      }
    )
  }

  override onPageChange(event: PageEvent) {
    super.onPageChange(event)
    const filtro: LocalidadQuery  = (this.form.value)
    filtro.ciaopr = this.ciaopr
    filtro.order_by = 'l.localidadcod asc'
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
      this.service.getLocalidades(this.ciaopr, filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
        {
          next: (value:List<Localidad>) => {
            this.dataSource = value
            this.showSpinner = false
          },error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<Localidad>
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
