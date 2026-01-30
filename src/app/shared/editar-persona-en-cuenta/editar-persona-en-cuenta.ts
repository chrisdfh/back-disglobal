import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { LibEnvService, PersonasService } from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { UploadArchivosComponent } from '../upload-archivos/upload-archivos.component';
import { MediaResponse, microMensaje, PersonaXityPay, QrUrl, TelegramVerification, XitypayService } from 'aliados';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { Md5 } from 'ts-md5';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-editar-persona-en-cuenta',
  templateUrl: './editar-persona-en-cuenta.html',
  styleUrls: ['./editar-persona-en-cuenta.css']
})
export class EditarPersonaEnCuentaComponent  implements OnInit, AfterViewInit{
  @ViewChild('btnTrue') btnTrue:ElementRef
  @ViewChild('inputQuery') inputQuery:ElementRef
  @ViewChild('participacion') participacion:ElementRef
  @ViewChild('partTipo') partTipo:ElementRef

  @ViewChild('cntaLabel') cntaLabel:ElementRef
  @ViewChild('cntaInput') cntaInput:ElementRef

  form:FormGroup
  tablasApoyo:TablasApoyo
  showSpinner = false

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:any,
    protected dialogRef:MatDialogRef<boolean>,
    private snack:SnackbarService,
    private service:XitypayService,
    private personaService:PersonasService,
    public libEnvService: LibEnvService,
    public dialog: MatDialog
  ){

    this.form = new FormGroup({
      avatar: new FormControl(''),
      avatar2: new FormControl(''),
      avatar3: new FormControl(''),
      url_qr: new FormControl(''),
      url_qr1: new FormControl(''),
      url_qr2: new FormControl(''),
      participacion: new FormControl(''),
      participacionTipo: new FormControl(''),
      activo: new FormControl(''),
      email_not: new FormControl('',[Validators.email]),
      tlf_not_sms: new FormControl(''),
      tlf_not_ws: new FormControl(''),
      telegram_chat_id: new FormControl(''),

      url_webhook: new FormControl(''),
      notifica_webhook: new FormControl(''),

      cta_titular_nombre: new FormControl(''),
      bancocta_tipnip: new FormControl(''),
      bancocta_codnip: new FormControl(''),
      bancocod: new FormControl('',Validators.required),
      bancoctanro: new FormControl('',Validators.required),
      bancoctatipo: new FormControl('',Validators.required),
      bancocta_telfcodpais: new FormControl(''),
      bancocta_telfcodarea: new FormControl(''),
      bancocta_telefono: new FormControl(''),
    })
  }

  ngOnInit(): void {
      this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
      console.log(this.data)
  }

  // DESPUÉS DE MOSTRAR EL MODAL, COLOCAR EL FOCUS SOBRE EL BOTÓN 'OK'
  ngAfterViewInit(): void {
    setTimeout(()=>{ this.inputQuery.nativeElement.focus()},10)

    this.form.patchValue(this.data)
    if (this.form.get('url_qr1')?.value==null || this.form.get('url_qr1')?.value==undefined || this.form.get('url_qr1')?.value =='' ) {
      console.log('no tiene qr, creandolos')
      this.createQr(this.data.xpayctanro,this.data.nropersona)
    }
    this.cambiaLabelPlaceholderAction(this.data.bancoctatipo)
  }


  sendInput(){
    if (this.form.status !== 'VALID'){
      this.form.markAllAsTouched()
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','OK',undefined,'error')
      return
    }
    const personaEnCuenta:PersonaXityPay = this.form.getRawValue()
    
    this.dialogRef.close(personaEnCuenta)
  }

  cambiaLabelPlaceholder(event:MatSelectChange){
    this.cambiaLabelPlaceholderAction(event.value)
  }
  cambiaLabelPlaceholderAction(tipoCta:string){
    switch(tipoCta){
      case 'CNTA':
        this.cntaLabel.nativeElement.innerText = 'Nro Cuenta (20 dígitos)' 
        this.cntaInput.nativeElement.placeholder = '01011234561234567890'
        break
      case 'CELE':
        this.cntaLabel.nativeElement.innerText = 'Nro Tlf (04xx1234567)'
        this.cntaInput.nativeElement.placeholder = '04121234567'
        break
    }
  }

  log(){
    console.log(this.form.value)
  }

  uploadFile(formControlName:string,fileName:string,modalTitle:string):void{

    const filePath = `/xitypay/${this.data.xpayctanro}/pec/${this.data.nropersona}`

    this.dialog.open(UploadArchivosComponent,{
      width:'90%', 
      maxWidth:'550px',
      height:'auto',
      maxHeight:'90svh',
        data:{
          titulo:modalTitle,
          fileName,
          filePath,
          realName:true
        }}).afterClosed().subscribe(
      (result:MediaResponse)=>{
        if (result){
          this.form.patchValue({
            [formControlName]:result.url
          })
        }
    },error =>{
      console.log(error)
      this.snack.msgSnackBar(error.error.mensaje,'OK',undefined,'error')
    }
  )
  }

  createQr(xpayctanro:string,nropersona:number):void{
    const qrData:QrUrl[] = [
      {
        size:256,
        url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(xpayctanro)}/monto?pid=${nropersona}`,
        file_name:`qr_pd`,
        file_path:`/xitypay/${xpayctanro}/pec/${nropersona}`,
        qr_field_name:`url_qr1`,
      },
      {
        size:256,
        url:`${this.libEnvService.getConfig().xitypay_base_url}/${Md5.hashStr(xpayctanro)}/pago?pid=${nropersona}`,
        file_name:`qr_pa`,
        file_path:`/xitypay/${xpayctanro}/pecf/${nropersona}`,
        qr_field_name:`url_qr2`,
      }
    ]

    this.service.createPersonaEnCuentaQr(this.libEnvService.getConfig().ciaopr.ciaopr,qrData).subscribe(
      result=>{
        this.form.patchValue ({...this.form.getRawValue,...result})
        console.log(this.form.value)
      })

  }


  sendTelegramVerification():void{

    if (this.data.email_not == null || this.data.email_not == '' || this.data.email_not == undefined) {
      this.snack.msgSnackBar('Por favor guarde un correo a la Persona antes de solicitar el link de Telegram','OK',undefined,'warning')
      return
    }

    if (this.form.get('email_not')?.value == null || this.form.get('email_not')?.value == '' ) {
      this.snack.msgSnackBar('Debe ingresar un email','OK',undefined,'error')
      return
    }

    const dataTg:TelegramVerification = {
      nropersona: this.data.nropersona,
      xpayctanro: this.data.xpayctanro,
    }

    /**
     .pipe(
      
      catchError(error=>{
        console.log('el código es=>')
        console.log(error)

        console.log('el código fue=>')
        return throwError(()=>error)
      })
    )
    */

    this.showSpinner = true

    this.service.sendTelegramRegisterCode(this.libEnvService.getConfig().ciaopr.ciaopr,dataTg)
    .subscribe({
      next:()=>{
        this.snack.msgSnackBar(`Se ha enviado un link a ${this.data.email_not}, siga los pasos indicados en él`,'OK',undefined,'success')
        // this.dialogRef.close(this.form.getRawValue())
      },
      error:(error:HttpErrorResponse)=>{
        this.snack.msgSnackBar(error.error.mensaje,'OK',undefined,'error')
        this.showSpinner = false
        console.log(error)
      },complete:()=>{
        this.showSpinner = false
        console.log('done')
      }
    }
    )
  }

  telefonoNotificacion():void{
    const tlfPais = this.form.get('bancocta_telfcodpais')?.value.replace('0','')
    const tlfCod = this.form.get('bancocta_telfcodarea')?.value
    const tlfNum = this.form.get('bancocta_telefono')?.value

    if (this.form.get('tlf_not_sms')?.value == null || this.form.get('tlf_not_sms')?.value == '' ) {
      this.form.patchValue({
        tlf_not_sms:`${tlfPais}${tlfCod}${tlfNum}`,
      })
    }
    if (this.form.get('tlf_not_ws')?.value == null || this.form.get('tlf_not_ws')?.value == '' ) {
      this.form.patchValue({
        tlf_not_ws:`${tlfPais}${tlfCod}${tlfNum}`,
      })
    }
  }

  validateTgAndSave():void{
    // this.sendInput()
    this.sendTelegramVerification()
  }

  updateQr(){
    this.createQr(this.data.xpayctanro, this.data.nropersona)
  }

}
