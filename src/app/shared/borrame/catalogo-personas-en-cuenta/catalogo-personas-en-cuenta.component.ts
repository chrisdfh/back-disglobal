import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { PersonaEnCuentaFiltro, personaXpayCuenta, XitypayService} from 'aliados';
import { FormControl } from '@angular/forms';
import { List } from 'personas';
import { PageEvent } from '@angular/material/paginator';
import { ServicioLocalstorage } from 'src/app/layout/servicio-localstorage.service';

@Component({
  selector: 'app-catalogo-personas-en-cuenta',
  templateUrl: './catalogo-personas-en-cuenta.component.html',
  styleUrls: ['./catalogo-personas-en-cuenta.component.css']
})
export class CatalogoPersonasEnCuentaComponent  extends CatalogoComponent<personaXpayCuenta> implements OnInit{

  private service: XitypayService
  private localStorageService:ServicioLocalstorage = new ServicioLocalstorage()

  xpayctanro:string

  @ViewChild("tableContainer") tableContainer:ElementRef

  override ngOnInit(): void {
    super.ngOnInit();

        super.ngOnInit()


    const data = this.localStorageService.getItem('1uswK2yh')
    const genData = this.localStorageService.getItem('HQqS4x2a')

    if (data && genData) {
      const parsedData:miniXPCuenta = JSON.parse(data)
      if (parsedData.xpayctanro){
        this.xpayctanro = parsedData.xpayctanro
      }
    } else {
      console.log('debo ir a login')
      // this.router.navigate(['/login'])
    }


        console.log(this.data)
        this.displayedColumns = ['nropersona','tipnip', 'codnip', 'nombrecorto']
        this.service = this.injector.get(XitypayService)
        this.form = this.builder.group({
          xpayctanro: new FormControl<string|null>(this.data.campousuariochar_1),
          codnip: new FormControl<string|null>(null),
          nombre: new FormControl<string|null>(null),
          nropersona: new FormControl<number|null>(null),
        })

        this.buscar()

  }


    override buscar():void {
      super.buscar()
      // const xpayctanro: string  = (this.form.get('xpayctanro')?.value)

      const filtro:PersonaEnCuentaFiltro = this.form.getRawValue()
      filtro.nropersona

      this.service.getPersonasXpayCuentaConFiltroSecured(filtro, this.libEnvService.getConfig().ciaopr.ciaopr, this.xpayctanro, this.data.cant_registros||10, 1).subscribe(
        {
          next: (value:List<personaXpayCuenta>) => {
            console.log(value)
            this.dataSource = value
          },
          error:(err)=> {
              this.dataSource;
              console.log('Hubo un error')
              console.log(err)
              this.dataSource = new List<personaXpayCuenta>
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
      
      const filtro:PersonaEnCuentaFiltro = this.form.getRawValue()
      if (event.pageIndex == this.dataSource.pagina -1) {
        console.log('')
      } else {
          this.service.getPersonasXpayCuentaConFiltroSecured(filtro, this.libEnvService.getConfig().ciaopr.ciaopr, this.xpayctanro, this.data.cant_registros||10, (++event.pageIndex)).subscribe(
            {
              next: (value:List<personaXpayCuenta>) => {
                this.dataSource = value
              },
              error:(err)=> {
                  console.log('Hubo un error')
                  console.log(err)
                  this.dataSource = new List<personaXpayCuenta>
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
class miniXPCuenta{
  xpayctanro: string;
  email: string;
  cuenta_transitoria: string;
  federado_estricto: string;
  nombre: string;
  alias: string;
  email_publico: string;
  url_avatar1: string;
  nombrepersjuridica: string;
  siglaspersjuridica: string;
  nombrecompleto: string;
  nombrecorto: string;
  usr_x_cta: Usrxcta;
}

interface Usrxcta {
  rol_1: string;
}