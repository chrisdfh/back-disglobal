import { Component, ElementRef, Inject, OnInit, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HashTags,OfertaService } from 'aliados';
import { CatalogoGenericoComponent } from '../catalogo-generico/catalogo-generico.component';

@Component({
  selector: 'app-catalogo-hashtags',
  templateUrl: './catalogo-hashtags.component.html',
  styleUrls: ['./catalogo-hashtags.component.css']
})
export class CatalogoHashtagsComponent implements OnInit {

  hashTags:HashTags['hashtags']
  hashTagsArray: string[]
  selectedTagsArray:string[]
  showSpinner:boolean
  maxTags=100
  @ViewChildren('tagShow') tags:MatSlideToggle[]

    constructor(
    public dialog:MatDialog,
    private service:OfertaService,
    @Inject(MAT_DIALOG_DATA) protected data:HashTagQuery,
    protected dialogRef:MatDialogRef<boolean>) {
    return
  }

  ngOnInit(): void {
    this.getHashTagsFromService()
    this.hashTagsArray = []
    this.selectedTagsArray = []
  }

  getHashTagsFromService():void{
    this.showSpinner = true
    this.service.getHashTags(this.data.ciaopr,this.data.nroaliado,this.data.nrooferta,15)
      .subscribe(
        (result:HashTags)=>{
          result.hashtags.forEach((tag:string)=>{
            this.hashTagsArray.push(tag)
          })
        this.showSpinner=false
        if(!result) return
        this.hashTags = result.hashtags
      }
    )
  }

  saveTagsAndSearch():void{
    this.hashTagsArray.forEach(tag=>{
      this.selectedTagsArray.push(tag)
    })
    this.hashTags=[]
    this.getHashTagsFromService()
  }

  returnHashes(){
    this.dialogRef.close(this.hashTagsArray)
  }

  toggleTag(check:boolean,tag:string|null){
    if (tag==null)return
    if(check){
      this.hashTagsArray.push(tag)
    }else{
      this.hashTagsArray = this.hashTagsArray.filter(x=>x!=tag)
    }
  }

  showTags():void{
    this.dialog.open(CatalogoGenericoComponent,
      {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
        data:{
          titulo:'Hashtags',
          msg: this.hashTagsArray.join(', '),
          btn_true_text:'OK',
          btn_false_text:'Cancelar'
        }
      }
    )
  }

  tagExists(tag:string):boolean{
    return this.hashTagsArray.includes(tag)
  }

  selectAllHashTags():void{
    this.tags.forEach(tag=>{
      tag.checked = true
      this.toggleTag(true,tag.name)
    })
  }
  selectNoHashTags():void{
    this.tags.forEach(tag=>{
      tag.checked = false
      this.toggleTag(false,tag.name)
    })
  }
}


export interface HashTagQuery{
  ciaopr:string
  nroaliado:number
  nrooferta:number
}