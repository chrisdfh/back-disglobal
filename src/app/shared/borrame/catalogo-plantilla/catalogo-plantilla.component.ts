import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { XitypayService, XpayPlantilla, XpayPlantillaFiltro } from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-plantilla',
  templateUrl: './catalogo-plantilla.component.html',
  styleUrls: ['./catalogo-plantilla.component.css']
})
export class CatalogoPlantillaComponent  extends CatalogoComponent<XpayPlantilla> implements OnInit, AfterViewInit{

  private service: XitypayService
  nombrePersonas:string

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputNombre") inputNombre:ElementRef

  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['correlativo', 'nombre']
    this.service = this.injector.get(XitypayService)
    this.form = this.builder.group({
      nombre: new FormControl(null),
    })
    this.buscar()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputNombre.nativeElement.focus()},0)
  }

  override buscar():void {
    super.buscar()
    this.showSpinner=true
    const filtro: XpayPlantillaFiltro  = (this.form.value)

    this.service.listPlantillas("1", filtro, this.data.cant_registros||10, 1).subscribe(
      {
        next: (value:List<XpayPlantilla>) => {
          this.dataSource = value
        },
        error:(err)=> {
            this.dataSource;
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<XpayPlantilla>
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
    const filtro: XpayPlantillaFiltro  = (this.form.value)
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
        this.service.listPlantillas("1", filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
          {
            next: (value:List<XpayPlantilla>) => {
              this.dataSource = value
            },
            error:(err)=> {
                console.log('Hubo un error')
                console.log(err)
                this.dataSource = new List<XpayPlantilla>
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
