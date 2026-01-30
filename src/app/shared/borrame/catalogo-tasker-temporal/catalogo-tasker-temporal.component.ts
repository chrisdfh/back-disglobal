import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskerService, TaskerView } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-tasker-temporal',
  templateUrl: './catalogo-tasker-temporal.component.html',
  styleUrls: ['./catalogo-tasker-temporal.component.css']
})
export class CatalogoTaskerTemporalComponent extends CatalogoComponent<TaskerView> implements OnInit, AfterViewInit{

  private service:TaskerService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputQuery") inputQuery:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['codnip','nombre']
    this.service = this.injector.get(TaskerService)
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
    this.service.getTaskersTemp(this.ciaopr,query,this.data.cant_registros||10,1).subscribe(
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

override onPageChange(event: PageEvent): void {
    super.onPageChange(event)
    const query: string = this.form.value.query
    if (event.pageIndex == this.dataSource.pagina - 1) {
      console.log('')
    } else {
      this.service.getTaskersTemp(this.ciaopr,query,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
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
