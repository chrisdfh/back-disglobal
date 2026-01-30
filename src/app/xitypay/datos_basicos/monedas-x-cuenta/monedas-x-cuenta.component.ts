import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { XitypayService, XpayCuenta, XpayMoneda, XpayMonedaXCuenta } from 'aliados';
import { LibEnvService, List } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoMonedasComponent } from 'src/app/shared/borrame/catalogo-monedas/catalogo-monedas.component';
import { CatalogoXpaycuentaComponent } from 'src/app/shared/borrame/catalogo-xpaycuenta/catalogo-xpaycuenta.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-monedas-x-cuenta',
  templateUrl: './monedas-x-cuenta.component.html',
  styleUrls: ['./monedas-x-cuenta.component.css']
})
export class MonedasXCuentaComponent extends CrudImpl implements OnInit{

  @ViewChild('top') top:ElementRef
  ciaopr:string
  dataSource = new List<XpayMonedaXCuenta>()
  displayedColumns = ['moneda','nombre','valor','activo','boton']
  xpaycta:XpayCuenta = new XpayCuenta()

  constructor(
    private service:XitypayService,
    private libEnvService:LibEnvService,
    private dialog: MatDialog,
    private snack: SnackbarService
  ){
    super()
  }

  ngOnInit(): void {
      this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
      this.catalogoXpayCta()
  }

  catalogoXpayCta():void{
    this.dialog.open(CatalogoXpaycuentaComponent,{data:this.dataDialogo('Búsqueda de Cuenta de XityPay',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        this.xpaycta = result
        this.getMonedasXCuenta()
      } else {
        this.dataSource = new List<XpayMonedaXCuenta>()
        this.xpaycta = new XpayCuenta()
      }
    })    
  }

  getMonedasXCuenta(page?:number,cant?:number):void{
    page = page ? page : 1
    cant = cant ? cant : 15
    if (this.xpaycta === undefined || this.xpaycta.xpayctanro=== undefined) {
      this.dataSource = new List<XpayMonedaXCuenta>()
      return
    }
    this.service.getMonedasXCuenta(this.libEnvService.getConfig().ciaopr.ciaopr,this.xpaycta.xpayctanro,cant,page).subscribe({
      next:(resp)=>{
        this.dataSource = resp
        console.log(resp.results)

      },
      error:(err)=>{

        this.dataSource = new List<XpayMonedaXCuenta>()
        this.snack.msgSnackBar(`Error al consutar moneda(s) para la cuenta ${this.xpaycta.nombrecorto}`,'OK',undefined,'error')
        console.log(err)
      }
    })
  }

  catalogoMonedas():void{
    this.dialog.open(CatalogoMonedasComponent,{data:this.dataDialogo('Búsqueda de Monedas',undefined,undefined,undefined,25)}).afterClosed().subscribe((result)=>{
      if (result){
        if (this.xpaycta === undefined || this.xpaycta.xpayctanro=== undefined) {
          return
        }
        this.showSpinner = true
        this.service.asociaMonedaXCuenta(this.ciaopr,result,this.xpaycta.xpayctanro).subscribe({
          next: () => {
            this.snack.msgSnackBar('Moneda asociada correctamente', 'Ok', undefined, 'success')
            this.getMonedasXCuenta()
          },
          error: (e) => {
            console.log(e.error)
            this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')
            this.showSpinner = false
          },complete:()=>{this.showSpinner = false}
        })
      }
    })
  }

  removeMonedaDeCuenta(moneda:XpayMoneda):void{
    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Eliminar Registro",`Está seguro de que desea eliminar el registro de la moneda ${moneda.nombre} (${moneda.moneda})`,"Eliminar")}).afterClosed().subscribe(
        {next:(result)=>{
          if (result) {
            if (this.xpaycta === undefined || this.xpaycta.xpayctanro=== undefined) {
              return
            }
            this.showSpinner = true
            this.service.deleteMonedaXCuenta(this.ciaopr,moneda.moneda,this.xpaycta.xpayctanro).subscribe({
              next: () => {
                  this.snack.msgSnackBar('Moneda eliminada correctamente', 'Ok', undefined, 'success')
                  this.getMonedasXCuenta()
              },
              error: (e) => {
                console.log(e.error)
                this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')

                this.showSpinner = false
              },
              complete: ()=>{
                this.showSpinner = false
              }
            })
          }
        }}
      )
  }

  onPageChange(event:PageEvent):void{
        this.getMonedasXCuenta(event.pageIndex+1,event.pageSize)
        this.top.nativeElement.scrollIntoView({behavior: "smooth", block: "start"})
  }
}
