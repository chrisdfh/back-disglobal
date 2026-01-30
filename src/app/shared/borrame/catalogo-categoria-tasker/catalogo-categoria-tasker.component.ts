import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { AliadoService, CategoriaTasker, CategoriaTaskerQuery } from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-categoria-tasker',
  templateUrl: './catalogo-categoria-tasker.component.html',
  styleUrls: ['./catalogo-categoria-tasker.component.css']
})
export class CatalogoCategoriaTaskerComponent extends CatalogoComponent<CategoriaTasker> implements OnInit, AfterViewInit{
  private service: AliadoService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("query") query:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['categoriacod','categorianombre']
    this.service = this.injector.get(AliadoService)
    this.form = this.builder.group({
      categoriacod: new FormControl(null),
      query: new FormControl(this.data.campousuariochar_1 || null)
    })
    this.buscar()

    console.log(this.data)
  }

  ngAfterViewInit(): void {
      setTimeout(()=>{this.query.nativeElement.focus()},0)
  }

  override buscar(): void {
    super.buscar()
    const filtro: CategoriaTaskerQuery = this.form.value
    filtro.ciaopr = this.ciaopr
    
    this.service.getCategoriaTasker(this.ciaopr,filtro, this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<CategoriaTasker>)=>{
          console.log(value)
          this.dataSource = value
        },
        error:(err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<CategoriaTasker>
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
      const filtro: CategoriaTaskerQuery = this.form.value
      filtro.ciaopr = this.ciaopr
      if (event.pageIndex == this.dataSource.pagina -1) {
        console.log('')
      } else {
        this.service.getCategoriaTasker(this.ciaopr,filtro, this.data.cant_registros||10,(++event.pageIndex)).subscribe(
          {
            next: (value:List<CategoriaTasker>)=>{
              this.dataSource = value
            },
            error: (err)=>{
              console.log('Hubo un error')
              console.log(err)
              this.dataSource = new List<CategoriaTasker>
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
