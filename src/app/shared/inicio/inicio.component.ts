import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../utils.service';
import { Router } from '@angular/router';
import { ServicioCompartidoComponent } from 'src/app/layout/servicio-compartido/servicio-compartido.component';
import { Subscription } from 'rxjs';
import { ServicioLocalstorage } from 'src/app/layout/servicio-localstorage.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{

  // router:Router = new Router()
  util:UtilsService = new UtilsService()
  modoCliente = false
  cliente:miniXPCuenta|null
  subscription:Subscription
  titulo:string
  modoUsuario:string

  constructor(
    private servicioCompartido:ServicioCompartidoComponent,
    private localStorageService:ServicioLocalstorage,
    private router:Router
  ){}

  newTab(url:string):void{
    this.util.openRouteNewTab(url)
  }

  ngOnInit(): void {

    this.subscription = this.servicioCompartido.getJwtData().subscribe((e)=>console.log("EN INICIO",e))
    
    const data = this.localStorageService.getItem('1uswK2yh')
    const genData = this.localStorageService.getItem('HQqS4x2a')

    if (data && genData) {
      const parsedData:miniXPCuenta = JSON.parse(data)
      if (parsedData.xpayctanro){
        console.log(parsedData)
        this.modoCliente = true
        this.titulo = parsedData.nombre
        this.modoUsuario = parsedData.usr_x_cta.rol_1
      }
    } else {
      this.router.navigate(['/login'])
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