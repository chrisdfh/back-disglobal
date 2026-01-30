import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { XitypayService, XpayMoneda, XpayMonedaFiltro } from 'aliados';
import { LibEnvService, List } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { EditarMonedaXitypayComponent } from 'src/app/shared/editar-moneda-xitypay/editar-moneda-xitypay.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.css']
})
export class MonedaComponent extends CrudImpl implements OnInit{

  @ViewChild('top') top:ElementRef
  ciaopr:string
  dataSource = new List<XpayMoneda>()
  displayedColumns = ['moneda','nombre','valor','activo','boton']

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
      this.getMonedas()

  }

  getMonedas(filtroArg?:XpayMonedaFiltro,page?:number,cant?:number):void{
    const filtro:XpayMonedaFiltro = filtroArg || {}
    this.service.getMonedas(this.ciaopr,filtro,cant,page).subscribe(
      {next:(result)=>{
          this.dataSource=result
      },

      error:(err)=>{
          console.log(err)
          this.snack.msgSnackBar(err.error,'OK',undefined,'error')
      },
    }
    )
  }

  agregarMoneda():void{
    const dialogData = {
      titulo: 'Agregar Moneda',
      msg: 'Introduzca los datos para crear la moneda',
      btn_true_text: 'Crear',
      btn_false_text: '',
    }
    this.dialog.open(EditarMonedaXitypayComponent,{maxWidth: '450px', width: '100%', maxHeight: '400px', height: '90%', data:dialogData})
      .afterClosed().subscribe({
        next:(resultCreaMoneda) =>{
            if (resultCreaMoneda){
              console.log(resultCreaMoneda)
              resultCreaMoneda.activo = this.readSlideToggleFromBoolean(resultCreaMoneda.activo)
              resultCreaMoneda.ciaopr = this.ciaopr
              this.showSpinner = true
              this.service.createMoneda(this.ciaopr,resultCreaMoneda).subscribe({
                next:(xxx)=>{
                  console.log(xxx)
                  this.getMonedas()
                  this.showSpinner=false
                },
                error:(err)=>{
                  console.log(err)
                  this.snack.msgSnackBar(err.error,'OK',undefined,'error')
                  this.showSpinner=false
                }
              })
            } else {
              console.log('not updated')
            }
        }, error: (err)=>{
          console.log(err)
          this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
          this.showSpinner=false
        }
      })
  }

  modMoneda(moneda:XpayMoneda):void{
    const dialogData = {
      titulo: 'Modificar Moneda',
      msg: 'Cambie los datos de la moneda que se desee modificar y haga click sobre el botón "Modificar"',
      btn_true_text: 'Modificar',
      btn_false_text: '',
      moneda:moneda
    }
    this.dialog.open(EditarMonedaXitypayComponent, {maxWidth: '450px', width: '100%', maxHeight: '400px', height: '90%', data:dialogData})
      .afterClosed().subscribe({
        next:(resultModMoneda) =>{
            if (resultModMoneda){
              resultModMoneda.activo = this.readSlideToggleFromBoolean(resultModMoneda.activo)
              resultModMoneda.ciaopr = this.ciaopr
              this.showSpinner = true
              this.service.updateMoneda(this.ciaopr,resultModMoneda).subscribe({
                next:()=>{
                  this.getMonedas()
                  this.showSpinner=false
                },
                error:(err)=>{
                  console.log(err)
                  this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
                  this.showSpinner=false
                }
              })
            }
        }, error: (err)=>{
          console.log(err)
        }
      })
  }

  eliminaMoneda(moneda:XpayMoneda):void{

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme eliminación',`¿ Desea eliminar la moneda ${moneda.nombre} (${moneda.moneda}) ?`,'Eliminar','Cancelar')}).afterClosed().subscribe(
      result=>{
        if (result) {
        this.showSpinner=true
        this.service.deleteMoneda(this.ciaopr,moneda.moneda).subscribe({
          next:()=>{
            console.log('eliminado')
            this.snack.msgSnackBar('Moneda eliminada exitosamente','OK',undefined,'success')
            this.getMonedas()
            this.showSpinner=false
          },
          error:(err)=>{
            console.log(err)
            this.showSpinner=false
            this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
          }
        })
      }
      })



  }

  setSlideToggleFromString(value:string|undefined):boolean{
    if (value == 'S') return true
    if (value == 'N') return false
    return false
  }
  readSlideToggleFromBoolean(value:boolean):string{
    if (value) return 'S'
    return 'N'
  }

  onPageChange(event:PageEvent):void{
    const filtro:XpayMonedaFiltro = {}
      if (filtro != null){
        this.getMonedas(filtro,event.pageIndex+1,event.pageSize)
        this.top.nativeElement.scrollIntoView({behavior: "smooth", block: "start"})
      }
  }


}
