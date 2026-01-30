import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlanCuenta, PlanQuery, XitypayService } from 'aliados';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { List } from 'personas';

@Component({
  selector: 'app-catalogo-plan-cuenta-xp',
  templateUrl: './catalogo-plan-cuenta-xp.component.html',
  styleUrls: ['./catalogo-plan-cuenta-xp.component.css']
})
export class CatalogoPlanCuentaXpComponent extends CatalogoComponent<PlanCuenta> implements OnInit, AfterViewInit{

  private service: XitypayService
  nombrePersonas:string

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputNombre") inputNombre:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['id_plan', 'nombre','CEB','CSB','CSOB','CXP']
    this.service = this.injector.get(XitypayService)
    this.form = this.builder.group({
      id_plan: new FormControl(null),
      nombre: new FormControl(null),
    })
    this.buscar()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputNombre.nativeElement.focus()},0)
  }

  override buscar():void {
    super.buscar()
    const filtro: PlanQuery  = (this.form.value)

    this.service.listPlanesXPay("1", filtro, this.data.cant_registros||10, 1).subscribe(
      {
        next: (value:List<PlanCuenta>) => {
          this.dataSource = value
        },
        error:(err)=> {
            this.dataSource;
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<PlanCuenta>
            this.showSpinner = false
        },
        complete: ()=>{
          this.showSpinner = false
        }
      }
    )
  }

  override onPageChange(event: PageEvent) {
    super.onPageChange(event)
    const filtro: PlanQuery  = (this.form.value)
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
        this.service.listPlanesXPay("1", filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
          {
            next: (value:List<PlanCuenta>) => {
              this.dataSource = value
            },
            error:(err)=> {
                console.log('Hubo un error')
                console.log(err)
                this.dataSource = new List<PlanCuenta>
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
