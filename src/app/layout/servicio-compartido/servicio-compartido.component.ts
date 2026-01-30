import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-servicio-compartido',
  template: '<div></div>',
})

// SERVICIO INTERMEDIO QUE ENVÍA DATA AL APP.COMPONENT
@Injectable({
  providedIn: 'root'
})
export class ServicioCompartidoComponent {
  jwtData = new Subject()
  xpayCuenta = new Subject()

  getJwtData(){
      return this.jwtData.asObservable()
  }

  getXpayCuenta(){
    return this.xpayCuenta.asObservable()
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