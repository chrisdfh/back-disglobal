import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaComponent } from './persona/datos_basicos/persona/persona.component';
import { InicioComponent } from './shared/inicio/inicio.component';
import { LibEnvService, PersonasModule } from 'personas';
import { PersonaJuridicaComponent } from './persona/datos_basicos/persona-juridica/persona-juridica.component';
import { AliadoComponent } from './aliado/datos_basicos/aliado/aliado.component';
import { OfertaComponent } from './aliado/datos_basicos/oferta/oferta.component';
import { LoginComponent } from './layout/login/login.component';
import { AuthGuar } from './guard/auth.guard';
import { AfiliadoComponent } from './afiliado/datos_basicos/afiliado/afiliado.component';
import { AliadoOfertaComponent } from './aliado/datos_basicos/aliado-oferta/aliado-oferta.component';
import { AliadoGrillaComponent } from './aliado/datos_basicos/aliado-grilla/aliado-grilla.component';
import { ListadoDestacadosComponent } from './aliado/datos_basicos/listado-destacados/listado-destacados.component';
import { CambioContrasenaComponent } from './aliado/datos_basicos/cambio-contrasena/cambio-contrasena.component';
import { TaskerComponent } from './tasker/datos_basicos/tasker/tasker.component';
import { ServicioComponent } from './tasker/datos_basicos/servicio/servicio.component';
import { SolicitudRegistroAliadoComponent } from './aliado/datos_basicos/solicitud-registro-aliado/solicitud-registro-aliado.component';
import { SolicitudRegistroTaskerComponent } from './tasker/datos_basicos/solicitud-registro-tasker/solicitud-registro-tasker.component';
import { AfiliadoReinicioContrasenaComponent } from './afiliado/datos_basicos/afiliado-reinicio-contrasena/afiliado-reinicio-contrasena.component';
import { CambioContrasenaUsuariosComponent } from './shared/cambio-contrasena-usuarios/cambio-contrasena-usuarios.component';
import { CambioCorreoPrincipalComponent } from './shared/cambio-correo-principal/cambio-correo-principal.component';
import { CambioAliasComponent } from './shared/cambio-alias/cambio-alias.component';
import { XitypayComponent } from './xitypay/datos_basicos/xitypay/xitypay.component';
import { ExchangeCurrencyComponent } from './xitypay/datos_basicos/exchange-currency/exchange-currency.component';
import { UsuariosXitypayComponent } from './xitypay/datos_basicos/usuarios-xitypay/usuarios-xitypay.component';
import { PersonasXitypayComponent } from './xitypay/datos_basicos/personas-xitypay/personas-xitypay.component';
import { AdministrarUsuariosComponent } from './shared/administrar-usuarios/administrar-usuarios.component';
import { DestacadosHomeComponent } from './aliado/datos_basicos/destacados-home/destacados-home.component';
import { UpdateContrasenaComponent } from './shared/update-contrasena/update-contrasena.component';
import { TransaccionesComponent } from './xitypay/datos_basicos/transacciones/transacciones.component';
import { CreaUsuarioXpComponent } from './xitypay/datos_basicos/crea-usuario-xp/crea-usuario-xp.component';
import { PlanCuentaComponent } from './xitypay/datos_basicos/plan-cuenta/plan-cuenta.component';
import { ConfiguracionXpComponent } from './xitypay/datos_basicos/configuracion-xp/configuracion-xp.component';
import { MonedaComponent } from './xitypay/datos_basicos/moneda/moneda.component';
import { MonedasXCuentaComponent } from './xitypay/datos_basicos/monedas-x-cuenta/monedas-x-cuenta.component';
import { CuentaSypagoComponent } from './xitypay/datos_basicos/cuenta-sypago/cuenta-sypago.component';
import { ConfigSmsComponent } from './xitypay/datos_basicos/config-sms/config-sms.component';
import { ProveedoresComponent } from './xitypay/datos_basicos/proveedores/proveedores.component';
import { PlantillasXitypayComponent } from './xitypay/datos_basicos/plantillas-xitypay/plantillas-xitypay.component';
import { ActivarPosPecComponent } from './xitypay/datos_basicos/activar-pos-pec/activar-pos-pec.component';
import { CambioIdComponent } from './xitypay/datos_basicos/cambio-id/cambio-id.component';
import { PlanXCuentaComponent } from './xitypay/datos_basicos/plan-x-cuenta/plan-x-cuenta.component';
import { InformacionBancariaComponent } from './xitypay/datos_basicos/informacion-bancaria/informacion-bancaria.component';

// export function initAppFn(envService: LibEnvService) {
//   return async() =>  {
//     console.log("Calculo esto sea 1")
//     envService.load()
//   }
// }

export function initAppFn(envService: LibEnvService): ()=> Promise<string> {
  return () =>  {
    return envService.load()
  }
}

