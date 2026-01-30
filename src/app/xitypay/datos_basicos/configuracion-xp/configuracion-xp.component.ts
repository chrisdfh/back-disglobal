import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaResponse } from 'aliados';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { UploadArchivosComponent } from 'src/app/shared/upload-archivos/upload-archivos.component';

@Component({
  selector: 'app-configuracion-xp',
  templateUrl: './configuracion-xp.component.html',
  styleUrls: ['./configuracion-xp.component.css']
})
export class ConfiguracionXpComponent implements OnInit {

  configFile = 'https://mmedia.xityclub.com/xitypay/config-files/xpay-msg.plain;%20charset=utf-8'
  defaultTemplate = 'https://mmedia.xityclub.com/xitypay/xpay-msg-conf.json'
  data:XpNotifications|undefined

  constructor(
    private dialog:MatDialog,
    private snack:SnackbarService
  ) { }

  ngOnInit(): void {
    this.loadConfig()
  }

  loadConfig():void{
    this.data = undefined
    const options:RequestInit={
      method:'GET',
      cache:'no-cache',
    }
    fetch(this.configFile,options)
      .then(response => response.json())
      .then((data:XpNotifications)=>{
        this.data = data
      })
}


  uploadFile(fileName:string,modalTitle:string):void{
    const filePath = `/xitypay/config-files`

    this.dialog.open(UploadArchivosComponent,{
      width:'90%', 
      maxWidth:'550px',
      height:'auto',
      maxHeight:'90svh',
        data:{
          titulo:modalTitle,
          fileName,
          filePath,
          realName:false
        }
      }).afterClosed().subscribe(
          (result:MediaResponse)=>{
        if (result){ 
          this.loadConfig()
        }
      },error =>{
        console.log(error)
        this.snack.msgSnackBar(error.error.mensaje,'OK',undefined,'error')
      }
  )
  }

  openNewTab(url:string):void{
    window.open(url,'_blank')
  }
}

interface XpNotifications{
  image:string
  messages:XpMsgNot[]
}
interface XpMsgNot{
  message:string
  url:string
}
