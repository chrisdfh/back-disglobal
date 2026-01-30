import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FiltroDestacado, OfertaDestacadaConsulta, OfertaDestacadaResponse, OfertaService, OfertaView } from 'aliados';
import * as moment from 'moment';
import { LibEnvService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-destacados-home',
  templateUrl: './destacados-home.component.html',
  styleUrls: ['./destacados-home.component.css']
})
export class DestacadosHomeComponent implements OnInit {

  form:FormGroup
  dataSource: OfertaDestacadaResponse = new OfertaDestacadaResponse()
  displayedColumns: string[] = ['nroaliado','nrooferta','nombrecorto','fechainicio','fechafinal','preview','editar']
  showSpinner = false


  ngOnInit(): void {

    this.showSpinner = true
    this.buscarOfertasDestacadas()
      
  }

  constructor(
    private service:OfertaService,
    public dialog:MatDialog,
    private route: Router,
    public formBuilder:FormBuilder,
    private snack:SnackbarService,
    public libEnvServ: LibEnvService) { 
      this.form = this.formBuilder.group({
        estatustipocod1: new FormControl(null),
        estatuscod1: new FormControl(null),
        cantidad_registros: new FormControl(null),
        vigente: new FormControl(null),
        activo: new FormControl(null),
        verificado: new FormControl(null),
        aprobado: new FormControl(null),
        random: new FormControl(null),
      })
    }


    buscarOfertasDestacadas():void{

      this.showSpinner = true
      const filtro = new OfertaDestacadaConsulta()
      filtro.ciaopr = this.libEnvServ.getConfig().ciaopr.ciaopr
  
      filtro.filtro_destacados1 = new FiltroDestacado()
      filtro.filtro_destacados1.ciaopr = this.libEnvServ.getConfig().ciaopr.ciaopr
      filtro.filtro_destacados1.estatustipocod1 = 'EO1'
      filtro.filtro_destacados1.estatuscod1 = 'DEH'
      filtro.filtro_destacados1.activo = this.setSlideToggleFromBoolean(this.form.get('activo')?.value)
      filtro.filtro_destacados1.vigente = this.setSlideToggleFromBoolean(this.form.get('vigente')?.value)
      filtro.filtro_destacados1.verificado = this.setSlideToggleFromBoolean(this.form.get('verificado')?.value)
      filtro.filtro_destacados1.aprobado = this.setSlideToggleFromBoolean(this.form.get('aprobado')?.value)
  
      filtro.filtro_destacados2 = new FiltroDestacado()
      filtro.filtro_destacados2.ciaopr = this.libEnvServ.getConfig().ciaopr.ciaopr
      filtro.filtro_destacados2.estatustipocod1 = 'EO1'
      filtro.filtro_destacados2.estatuscod1 = 'DEC'
      filtro.filtro_destacados2.activo = this.setSlideToggleFromBoolean(this.form.get('activo')?.value)
      filtro.filtro_destacados2.vigente = this.setSlideToggleFromBoolean(this.form.get('vigente')?.value)
      filtro.filtro_destacados2.verificado = this.setSlideToggleFromBoolean(this.form.get('verificado')?.value)
      filtro.filtro_destacados2.aprobado = this.setSlideToggleFromBoolean(this.form.get('aprobado')?.value)


      this.service.consultaDestacadoHome('1',filtro).subscribe({
        next:(resp)=>{
          this.dataSource = resp

        },error:(err)=>{
          console.log('Hubo un error')
          console.log(err)
        },complete:()=>{
          this.showSpinner = false
        }
      })
    }


  setSlideToggleFromString(value:string|undefined):boolean{
    if (value == 'S') return true
    if (value == 'N') return false
    return false
  }
  setSlideToggleFromBoolean(value:boolean):string|null{
    if (value) return 'S'
    return null
  }

  fixDate(date:string):string{
    return moment(date).format('DD/MM/YYYY')
  }

  verOferta(oferta:OfertaView){
    window.open(oferta.url_oferta,"_blank")
  }

  editOferta(oferta:OfertaView){
    this.route.navigate([`/oferta/${oferta.nroaliado}/${oferta.nrooferta}`])
  }


    log(x:any){
      console.log(x)
    }

}