const routes: Routes = [
  {
    path: "",
    title:"BackOffice",
    component:InicioComponent,
    canActivate: [AuthGuar]
  },
  {
    path: "login",
    children:[
      {
        path: "",
        component: LoginComponent,
      }
    ]
  },
  {
    path: "persona",
    title:"XC Pers",
    children:[
      {
        path: "",
        component: PersonaComponent,
        canActivate: [AuthGuar]
      }
    ],
  },
  {
    path: "personajuridica",
    title:"XC Pers J",
    children:[
      {
        path: "",
        component: PersonaJuridicaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "afiliado",
    title:"XC Afil Ver",
    children:[
      {
        path: "",
        component: AfiliadoComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "aliado",
    title:"XC Aliado",
    children:[
      {
        path: "",
        component: AliadoComponent,
      },
      {
        path: ":nroaliado",
        component: AliadoComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "registro-aliado",
    title:"XC Aliad Reg",
    children:[
      {
        path: "",
        component: SolicitudRegistroAliadoComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "oferta",
    title:"XC Ofrt",
    children:[
      {
        path: "",
        component: OfertaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "oferta-aliado",
    title:"XC Ofrt Aliado",
    children:[
      {
        path: "",
        component: AliadoOfertaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "grilla",
    title:"XC Grilla",
    children:[
      {
        path: "",
        component: AliadoGrillaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "listado-destacados",
    title:"XC Dest",
    children:[
      {
        path: "",
        component: ListadoDestacadosComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "cambia-passwd",
    title:"Pssw Reset",
    children:[
      {
        path: "",
        component: CambioContrasenaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "tasker",
    title:"XT Tasker",
    children:[
      {
        path: "",
        component: TaskerComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "registro-tasker",
    title:"XC Tasker Reg",
    children:[
      {
        path: "",
        component: SolicitudRegistroTaskerComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "servicio",
    title:"XT Servs",
    children:[
      {
        path: "",
        component: ServicioComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "afiliado-cambia-passwd",
    title:"Pssw Cmb",
    children:[
      {
        path: "",
        component: AfiliadoReinicioContrasenaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "password-reset",
    title:"Pssw Reset",
    children:[
      {
        path: "",
        component: CambioContrasenaUsuariosComponent,
      },
      {
        path: ":nrousuario",
        component: CambioContrasenaUsuariosComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "password-change",
    title:"Pssw Cmb",
    children:[
      {
        path: "",
        component: UpdateContrasenaComponent,
      },
      {
        path: ":nrousuario",
        component: UpdateContrasenaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "email-change",
    title:"Mail Cmb",
    children:[
      {
        path: "",
        component: CambioCorreoPrincipalComponent,
      },
      {
        path: ":nrousuario",
        component: CambioCorreoPrincipalComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "username-change",
    title:"Alias Cmb",
    children:[
      {
        path: "",
        component: CambioAliasComponent,
      },
      {
        path: ":nrousuario",
        component: CambioAliasComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "xitypay",
    title:"XP Cta",
    children:[
      {
        path: "",
        component: XitypayComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "create-user-xitypay",
    title:"XP Crea Usuario",
    children:[
      {
        path: "",
        component: CreaUsuarioXpComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "user-xitypay",
    title:"XP User",
    children:[
      {
        path: "",
        component: UsuariosXitypayComponent,
      },{
        path: ":xpaycta",
        component: UsuariosXitypayComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "persona-xitypay",
    title:"XP Pers",
    children:[
      {
        path: "",
        component: PersonasXitypayComponent,
      },
      {
        path: ":xpaycta",
        component: PersonasXitypayComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "currency",
    title:"XP Tasas",
    children:[
      {
        path: "",
        component: ExchangeCurrencyComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "users",
    title:"Usuarios",
    children:[
      {
        path: "",
        component: AdministrarUsuariosComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "home-destacados",
    title:"XC Dest Hom",
    children:[
      {
        path: "",
        component: DestacadosHomeComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "oferta/:nroaliado/:nrooferta",
    title:"XC Ofrt",
    children:[
      {
        path: "",
        component: OfertaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "transacciones",
    title:"XC Trans",
    children:[
      {
        path: "",
        component: TransaccionesComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "plan-cuenta",
    title:"XC Plan",
    children:[
      {
        path: "",
        component: PlanCuentaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "conf-xp",
    title:"XP Conf",
    children:[
      {
        path: "",
        component: ConfiguracionXpComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "monedas",
    title:"XP Monedas",
    children:[
      {
        path: "",
        component: MonedaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "monedas-x-cuenta",
    title:"XP Monedas X Cuenta",
    children:[
      {
        path: "",
        component: MonedasXCuentaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "cuentas-sypago",
    title:"XP CTA Sypago",
    children:[
      {
        path: "",
        component: CuentaSypagoComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "smsconfig",
    title:"XP SMS Config",
    children:[
      {
        path: "",
        component: ConfigSmsComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "xp-api-provider",
    title:"XP API PROV",
    children:[
      {
        path: "",
        component: ProveedoresComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "xp-plantillas",
    title:"XP PLANTILLAS",
    children:[
      {
        path: "",
        component: PlantillasXitypayComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "activar-pec",
    title:"ACTIVAR PEC",
    children:[
      {
        path: "",
        component: ActivarPosPecComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "cambiar-id",
    title:"Cambiar ID",
    children:[
      {
        path: "",
        component: CambioIdComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "plan-x-cuenta",
    title:"Planes X Cuenta",
    children:[
      {
        path: "",
        component: PlanXCuentaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
  {
    path: "informacion-bancaria",
    title:"Información Bancaria",
    children:[
      {
        path: "",
        component: InformacionBancariaComponent,
      }
    ],
    canActivate: [AuthGuar]
  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" }), PersonasModule],
  exports: [RouterModule],
  providers: [
    LibEnvService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [LibEnvService]
    }
  ]
})
export class AppRoutingModule { }
