import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { CatalogoComponent } from '../catalogo/catalogo.component'
import { List, PersonaView, PersonaViewTipoCod, PersonasService } from 'personas'
import { FormControl } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
// import { ViewportScroller } from '@angular/common'

@Component({
  selector: 'app-catalogo-persona',
  templateUrl: './catalogo-persona.component.html',
  styleUrls: ['./catalogo-persona.component.css']
})
export class CatalogoPersonaComponent extends CatalogoComponent<PersonaView> implements OnInit, AfterViewInit{
  
  private service: PersonasService
  nombrePersonas:string

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("inputNombre") inputNombre:ElementRef
  
  override ngOnInit(): void {
    super.ngOnInit()
    this.displayedColumns = ['nropersona','tipnip', 'codnip', 'nombrecorto','nombrecompleto']
    this.service = this.injector.get(PersonasService)
    this.form = this.builder.group({
      nombrecorto: new FormControl(''),
      nombrecompleto: new FormControl(''),
      personatipocod: new FormControl(this.data.campousuariochar_1 || null),
      codnip: new FormControl(''),
      nropersona: new FormControl<number|null>(null),
    })
      
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.inputNombre.nativeElement.focus()},0)
  }

  override buscar():void {
    super.buscar()
    const filtro: PersonaViewTipoCod  = (this.form.value)
    filtro.ciaopr = "1"

    this.service.getPersonaView("1", filtro, this.data.cant_registros||10, 1).subscribe(
      {
        next: (value:List<PersonaView>) => {
          this.dataSource = value
        },
        error:(err)=> {
            this.dataSource;
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<PersonaView>
            this.showSpinner = false
        },
        complete: ()=>{
          this.showSpinner = false
        }
      }
    )
  }

  tipoPersonaTexto(tipoPersona:string):string{
    switch (tipoPersona) {
      case 'N':
        return ' Natural'
      case 'J':
        return ' Jurídica'
      default:
        return ''
    }
  }

  override onPageChange(event: PageEvent) {
    super.onPageChange(event)
    const filtro: PersonaViewTipoCod  = (this.form.value)
    filtro.ciaopr = "1"
    if (event.pageIndex == this.dataSource.pagina -1) {
      console.log('')
    } else {
        this.service.getPersonaView("1", filtro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
          {
            next: (value:List<PersonaView>) => {
              this.dataSource = value
            },
            error:(err)=> {
                console.log('Hubo un error')
                console.log(err)
                this.dataSource = new List<PersonaView>
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
