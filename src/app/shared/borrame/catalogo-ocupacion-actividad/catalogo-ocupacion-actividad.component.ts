import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { ApoyoOcupacionActvidadService, List, OcupActividad } from 'personas';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-catalogo-ocupacion-actividad',
  templateUrl: './catalogo-ocupacion-actividad.component.html',
  styleUrls: ['./catalogo-ocupacion-actividad.component.css']
})
export class CatalogoOcupacionActividadComponent extends CatalogoComponent<OcupActividad> implements OnInit, AfterViewInit {
  
  public service:ApoyoOcupacionActvidadService
  
  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("actividadInput") actividadInput:ElementRef

  override ngOnInit(): void {
      super.ngOnInit()
      this.displayedColumns = ['ocupactivcod','ocupactivnombre']
      this.service = this.injector.get(ApoyoOcupacionActvidadService)

      this.form = this.builder.group({
        ocupactivcod: new FormControl(null),
        ocupactivnombre: new FormControl(null)
      })
  }

  ngAfterViewInit(): void {
      setTimeout(()=>{this.actividadInput.nativeElement.focus()},0)
  }

  override buscar():void{
    super.buscar()
    const filtro: OcupActividad  = (this.form.value)
    filtro.ciaopr = this.ciaopr
    filtro.campousuariochar_1 = this.data.campousuariochar_1
    this.service.getOcupacionActividad(filtro.ciaopr, filtro, this.data.cant_registros||10, 1).subscribe(
      {
        next: (value:List<OcupActividad>) => {
          this.dataSource = value
          this.showSpinner = false
        },error:(err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<OcupActividad>
          this.showSpinner = false
        }
      }
    )
  }

  override onPageChange(event: PageEvent) {
    super.onPageChange(event)
    const filtro: OcupActividad  = (this.form.value)
    filtro.ciaopr = this.ciaopr
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
      this.service.getOcupacionActividad(this.ciaopr, filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
        {
          next: (value:List<OcupActividad>) => {
            this.dataSource = value
            this.showSpinner = false
          },error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<OcupActividad>
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
