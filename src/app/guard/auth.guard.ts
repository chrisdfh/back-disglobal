import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuar {

  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): | 
    Observable<boolean | UrlTree>| 
    Promise<boolean | UrlTree>|
    boolean |
    UrlTree {

    if(this.cookieService.get('token')){
      return true
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
  
}
