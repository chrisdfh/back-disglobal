import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService{
  
  private router:Router


  openRouteNewTab(route: string):void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route])
    );
    window.open(url, '_blank');
  }



  printLog(msg:string):void {
    console.log(msg)    
  }
}


