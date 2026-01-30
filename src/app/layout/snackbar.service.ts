import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar
    ) { }

  /**
   * Genera un aviso en la parte inferior de la pantalla
   * @param msg Mensaje a mostrar
   * @param txtBtn Texto del botón
   * @param tiempoPantalla Tiempo que permanece visible (default 3000ms)
   * @param style Combinación de colores (info,success,warning o error)
   */
  msgSnackBar(msg:string,txtBtn:string,tiempoPantalla?:number,style?:string):void{
    const snackConfig = new MatSnackBarConfig()
      // snackConfig.duration = tiempoPantalla || 3000
      snackConfig.duration = 5000
      snackConfig.panelClass = style || ''

    this._snackBar.open(msg,txtBtn,snackConfig)
  }
  
}
