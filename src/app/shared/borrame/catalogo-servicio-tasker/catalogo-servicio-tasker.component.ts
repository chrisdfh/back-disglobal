import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskerService, CategoriaTasker, ServiciosView, ServiciosViewQuery } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl, FormGroup } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment'
import { CatalogoCategoriaTaskerComponent } from '../catalogo-categoria-tasker/catalogo-categoria-tasker.component';

@Component({
  selector: 'app-catalogo-servicio-tasker',
  templateUrl: './catalogo-servicio-tasker.component.html',
  styleUrls: ['./catalogo-servicio-tasker.component.css']
})
export class CatalogoServicioTaskerComponent extends CatalogoComponent<ServiciosView> implements OnInit, AfterViewInit {

  private service: TaskerService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("nombrecompleto") query:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nroaliado','aliado','nrooferta','categoriacod','oferta']
    this.service = this.injector.get(TaskerService)
    this.form = this.builder.group({
      query: new FormControl(null),
      nrotasker: new FormControl(null),
      nroservicio: new FormControl(null),
      tasker: new FormGroup({
        persona: new FormGroup({
          nombrecompleto: new FormControl(null)
        }),
        alias: new FormControl(null)
      }),
      categoriapadrecod: new FormControl(null),
      categoriapadrenombre: new FormControl(null),
      activo: new FormControl(null),
      vigente: new FormControl(null),
      verificado: new FormControl(null),
      aprobado: new FormControl(null)
    })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.query.nativeElement.focus()},0)
  }
  dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,opciones?:string){
    return {
      "titulo":titulo,
      "msg":mensaje || '',
      "btn_true_text":textoBotonTrue || 'Aceptar',
      "btn_false_text":textoBotonFalse || 'Cancelar',
      "cant_registros": cantRegistros || 25,
      "query":opciones || undefined,
    }
  }

  catalogoCatTasker():void{
    this.form.value.categoriapadrecod=''
    this.form.value.categoriapadrenombre=''
    this.dialog.open(CatalogoCategoriaTaskerComponent,
      {data: this.dataDialogo('Búsqueda de Categorías de Taskers',undefined,undefined,undefined,undefined,undefined)})
      .afterClosed().subscribe((result:CategoriaTasker)=>{
        if(result){
            this.form.patchValue({
              categoriapadrecod:result.categoriacod,
              categoriapadrenombre:result.categorianombre
          })
        }
      }
    )
  }

  override buscar(): void {
      super.buscar()
      const filtro:ServiciosViewQuery = this.form.value
      filtro.ciaopr = this.ciaopr

      this.service.getServicios(this.ciaopr,filtro, this.data.cant_registros||10,1).subscribe(
        {
          next: (value:List<ServiciosView>)=>{
            this.dataSource = value
          },
          error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<ServiciosView>
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
    const filtro: ServiciosViewQuery = this.form.value
    filtro.ciaopr = this.ciaopr
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
      this.service.getServicios(this.ciaopr,filtro, this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<ServiciosView>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<ServiciosView>
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
  fixDate(date:string):string{
    return moment(date).format('DD/MM/YYYY')
  }

}
