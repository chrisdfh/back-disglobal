import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { AliadoService, AliadoWrap } from 'aliados';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { List } from 'personas';

@Component({
  selector: 'app-catalogo-aliado-temporal',
  templateUrl: './catalogo-aliado-temporal.component.html',
  styleUrls: ['./catalogo-aliado-temporal.component.css']
})
export class CatalogoAliadoTemporalComponent extends CatalogoComponent<AliadoWrap> implements OnInit,AfterViewInit{

  private service:AliadoService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputQuery") inputQuery:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['codnip','nombrecompleto','nombrecorto']
    this.service = this.injector.get(AliadoService)
    this.form = this.builder.group({
      query: new FormControl(null)
    })
    this.buscar()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputQuery.nativeElement.focus()},0)
  }


  override buscar(): void {
    super.buscar()
    const query: string = this.form.value.query
    this.service.getAliadosTemp(this.ciaopr,query,this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<AliadoWrap>)=>{
          this.dataSource = value
        },
        error: (err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<AliadoWrap>
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
    const query: string = this.form.value.query
    if (event.pageIndex == this.dataSource.pagina - 1) {
      console.log('')
    } else {
      this.service.getAliadosTemp(this.ciaopr,query,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<AliadoWrap>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<AliadoWrap>
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
