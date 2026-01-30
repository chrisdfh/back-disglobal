import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaccion } from 'aliados';
import * as moment from 'moment';
import { LibEnvService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';

@Component({
  selector: 'app-detalle-transaccion',
  templateUrl: './detalle-transaccion.component.html',
  styleUrls: ['./detalle-transaccion.component.css']
})
export class DetalleTransaccionComponent implements OnInit {

  tablasApoyo:TablasApoyo

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:Transaccion,
    protected libEnvService:LibEnvService) {

    }
  ngOnInit(): void {
    console.log(this.data)
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
  }

  formatNumber(number:number):string{
    return number.toLocaleString('es-VE', { maximumFractionDigits: 2,minimumFractionDigits: 2 })
  }

  formatDate(date:string):string{
    return moment(date).format('D/M/Y hh:mm a')
  }

  getStatus(status:string):string{
    if (status === 'ACCP') return 'ACCP - Aprobado'
    if (status === 'RJCT') return 'RJCT - Rechazado'
    return ''
  }

  getTipoEnlace(tipoEnlace:string):string{
    if (tipoEnlace === 'I') return 'I - Envío Individual'
    if (tipoEnlace === 'L') return 'L - Generado por Lote'
    return 'NULL'
  }

  getBankData(bankCode:string):string{
    return this.tablasApoyo.entidadesFinancieras.find(x => x.entidadcod === bankCode)?.nombre || ''
  }

  getRechazoDetail(rechazo:string):string{

    const errorCodes:{[key:string]:string} = {
      AB01: "Proceso cancelado debido al tiempo de espera.",
      AB07: "Agente fuera de línea",
      AB08: "SyCloud no puede comunicarse con el Gateway de la IBP.",
      AC00: "Operación en Espera de Respuesta del Receptor",
      AC01: "El número de cuenta no es válido o falta.",
      AC04: "El número de cuenta se encuentra cancelado por parte del Banco Receptor.",
      AC06: "La cuenta especificada está bloqueada.",
      AC09: "Moneda no válida o no existe.",
      AG01: "Transacción restringida en este tipo de cuenta",
      AG09: "Pago no recibido",
      AG10: "El agente de mensaje está suspendido del sistema de pago nacional.",
      AM03: "El monto especificado se encuentra en una moneda no definida en los acuerdos establecidos",
      AM02: "El monto de la transacción no cumple con el acuerdo establecido (De acuerdo a lo indicado en aclaratoria funcional vigente)",
      AM04: "Fondo insuficiente, no puede cubrir el monto especificado en el mensaje.",
      AM05: "Operación duplicada",
      BE01: "Datos del cliente emisor o receptor no se corresponden",
      BE20: "La longitud del nombre supera el máximo permitido.",
      CUST: "Cancelación solicitada por el deudor",
      MD01: "El cliente acreedor no esta afiliado por el cliente deudor",
      MD09: "El cliente acreedor se encuentra en estado inactivo en la lista del cliente deudor",
      MD21: "Transacción a cobrar por el acreedor no cumple con los parámetros establecidos por el deudor",
      MD22: "El cliente acreedor se encuentra suspendido por el cliente deudor",
      PRCS: "Liquidación Lipone Procesada",
      RJCT: "Operación Rechazada",
      REJT: "Solicitud de Liquidación Lipone Rechazada",
      RC08: "Código del Banco no existe en el sistema de compensación /Liquidación.",
      TKCM: "Código unico de operación de aceptación de débito incorrecto.",
      TM01: "Mensaje enviado fuera del horario establecido",
      VE01: "Rechazo Técnico.",
      WAIT: "Operación en espera de validación de Código",
      FF05: "El Código del producto es invalido o no existe.",
      DU01: "La Identificación de mensaje está duplicada.",
      MD15: "Cantidad a cobrar supera el monto establecido por el cliente deudor",
      DS02: "Operación cancelada por usuario autorizado",
      FF07: "El Código del sub producto es invalido o no existe.",
      TECH: "Error Técnico al Procesar Liquidación",
      CH20: "Número de decimales supera el máximo permitido.",
      DT03: "Fecha de procesamiento no bancaria o no válida",
      ACCP: "Operación Aceptada",
      ED05: "La transacción de liquidación ha fallado (Solo para ser utilizado por el administrador del SNP)",
      CANC: "Operación cancelada por el usuario.",
      PROC: "Operación en proceso.",
      PEND: "Operación en estatus pendiente.",
    }

    return errorCodes[rechazo]?errorCodes[rechazo]:''
  }

  drawMoneda(data:Transaccion):string{
    return `Bs. ${this.formatNumber(data.monto_ves)}`
  }

}
