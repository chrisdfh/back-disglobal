import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { User, UserQuery, usuarioXityPay, XitypayService, XpayCuenta, XpayCuentaBusqueda } from 'aliados';
import { FormControl } from '@angular/forms';
import { List, PersonasService, UserView2, UserView2Persona, UserViewFiltro, UsuariosService } from 'personas';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalogo-usuarios',
  templateUrl: './catalogo-usuarios.component.html',
  styleUrls: ['./catalogo-usuarios.component.css']
})
export class CatalogoUsuariosComponent extends CatalogoComponent<usuarioXityPay> implements OnInit,AfterViewInit{



  private service: XitypayService

  @ViewChild("tableContainer") tableContainer:ElementRef
  @ViewChild("input") input:ElementRef



  override ngOnInit(): void {
    console.log(this.data.msg)
    super.ngOnInit()
    this.displayedColumns = ['tipnip','codnip','alias','nombrecorto']
    this.service = this.injector.get(XitypayService)
    this.form = this.builder.group({
      tipnip: new FormControl(null),
      codnip: new FormControl(null),
      nombrecompleto:new FormControl(null),
      username: new FormControl(null),
    })

    this.buscar()
}

  ngAfterViewInit(): void {
      
    setTimeout(()=>{this.input.nativeElement.focus()},0)
  }


  override buscar(): void {
    super.buscar()
    // const filtro: UserViewFiltro = this.form.value

    // filtro.codnip = this.form.get('codnip')?.value === '' ? null :this.form.get('codnip')?.value
    // filtro.tipnip = this.form.get('tipnip')?.value === '' ? null :this.form.get('tipnip')?.value
    // filtro.nombrecompleto = this.form.get('nombrecompleto')?.value === '' ? null :this.form.get('nombrecompleto')?.value
    // filtro.username = this.form.get('username')?.value === '' ? null :this.form.get('username')?.value
    

    this.service.listClubUsuariosAsociadosXpayCuentaSecured(this.ciaopr,this.data.xpctanro,this.data.cant_registros||10,1).subscribe(
      {
        next: (value:List<usuarioXityPay>)=>{
          
          this.dataSource = value
        },
        error: (err)=>{
          console.log('Hubo un error')
          console.log(err)
          this.dataSource = new List<usuarioXityPay>
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
    const filtro: UserViewFiltro = this.form.value
    filtro.codnip = this.form.get('codnip')?.value === '' ? null :this.form.get('codnip')?.value
    filtro.tipnip = this.form.get('tipnip')?.value === '' ? null :this.form.get('tipnip')?.value
    filtro.nombrecompleto = this.form.get('nombrecompleto')?.value === '' ? null :this.form.get('nombrecompleto')?.value
    filtro.username = this.form.get('username')?.value === '' ? null :this.form.get('username')?.value


    if (event.pageIndex == this.dataSource.pagina - 1) {
      console.log('')
    } else {
      this.service.listClubUsuariosAsociadosXpayCuentaSecured(this.ciaopr,this.data.xpctanro,this.data.cant_registros||10,(++event.pageIndex)).subscribe(
        {
          next: (value:List<usuarioXityPay>)=>{
            this.dataSource = value
          },
          error: (err)=>{
            console.log('Hubo un error')
            console.log(err)
            this.dataSource = new List<usuarioXityPay>
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
