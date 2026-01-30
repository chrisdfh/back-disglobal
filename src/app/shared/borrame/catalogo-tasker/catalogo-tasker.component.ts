import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { TaskerQuery, TaskerService, TaskerView } from 'aliados';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { List } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';

@Component({
  selector: 'app-catalogo-tasker',
  templateUrl: './catalogo-tasker.component.html',
  styleUrls: ['./catalogo-tasker.component.css']
})
export class CatalogoTaskerComponent extends CatalogoComponent<TaskerView> implements OnInit, AfterViewInit{

  private service: TaskerService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("query") query:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nrotasker','alias','codnip','nombre','categoria']
    this.service = this.injector.get(TaskerService)
    this.form = this.builder.group({
      nrotasker: new FormControl(null),
      categoriacod: new FormControl(null),
      persona: new FormGroup({
        codnip: new FormControl(null),
        nombrecompleto: new FormControl(null)
      }),
      alias: new FormControl(null),
      query: new FormControl(null)
    })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.query.nativeElement.focus()},0)
  }

  override buscar(): void {
      super.buscar()
      const filtro:TaskerQuery = this.form.value
      filtro.ciaopr = this.ciaopr

      this.service.getTaskers(this.ciaopr,filtro, this.data.cant_registros||10,1).subscribe(
        {
          next: (value:List<TaskerView>)=>{
            console.log(value)
            this.dataSource = value
          },
          error:(err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<TaskerView>
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
    const filtro: TaskerQuery = this.form.value
    filtro.ciaopr = this.ciaopr
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
      this.service.getTaskers(this.ciaopr,filtro, this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<TaskerView>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<TaskerView>
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
