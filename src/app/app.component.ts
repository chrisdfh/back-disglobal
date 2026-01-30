import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { ServicioCompartidoComponent } from './layout/servicio-compartido/servicio-compartido.component';
import { LibEnvService } from 'personas';
import { Location } from '@angular/common'
import { ServicioLocalstorage } from './layout/servicio-localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  tituloPagina = 'BackOffice'
  title = 'back';
  showFiller = true;
  jwtTokenDecoded: JwtData
  username:string
  subscription:Subscription

  name:string
  appVersion:number|string

  currentXpCuenta:miniXPCuenta|null
  
  constructor(
    private router: Router,
    private servicioCompartido:ServicioCompartidoComponent,
    private cookieService: CookieService,
    private libEnvService: LibEnvService,
    private location: Location,
    private localStorageService:ServicioLocalstorage

    ) { }

ngOnInit(): void {
    this.subscription = this.servicioCompartido.getJwtData().subscribe((e)=>this.cargaNombreUsuario(e))
    this.subscription = this.servicioCompartido.getXpayCuenta().subscribe((e)=>this.xpCuenta(e))
    // this.cargaNombreUsuario()
    this.setTopBarName(this.libEnvService.getConfig().app_name,this.libEnvService.getConfig().app_compile_date)


    const data = this.localStorageService.getItem('1uswK2yh')
    const genData = this.localStorageService.getItem('HQqS4x2a')

    if (data && genData) {
      const parsedData:miniXPCuenta = JSON.parse(data)
      const parsedGenData = JSON.parse(genData)
      if (parsedData.xpayctanro){
        this.cargaNombreLs(parsedGenData.usuario.nombrecorto)
      }
    } else {
      console.log('debo ir a login')
      this.router.navigate(['/login'])
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  xpCuenta(e:unknown){
    const cta = e as miniXPCuenta
    this.currentXpCuenta = cta
  }
  logOut():void{
    this.cookieService.delete('token')
    this.localStorageService.deleteItem('1uswK2yh')
    this.router.navigate(['/login'])
  }

  cargaNombreUsuario(token:unknown):void{
    // this.jwtTokenDecoded = jwtDecode( this.cookieService.get('token') )
    if (typeof token !== 'string') return
    this.jwtTokenDecoded = jwtDecode(token)
    // console.log(this.jwtTokenDecoded)
    this.username=this.jwtTokenDecoded.name !== undefined ? this.jwtTokenDecoded.name : this.jwtTokenDecoded.sub.nombrecorto
  }
  cargaNombreLs(name:string):void{
    this.username=name
  }

  routeTo(path: string):void {
    location.href = path
  }

  shouldShowMenu(): boolean {
    // const currentRoute = this.router.url;
    const currentRoute = this.location.path();
    // console.log(currentRoute)
    const urlState = !currentRoute.includes('login');
    // console.log(urlState)
    return urlState;
  }

  setTopBarName(name:string,version?:(number|string)):void{
    if (version){
      this.appVersion=version
    }
    this.name=name
  }
}

export class JwtData  {
  exp: number
  iat: number
  name: string
  username: string
  sub:MiniUsuario
}
class MiniUsuario{
  nombrecorto:string
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