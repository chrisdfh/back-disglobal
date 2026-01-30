import { Injectable } from '@angular/core';
import { HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { JwtData } from '../../app.component';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoGenericoComponent } from '../borrame/catalogo-generico/catalogo-generico.component';

@Injectable()
export class InterceptorService implements HttpInterceptor {


 constructor(public router: Router,public cookieService: CookieService, private dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwtToken = this.cookieService.get('token');
        if (jwtToken) {
            const jwt:JwtData = jwtDecode(jwtToken)

            // Si el token ha expirado CERRAR SESION
            if (jwt.exp && jwt.exp <= Date.now() / 1000) {
                console.log('Sesión expirada');
                this.dialog.closeAll();
                this.dialog.open(CatalogoGenericoComponent,
                    {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
                    data: this.dataDialogo("Sesión Expirada","Su sesión ha expirado, vuelva a iniciar sesión","Aceptar")}
                )
                this.logout();
            } else {
                const expDate = new Date(jwt.exp*1000)
                console.log(expDate)
            }

            // Si el token no ha expirado, agregarlo al request
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
        } else {
            this.logout()
        }
        return next.handle(request)
    }

    logout(){
        this.cookieService.delete('token')
        this.router.navigate(['/login']);
    }

    dataDialogo(titulo:string,mensaje?:string,textoBotonTrue?:string,textoBotonFalse?:string,cantRegistros?:number,opciones?:string){
      return {
        "titulo":titulo,
        "msg":mensaje || '',
        "btn_true_text":textoBotonTrue || 'Aceptar',
        "btn_false_text":textoBotonFalse || 'Cancelar',
        "cant_registros": cantRegistros || 25,
        "campousuariochar_1":opciones || undefined
      }
    }
}
