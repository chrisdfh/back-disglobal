import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XitypayService } from 'aliados';
import { LibEnvService, PersonasService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-listado-xpay-cuentas',
  templateUrl: './listado-xpay-cuentas.component.html',
  styleUrls: ['./listado-xpay-cuentas.component.css']
})
export class ListadoXpayCuentasComponent implements OnInit {

  dataSource:miniXPCuenta[] = [];

  constructor(
      @Inject(MAT_DIALOG_DATA) protected data:miniXPCuenta[],
      protected dialogRef:MatDialogRef<boolean>,
      private snack:SnackbarService,
      private service:XitypayService,
      private personaService:PersonasService,
      public libEnvService: LibEnvService,
      public dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.dataSource = this.data
    console.log(this.dataSource)
  }

  seleccionarXpayCuenta(xpaycuenta:miniXPCuenta){
    this.dialogRef.close(xpaycuenta)
  }
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