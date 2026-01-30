import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PersonasModule } from 'personas'
import { VcoreModule } from 'vcore'
import { AliadosModule } from 'aliados'
import { ReactiveFormsModule } from '@angular/forms'

import { MatFormFieldModule } from '@angular/material/form-field'
import { PersonaComponent } from './persona/datos_basicos/persona/persona.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { InicioComponent } from './shared/inicio/inicio.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { MatDialogModule } from '@angular/material/dialog'
import { MatPaginatorModule,MatPaginatorIntl } from '@angular/material/paginator'
import { CatalogoComponent } from './shared/borrame/catalogo/catalogo.component'
import { CatalogoPersonaComponent } from './shared/borrame/catalogo-persona/catalogo-persona.component'
import { CallbackPipe } from './shared/callback/callback.pipe'
import { PersonaJuridicaComponent } from './persona/datos_basicos/persona-juridica/persona-juridica.component'
import { CatalogoOcupacionActividadComponent } from './shared/borrame/catalogo-ocupacion-actividad/catalogo-ocupacion-actividad.component'
import { AliadoComponent } from './aliado/datos_basicos/aliado/aliado.component'
import { OfertaComponent } from './aliado/datos_basicos/oferta/oferta.component'
import { CatalogoLocalidadComponent } from './shared/borrame/catalogo-localidad/catalogo-localidad.component'
import { CatalogoGenericoComponent } from './shared/borrame/catalogo-generico/catalogo-generico.component'
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { paginadorIdioma } from './shared/borrame/paginador-idioma'
import { LoginComponent } from './layout/login/login.component'
import { AuthGuar } from './guard/auth.guard'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { CdkDropList,CdkDrag,CdkDragHandle } from '@angular/cdk/drag-drop';
import { CatalogoOfertaComponent } from './shared/borrame/catalogo-oferta/catalogo-oferta.component';
import { CatalogoAliadoComponent } from './shared/borrame/catalogo-aliado/catalogo-aliado.component'

// import { NgxEditorModule } from 'ngx-editor'
// PARA EL DATEPICKER
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
// NECESARIO PARA CAMBIAR EL LOCALE QUE SIEMPRE MUESTRE DD/MM/AAAA
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { MAT_DATE_LOCALE } from '@angular/material/core';


import { ServicioCompartidoComponent } from './layout/servicio-compartido/servicio-compartido.component';
import { AfiliadoComponent } from './afiliado/datos_basicos/afiliado/afiliado.component';
import { AliadoOfertaComponent } from './aliado/datos_basicos/aliado-oferta/aliado-oferta.component';
import { CatalogoAliadoOfertaComponent } from './shared/borrame/catalogo-aliado-oferta/catalogo-aliado-oferta.component';

