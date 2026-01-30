import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaResponse, MediaUpFile, XitypayService } from 'aliados';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-upload-archivos',
  templateUrl: './upload-archivos.component.html',
  styleUrls: ['./upload-archivos.component.css']
})
export class UploadArchivosComponent{

  @ViewChild('inputFile') inputFile:ElementRef
  @ViewChild('uploadButton') uploadButton:ElementRef
  fileNameToUpload:string
  showSpinner = false

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data:any,
    private service:XitypayService,
    protected dialogRef:MatDialogRef<boolean|MediaResponse>,
    private snack:SnackbarService) {

    }

    uploadFile():void{
      const file = this.inputFile.nativeElement.files[0];
      const reader = new FileReader();
      let name:string;
      
      const realName = this.data.realName? this.data.realName : true
      if (realName) {
        name = file.name.substring(0, file.name.lastIndexOf('.'))
      } else {
        name = this.data.fileName
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        const data:MediaUpFile ={
          file: reader.result?.toString().split("base64,")[1] || '',
          nombre:name || file.name,
          path: this.data.filePath
        }
        if (data.file.trim() === '') {
          this.snack.msgSnackBar('Archivo vacío','OK',undefined,'error')
          return;
        }
        this.showSpinner = true
        this.service.uploadFile('1',data).subscribe(
          {
            next: (result:MediaResponse) => {
              if (result){
                this.dialogRef.close(result)
                }
            },error: (error) => {
                console.log(error)
                this.showSpinner = false
                this.snack.msgSnackBar(error.error.mensaje,'OK',undefined,'error')
            },complete: () => this.showSpinner = false
          }
        )
      }
    }

    fileSelected(e:Event):void{
      const input = e.target as HTMLInputElement
      if (input.files == null ||!input.files[0]){
        this.fileNameToUpload = ''
        this.uploadButton.nativeElement.setAttribute('disabled','true')
        return
      }
      this.fileNameToUpload = input.files[0].name
      this.uploadButton.nativeElement.removeAttribute('disabled')
      return
    }

}
