import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatSelectChange } from '@angular/material/select'
import { Router } from '@angular/router'
import { AliadoLoginData, LibEnvService, LoginService, XPUserLogin, XPUserLoginResponse } from 'personas'
import { Md5 } from 'ts-md5'
import { CookieService } from 'ngx-cookie-service'
// import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { ServicioCompartidoComponent } from '../servicio-compartido/servicio-compartido.component'
import { SnackbarService } from '../snackbar.service'
import jwtDecode from 'jwt-decode'
import { ServicioLocalstorage } from '../servicio-localstorage.service'

import { ListadoXpayCuentasComponent } from 'src/app/shared/listado-xpay-cuentas/listado-xpay-cuentas.component'
import { CambioPassComponent } from 'src/app/shared/cambio-pass/cambio-pass.component'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  logo:string;

  showSpinner:boolean

  defaults:object

  issuer:string

  constructor(
    private servicioCompartido:ServicioCompartidoComponent,
    protected libEnvService: LibEnvService,
    private snack:SnackbarService,
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private libEnv: LibEnvService,
    private cookieService: CookieService,
    public dialog: MatDialog,
    private localStorageService:ServicioLocalstorage) {
  }

  ngOnInit() {

    this.cookieService.delete('token')
    this.localStorageService.deleteItem('1uswK2yh')
    this.localStorageService.deleteItem('HQqS4x2a')

    this.showSpinner=false
    this.logo = this.libEnv.getConfig().logo_1
    this.form = this.formBuilder.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      ciaopr: new FormGroup({
        ciaopr: new FormControl(''),
      }),
      cliente_xp: new FormControl(null)
    })

    // VALOR POR DEFECTO
    this.form.patchValue({
      ciaopr:{
        ciaopr:this.libEnv.getConfig()
      }
    })

    this.issuer = 'xitypay_api_issuer_2025'
  }

  onSelect(event: MatSelectChange) {
    this.libEnvService.setConfig(event.value)
  }

  login() {
    if (this.form.status === 'VALID'){
      this.showSpinner=true
      
      // console.log(`el valor del cliente xp es ${this.form.get('cliente_xp')?.value}`)
      if (this.form.get('cliente_xp')?.value) {
        this.loginUserXp()
        return
      }

      const password = Md5.hashStr(this.form.value.password)

      this.loginService.login(this.libEnvService.getConfig().ciaopr.ciaopr, 
      this.form.value.username, password, 'login.backoffice').subscribe(
        {
          next: (value:string) => {
          this.showSpinner=false
          this.cookieService.set('token', value)
          this.servicioCompartido.jwtData.next(value)
          this.router.navigate(['/']);
        },
        error:(err)=> {
            console.log('Hubo un error con el tema del token')
            console.log(err)
            this.snack.msgSnackBar('Usuario o Contraseña no válidos','OK',undefined,'error')
            this.showSpinner=false
        }
      }
      )
    } else {
      this.snack.msgSnackBar('Debe ingresar Usuario y Contraseña','OK',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  loginUserXp(){
    const password = Md5.hashStr(this.form.value.password)
    const usuarioClub:XPUserLogin={
      ciaopr:this.libEnvService.getConfig().ciaopr.ciaopr,
      alias:this.form.value.username,
      password:password,
      app_name:'backoffice'
    }

    this.loginService.XPUserLoginSecured(this.libEnvService.getConfig().ciaopr.ciaopr,usuarioClub).subscribe({
        next:(loginToken:XPUserLoginResponse)=>{
          this.showSpinner=false
          this.cookieService.set('token', loginToken.token)
          this.servicioCompartido.jwtData.next(loginToken.token)
          const activeXpCuenta:XPLoginResponseDecoded = jwtDecode(loginToken.token) as XPLoginResponseDecoded
          
          if (Md5.hashStr(activeXpCuenta.sub.codnip) === password){
            console.log('debe cambiar contraseña')
            this.dialog.open(CambioPassComponent,{data:activeXpCuenta,width:'700px',height:'450px'}).afterClosed().subscribe(
              (result)=>{
                if (result){
                  this.form.reset()
                }
              }
            )
          } else {
            if (activeXpCuenta.sub.xpaycta.length === 0) {
              return
            } else if (activeXpCuenta.sub.xpaycta.length === 1){
              this.servicioCompartido.xpayCuenta.next(activeXpCuenta.sub.xpaycta[0])
              this.localStorageService.setItem('HQqS4x2a',JSON.stringify(activeXpCuenta))
              this.localStorageService.setItem('1uswK2yh',JSON.stringify(activeXpCuenta.sub.xpaycta[0]))
              this.router.navigate(['/']);
              return
            } else if (activeXpCuenta.sub.xpaycta.length > 1){
              this.dialog.open(ListadoXpayCuentasComponent,{data:activeXpCuenta.sub.xpaycta,width:'400px',height:'600px'}).afterClosed().subscribe(
                (result:miniXPCuenta)=>{
                  if (result.usr_x_cta.rol_1 === 'B' || result.usr_x_cta.rol_1 === 'S') {
                    this.servicioCompartido.xpayCuenta.next(result)
                    this.localStorageService.setItem('HQqS4x2a',JSON.stringify(activeXpCuenta))
                    this.localStorageService.setItem('1uswK2yh',JSON.stringify(result))
                    this.router.navigate(['/']);
                    return
                  } else {
                    this.snack.msgSnackBar('No está autorizado para usar esta aplicación','OK',undefined,'warning')
                    return
                  }
                }
              )
            }
          }


          // this.servicioCompartido.xpayCuenta.next(activeXpCuenta.sub.xpaycta[0])
          // this.localStorageService.setItem('1uswK2yh',JSON.stringify(activeXpCuenta.sub.xpaycta[0]))
          
          // this.router.navigate(['/']);
        },
        error:(err)=> {
            console.log(err)
            this.snack.msgSnackBar('Usuario o Contraseña no válidos','OK',undefined,'error')
            this.showSpinner=false
        }
  })

    this.showSpinner = false


  }



  login2() {
    if (this.form.status === 'VALID'){
      this.showSpinner=true

      // console.log(`el valor del cliente xp es ${this.form.get('cliente_xp')?.value}`)
      if (this.form.get('cliente_xp')?.value) {
        this.loginUserXp()
        return
      }

      const password = Md5.hashStr(this.form.value.password)

      this.loginService.loginAuth(this.libEnvService.getConfig().ciaopr.ciaopr, 
      this.form.value.username, password, 'login.backoffice',this.issuer).subscribe(
        {
          next: (value:string) => {
          this.showSpinner=false
          this.cookieService.set('token', value)
          this.servicioCompartido.jwtData.next(value)
          this.router.navigate(['/']);
        },
        error:(err)=> {
            console.log('Hubo un error con el tema del token')
            console.log(err)
            this.snack.msgSnackBar('Usuario o Contraseña no válidos','OK',undefined,'error')
            this.showSpinner=false
        }
      }
      )
    } else {
      this.snack.msgSnackBar('Debe ingresar Usuario y Contraseña','OK',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }


  aliadoLogin():void{
    if (this.form.status === 'VALID'){
      this.showSpinner=true
      
      const password = Md5.hashStr(this.form.value.password)
      const dataAliado:AliadoLoginData={
        ciaopr:this.libEnvService.getConfig().ciaopr.ciaopr,
        username:this.form.value.username,
        password:password
      }

      this.loginService.aliadoLogin(this.libEnvService.getConfig().ciaopr.ciaopr, 
      dataAliado).subscribe(
        {
          next: (value:string) => {
          this.showSpinner=false
          this.cookieService.set('token', value)
          // console.log('la data del token es ')
          // console.log(value)
          this.servicioCompartido.jwtData.next(value)
          this.router.navigate(['/']);
        },
        error:(err)=> {
            console.log('Hubo un error con el tema del token')
            console.log(err)
            this.snack.msgSnackBar('Usuario o Contraseña no válidos','OK',undefined,'error')
            this.showSpinner=false
        }
      }
      )
    } else {
      this.snack.msgSnackBar('Debe ingresar Usuario y Contraseña','OK',undefined,'warning')
      this.form.markAllAsTouched()
    }

  }

  logout(): void {
    this.cookieService.delete('token')
  }

  getToken(): string {
    return this.cookieService.get('token')
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}

export class LoginRequest {
  ciaopr: string
}



class XPLoginResponseDecoded{
  sub:MiniUsuario
}

class MiniUsuario{
  xpaycta:miniXPCuenta[]
  alias:string
  codnip:string
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