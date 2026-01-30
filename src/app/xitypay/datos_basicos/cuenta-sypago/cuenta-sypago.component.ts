import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BooleanLetraSN, CtaSypago, CtaSypagoFiltro, XitypayService } from 'aliados';
import { LibEnvService, List } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { EditarCuentaSypagoComponent } from 'src/app/shared/editar-cuenta-sypago/editar-cuenta-sypago.component';
import { CrudImpl } from 'vcore';

@Component({
  selector: 'app-cuenta-sypago',
  templateUrl: './cuenta-sypago.component.html',
  styleUrls: ['./cuenta-sypago.component.css']
})
export class CuentaSypagoComponent extends CrudImpl implements OnInit{

  dataSource = new List<CtaSypago>()
  displayedColumns = ['nombre','usersypago','activo','boton']
  @ViewChild('top') top:ElementRef

  constructor(
    private service:XitypayService,
    private libEnvService:LibEnvService,
    private dialog: MatDialog,
    private snack: SnackbarService
  ){
    super()
  }

  ngOnInit(): void {
    this.getListSypago()
  }

  getListSypago(page = 1,cant = 15):void{
      const fitro:CtaSypagoFiltro = new CtaSypagoFiltro()
      this.service.getListCuentaSypago(this.libEnvService.getConfig().ciaopr.ciaopr,fitro,cant,page).subscribe({
        next:(resp)=>{
          this.dataSource = resp
        },
        error:(err)=>{
          this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
          console.log(err)
        }
      })
  }


    onPageChange(event:PageEvent):void{
          this.getListSypago(event.pageIndex+1,event.pageSize)
          this.top.nativeElement.scrollIntoView({behavior: "smooth", block: "start"})
    }

    toggleActivo(toggle:MatSlideToggleChange, element:CtaSypago):void{
      if (toggle.checked){
        element.activo = BooleanLetraSN.S
      } else {
        element.activo = BooleanLetraSN.N
      }
      console.log(element)
      this.saveCtaSypago(element)

    }

    saveCtaSypago(cta:CtaSypago):void{
      this.showSpinner = true
      this.service.createCuentaSypago(this.libEnvService.getConfig().ciaopr.ciaopr,cta).subscribe({
        next:()=>{
          this.getListSypago()
        },
        error:(err)=>{
          this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
          console.log(err)
          this.showSpinner = false
        },
        complete:()=>{
          this.showSpinner = false
        }
      })
    }

    deleteCtaSypago(cta:CtaSypago):void{
      this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%', data:this.dataDialogo('Confirme eliminación',`¿ Desea eliminar la cuenta "${cta.nombre}" ?`,'Eliminar','Cancelar')}).afterClosed().subscribe(
      result=>{
        if (!result){
          return
        }
        this.showSpinner = true
        this.service.deleteCuentaSypago(this.libEnvService.getConfig().ciaopr.ciaopr,cta).subscribe({
          next:()=>{
            this.getListSypago()
          },
          error:(err)=>{
            this.snack.msgSnackBar(err.error.mensaje,'OK',undefined,'error')
            console.log(err)
            this.showSpinner = false
          },
          complete:()=>{
            this.showSpinner = false
          }
        })
      })
    }

    agregarOEditarCuentaSypago(cta?:CtaSypago):void{
      const ctaEdit = cta ? cta : new CtaSypago()
      this.dialog.open(EditarCuentaSypagoComponent,{maxWidth: '400px', width: '100%', maxHeight: '350px', height: '90%', data:{titulo:'Cuenta Sypago', msg:'Ingrese la información de la cuenta',cuenta:ctaEdit,btn_true_text:'Guardar',btn_false_text:'Cancelar'}}).afterClosed().subscribe(
        (result:CtaSypago)=>{
          if (result){
            result.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
            if (result.activo){
              result.activo = BooleanLetraSN.S
            } else {
              result.activo = BooleanLetraSN.N
            }
            this.saveCtaSypago(result)
          }
        }
      )
    }

    

    show(e:CtaSypago):void{
      console.log(e)
    }

}
