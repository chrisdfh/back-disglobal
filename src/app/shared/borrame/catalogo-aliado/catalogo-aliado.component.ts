import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { AliadoService, AliadoWrap } from 'aliados';
import { FormControl, FormGroup } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-aliado',
  templateUrl: './catalogo-aliado.component.html',
  styleUrls: ['./catalogo-aliado.component.css']
})
export class CatalogoAliadoComponent extends CatalogoComponent<AliadoWrap> implements OnInit,AfterViewInit{

  private service:AliadoService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputAliado") inputAliado:ElementRef

  override ngOnInit(): void {
      super.ngOnInit()
      this.displayedColumns = ['nroaliado','nombrecorto','nombrecompleto','alias']
      this.service = this.injector.get(AliadoService)
      this.form = this.builder.group({
        nroaliado: new FormControl(null),
        alias: new FormControl(null),
        categoriacod: new FormControl(null),
        persona:new FormGroup({
          nombrecorto: new FormControl(null),
          nombrecompleto: new FormControl(null),
        })
      })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputAliado.nativeElement.focus()},0)
  }

  override buscar(): void {
      super.buscar()
      const filtro: AliadoWrap = this.form.value
      filtro.ciaopr = this.ciaopr
      this.service.getAliadoWrapFull(this.ciaopr,filtro,this.data.cant_registros||10,1).subscribe(
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
      const filtro: AliadoWrap = this.form.value
      filtro.ciaopr = this.ciaopr
      if (event.pageIndex == this.dataSource.pagina - 1) {
        console.log('')
      } else {
        this.service.getAliadoWrapFull(this.ciaopr,filtro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
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
