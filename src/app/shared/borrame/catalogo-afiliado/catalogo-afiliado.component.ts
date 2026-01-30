import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AfiliadoService, AfiliadosQuery, AfiliadoView } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { List } from 'personas';

@Component({
  selector: 'app-catalogo-afiliado',
  templateUrl: './catalogo-afiliado.component.html',
  styleUrls: ['./catalogo-afiliado.component.css']
})
export class CatalogoAfiliadoComponent extends CatalogoComponent<AfiliadoView> implements OnInit,AfterViewInit {

  private service:AfiliadoService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputAfiliado") inputAfiliado:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nroafiliado','codnip','nombrecorto','alias']
    this.service = this.injector.get(AfiliadoService)
    this.form = this.builder.group({
      nroafiliado: new FormControl(null),
      codnip: new FormControl(null),
      nombrecompleto: new FormControl(null),
      alias: new FormControl(null)
    })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputAfiliado.nativeElement.focus()},0)
  }


  override buscar(): void {
    super.buscar()
    const filtro: AfiliadosQuery = this.form.value
    filtro.ciaopr = this.ciaopr
    filtro.order_by = 'p.nombrecompleto asc'
    this.service.getAfiliados(this.ciaopr,filtro,this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<AfiliadoView>)=>{
          this.dataSource = value
        },
        error: (err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<AfiliadoView>
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
    const filtro: AfiliadosQuery = this.form.value
    filtro.ciaopr = this.ciaopr
    filtro.order_by = 'p.nombrecompleto asc'
    if (event.pageIndex == this.dataSource.pagina - 1) {
      console.log('')
    } else {
      this.service.getAfiliados(this.ciaopr,filtro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<AfiliadoView>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<AfiliadoView>
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