import { QuillModule } from 'ngx-quill';
import { AliadoGrillaComponent } from './aliado/datos_basicos/aliado-grilla/aliado-grilla.component';
import { VentanaCrearGrillaComponent } from './shared/borrame/ventana-crear-grilla/ventana-crear-grilla.component';
import { ListadoDestacadosComponent } from './aliado/datos_basicos/listado-destacados/listado-destacados.component';
import { EditaGillaComponent } from './shared/borrame/edita-gilla/edita-gilla.component';
import { DestacaOfertaRangoComponent } from './shared/borrame/destaca-oferta-rango/destaca-oferta-rango.component';
import { CambioContrasenaComponent } from './aliado/datos_basicos/cambio-contrasena/cambio-contrasena.component';
import { CatalogoOfertaRangofechaComponent } from './shared/borrame/catalogo-oferta-rangofecha/catalogo-oferta-rangofecha.component';
import { TaskerComponent } from './tasker/datos_basicos/tasker/tasker.component';
import { CatalogoCategoriaTaskerComponent } from './shared/borrame/catalogo-categoria-tasker/catalogo-categoria-tasker.component';
import { CatalogoTaskerComponent } from './shared/borrame/catalogo-tasker/catalogo-tasker.component';
import { ServicioComponent } from './tasker/datos_basicos/servicio/servicio.component';
import { CatalogoServicioTaskerComponent } from './shared/borrame/catalogo-servicio-tasker/catalogo-servicio-tasker.component';
import { CatalogoAliadoTemporalComponent } from './shared/borrame/catalogo-aliado-temporal/catalogo-aliado-temporal.component';
import { SolicitudRegistroAliadoComponent } from './aliado/datos_basicos/solicitud-registro-aliado/solicitud-registro-aliado.component';
import { SolicitudRegistroTaskerComponent } from './tasker/datos_basicos/solicitud-registro-tasker/solicitud-registro-tasker.component';
import { CatalogoTaskerTemporalComponent } from './shared/borrame/catalogo-tasker-temporal/catalogo-tasker-temporal.component';
import { AfiliadoReinicioContrasenaComponent } from './afiliado/datos_basicos/afiliado-reinicio-contrasena/afiliado-reinicio-contrasena.component';
import { CatalogoAfiliadoComponent } from './shared/borrame/catalogo-afiliado/catalogo-afiliado.component';
import { CambioContrasenaUsuariosComponent } from './shared/cambio-contrasena-usuarios/cambio-contrasena-usuarios.component';
import { CambioCorreoPrincipalComponent } from './shared/cambio-correo-principal/cambio-correo-principal.component';
import { CambioAliasComponent } from './shared/cambio-alias/cambio-alias.component';
import { CatalogoHashtagsComponent } from './shared/borrame/catalogo-hashtags/catalogo-hashtags.component';
import { XitypayComponent } from './xitypay/datos_basicos/xitypay/xitypay.component';
import { ExchangeCurrencyComponent } from './xitypay/datos_basicos/exchange-currency/exchange-currency.component';
import { UsuariosXitypayComponent } from './xitypay/datos_basicos/usuarios-xitypay/usuarios-xitypay.component';
import { PersonasXitypayComponent } from './xitypay/datos_basicos/personas-xitypay/personas-xitypay.component';
import { CatalogoUsuariosComponent } from './shared/borrame/catalogo-usuarios/catalogo-usuarios.component';
import { CatalogoXpaycuentaComponent } from './shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { EditarPersonaEnCuentaComponent } from './shared/editar-persona-en-cuenta/editar-persona-en-cuenta';
import { AdministrarUsuariosComponent } from './shared/administrar-usuarios/administrar-usuarios.component';
import { DestacadosHomeComponent } from './aliado/datos_basicos/destacados-home/destacados-home.component';
import { UpdateContrasenaComponent } from './shared/update-contrasena/update-contrasena.component';
import { TransaccionesComponent } from './xitypay/datos_basicos/transacciones/transacciones.component';
import { DetalleTransaccionComponent } from './shared/detalle-transaccion/detalle-transaccion.component';
import { CreaUsuarioXpComponent } from './xitypay/datos_basicos/crea-usuario-xp/crea-usuario-xp.component';
import { CatalogoPlanCuentaXpComponent } from './shared/borrame/catalogo-plan-cuenta-xp/catalogo-plan-cuenta-xp.component';
import { PlanCuentaComponent } from './xitypay/datos_basicos/plan-cuenta/plan-cuenta.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { InterceptorService } from './shared/interceptor/interceptorService';
import { CatalogoPersonasEnCuentaComponent } from './shared/borrame/catalogo-personas-en-cuenta/catalogo-personas-en-cuenta.component';
import { UploadArchivosComponent } from './shared/upload-archivos/upload-archivos.component';
import { ConfiguracionXpComponent } from './xitypay/datos_basicos/configuracion-xp/configuracion-xp.component';
import { MonedaComponent } from './xitypay/datos_basicos/moneda/moneda.component';
import { EditarMonedaXitypayComponent } from './shared/editar-moneda-xitypay/editar-moneda-xitypay.component';
import { MonedasXCuentaComponent } from './xitypay/datos_basicos/monedas-x-cuenta/monedas-x-cuenta.component';
import { CatalogoMonedasComponent } from './shared/borrame/catalogo-monedas/catalogo-monedas.component';
import { CuentaSypagoComponent } from './xitypay/datos_basicos/cuenta-sypago/cuenta-sypago.component';
import { EditarCuentaSypagoComponent } from './shared/editar-cuenta-sypago/editar-cuenta-sypago.component';
import { CatalogoConfigSmsComponent } from './shared/borrame/catalogo-config-sms/catalogo-config-sms.component';
import { ConfigSmsComponent } from './xitypay/datos_basicos/config-sms/config-sms.component';
import { ProveedoresComponent } from './xitypay/datos_basicos/proveedores/proveedores.component';
import { CatalogoApiProviderComponent } from './shared/borrame/catalogo-api-provider/catalogo-api-provider.component';
import { CatalogoPlantillaComponent } from './shared/borrame/catalogo-plantilla/catalogo-plantilla.component';
import { PlantillasXitypayComponent } from './xitypay/datos_basicos/plantillas-xitypay/plantillas-xitypay.component';
import { PreviewHtmlComponent } from './shared/preview-html/preview-html.component';
import { ActivarPosPecComponent } from './xitypay/datos_basicos/activar-pos-pec/activar-pos-pec.component';
import { ActivarPersonaEnCuentaPosComponent } from './shared/activar-persona-en-cuenta-pos/activar-persona-en-cuenta-pos.component';
import { CambioIdComponent } from './xitypay/datos_basicos/cambio-id/cambio-id.component';
import { ListadoXpayCuentasComponent } from './shared/listado-xpay-cuentas/listado-xpay-cuentas.component';
import { PlanXCuentaComponent } from './xitypay/datos_basicos/plan-x-cuenta/plan-x-cuenta.component';
import { InformacionBancariaComponent } from './xitypay/datos_basicos/informacion-bancaria/informacion-bancaria.component';
import { CambioPassComponent } from './shared/cambio-pass/cambio-pass.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonaComponent,
    InicioComponent,
    CatalogoComponent,
    CatalogoPersonaComponent,
    CallbackPipe,
    PersonaJuridicaComponent,
    CatalogoOcupacionActividadComponent,
    AliadoComponent,
    OfertaComponent,
    CatalogoLocalidadComponent,
    CatalogoGenericoComponent,
    LoginComponent,
    CatalogoOfertaComponent,
    CatalogoAliadoComponent,
    ServicioCompartidoComponent,
    AfiliadoComponent,
    AliadoOfertaComponent,
    CatalogoAliadoOfertaComponent,
    AliadoGrillaComponent,
    VentanaCrearGrillaComponent,
    ListadoDestacadosComponent,
    EditaGillaComponent,
    DestacaOfertaRangoComponent,
    CambioContrasenaComponent,
    CatalogoOfertaRangofechaComponent,
    TaskerComponent,
    CatalogoCategoriaTaskerComponent,
    CatalogoTaskerComponent,
    ServicioComponent,
    CatalogoServicioTaskerComponent,
    CatalogoAliadoTemporalComponent,
    SolicitudRegistroAliadoComponent,
    SolicitudRegistroTaskerComponent,
    CatalogoTaskerTemporalComponent,
    AfiliadoReinicioContrasenaComponent,
    CatalogoAfiliadoComponent,
    CambioContrasenaUsuariosComponent,
    CambioCorreoPrincipalComponent,
    CambioAliasComponent,
    CatalogoHashtagsComponent,
    XitypayComponent,
    ExchangeCurrencyComponent,
    UsuariosXitypayComponent,
    PersonasXitypayComponent,
    CatalogoUsuariosComponent,
    CatalogoXpaycuentaComponent,
    EditarPersonaEnCuentaComponent,
    AdministrarUsuariosComponent,
    DestacadosHomeComponent,
    UpdateContrasenaComponent,
    TransaccionesComponent,
    DetalleTransaccionComponent,
    CreaUsuarioXpComponent,
    CatalogoPlanCuentaXpComponent,
    PlanCuentaComponent,
    CatalogoPersonasEnCuentaComponent,
    UploadArchivosComponent,
    ConfiguracionXpComponent,
    MonedaComponent,
    EditarMonedaXitypayComponent,
    MonedasXCuentaComponent,
    CatalogoMonedasComponent,
    CuentaSypagoComponent,
    EditarCuentaSypagoComponent,
    CatalogoConfigSmsComponent,
    ConfigSmsComponent,
    ProveedoresComponent,
    CatalogoApiProviderComponent,
    CatalogoPlantillaComponent,
    PlantillasXitypayComponent,
    PreviewHtmlComponent,
    ActivarPosPecComponent,
    ActivarPersonaEnCuentaPosComponent,
    CambioIdComponent,
    ListadoXpayCuentasComponent,
    PlanXCuentaComponent,
    InformacionBancariaComponent,
    CambioPassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PersonasModule,
    VcoreModule,
    AliadosModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,

    MatPaginatorModule,
    MatDialogModule,

    MatSnackBarModule,
    MatProgressSpinnerModule,

    CdkDropList,
    CdkDrag,
    CdkDragHandle,

    // NgxEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatMomentDateModule,

    QuillModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ve'},
    // {provide: MAT_DATE_FORMATS,useValue: {display: {dateInput: 'DD-MM-YYYY'}},
  // },

    // VALORES POR DEFAULT PARA DIALOGOS->CATALOGOS
    {provide:MAT_DIALOG_DEFAULT_OPTIONS,
    useValue:{maxWidth: '95%', width: '100%', maxHeight: '95%', height: '90%'}},
    {provide:ServicioCompartidoComponent},

    // TRADUCCIÓN PARA EL PAGINADOR
    {provide:MatPaginatorIntl,useValue:paginadorIdioma()},
    {provide: AuthGuar},

    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.setDefaultFontSetClass('material-icons-outlined');
  }
}
