import { AfterViewInit, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { CatalogoDto } from '../catalogo-dto'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { LibEnvService, List } from 'personas'
import { TablasApoyo } from 'personas/lib/dto/config'
import { SnackbarService } from 'src/app/layout/snackbar.service'

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent<T> implements OnInit{

  form: FormGroup

  tablasApoyo:TablasApoyo

  showSpinner:boolean

  dataSource = new List<T>()

  @ViewChild(MatPaginator) paginator: MatPaginator

  displayedColumns: string[]

  catalogoDto: CatalogoDto<T>

  ciaopr:string

  constructor(@Inject(MAT_DIALOG_DATA) protected data: any,
    protected builder: FormBuilder,
    protected dialog: MatDialog,
    public snack:SnackbarService,
    protected dialogRef: MatDialogRef<CatalogoComponent<T>>,
    protected injector: Injector,
    public libEnvService: LibEnvService,) { 
  }

  ngOnInit(): void {
    this.showSpinner = false
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
    this.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onAceptClick(): void {
    this.dialogRef.close(false)
  } 

  onSelectRowClick(row: T): void {
    this.dialogRef.close(row)
  } 
  
  buscar(): void{
    this.dataSource = new List<T>()
    this.showSpinner=true
  }

  onPageChange(event: PageEvent) {
    this.showSpinner=true
  }
}