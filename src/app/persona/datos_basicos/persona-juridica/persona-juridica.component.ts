import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  Direcciones,
  LibEnvService,
  PersonaView,
  PersonasService,
  TelefonoCorreo,
} from 'personas';
import { TablasApoyo } from 'personas/lib/dto/config';
import { TipNip } from 'personas/lib/dto/tip-nip';
import { CatalogoGenericoComponent } from 'src/app/shared/borrame/catalogo-generico/catalogo-generico.component';
import { CatalogoLocalidadComponent } from 'src/app/shared/borrame/catalogo-localidad/catalogo-localidad.component';
import { CatalogoOcupacionActividadComponent } from 'src/app/shared/borrame/catalogo-ocupacion-actividad/catalogo-ocupacion-actividad.component';
import { CatalogoPersonaComponent } from 'src/app/shared/borrame/catalogo-persona/catalogo-persona.component';
import { CrudImpl } from 'vcore';
import * as moment from 'moment';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-persona-juridica',
  templateUrl: './persona-juridica.component.html',
  styleUrls: ['./persona-juridica.component.css'],
})
export class PersonaJuridicaComponent extends CrudImpl implements OnInit {
  defaults: object;

  tablasApoyo: TablasApoyo;

  visible: boolean;

  @ViewChild('main') top:ElementRef

  constructor(
    private libEnvService: LibEnvService,
    private snack: SnackbarService,
    private service: PersonasService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super();
    this.form = this.formBuilder.group({
      // nombreprimero: new FormControl(''),
      // nombresegundo: new FormControl(''),
      siglaspersjuridica: new FormControl('', Validators.required),
      nombrepersjuridica: new FormControl('', Validators.required),
      // apellidoprimero: new FormControl(''),
      // apellidosegundo: new FormControl(''),
      // apellidocasada: new FormControl(''),
      tipnip: new FormControl('', Validators.required),
      codnip: new FormControl('', Validators.required),
      paginaweb: new FormControl(''),
      // sexo: new FormGroup({
      // sexocod: new FormControl(''),
      // sexonombre: new FormControl('')
      // }),
      // edocivil: new FormGroup({
      // edocivilcod: new FormControl(''),
      // edocivilnombre: new FormControl('')
      // }),
      ocupacion_actividad: new FormGroup({
        ocupactivcod: new FormControl(''),
        ocupactivnombre: new FormControl(''),
      }),
      localidad: new FormGroup({
        localidadcod: new FormControl(''),
        localidadnombre: new FormControl(''),
      }),
      nacionalidad: new FormGroup({
        nacionalidadcod: new FormControl(''),
      }),
      fechanacimiento: new FormControl('', Validators.required),
      email1: new FormControl('', [Validators.required, Validators.email]),
      email2: new FormControl('', Validators.email),
      telefonos: new FormArray([]),
      direcciones: new FormArray([]),
      nropersona: new FormControl(null)
    });
  }
  ngOnInit(): void {
    this.cancelarAction();
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo;

    this.setDefaults();

    this.crud.btnIncluir.visible=false
    this.crud.btnEliminar.visible=false
    this.crud.btnModificar.visible=false
  }

  // dataDialogo(
  //   titulo: string,
  //   mensaje?: string,
  //   textoBotonTrue?: string,
  //   textoBotonFalse?: string,
  //   cantRegistros?: number,
  //   opciones?: string
  // ) {
  //   return {
  //     titulo: titulo,
  //     msg: mensaje || '',
  //     btn_true_text: textoBotonTrue || 'Aceptar',
  //     btn_false_text: textoBotonFalse || 'Cancelar',
  //     cant_registros: cantRegistros || 25,
  //     campousuariochar_1: opciones || undefined,
  //   };
  // }

  setDefaults(): void {
    this.defaults = {
      tipnip: 'J',
      paginaweb: 'https://',
      nacionalidad: {
        nacionalidadcod: this.tablasApoyo.nacionalidad.find(
          (t) => t.valorpordefecto === 'S'
        )?.nacionalidadcod,
      },
      telefonos: [
        {
          telefonotipcod: this.tablasApoyo.telefonoTipo.find(
            (t) => t.valorpordefecto === 'S'
          )?.telefonotipcod,
          telefonocodigopais: '+58',
        },
      ],
      direcciones: [
        {
          dirtipocod: this.tablasApoyo.tipoDireccion.find(
            (t) => t.valorpordefecto === 'S'
          )?.dirtipocod,
        },
      ],
    };
  }

  override cancelarAction(): void {
    super.cancelarAction();
    this.form.reset();
    this.form.disable();
    this.telefonos.clear();
    this.direcciones.clear();
    this.visible = false;
  }
  override incluirAction(): void {
    super.incluirAction();
    this.setPersona(new PersonaView());
    // this.addTelefono(new TelefonoCorreo())
    // this.addDireccion(new Direcciones())

    this.form.patchValue(this.defaults);
    this.visible = true;
  }

  override consultar(): void {
    super.consultar();
    this.dialog
      .open(CatalogoPersonaComponent, {
        maxWidth: '95%',
        width: '100%',
        maxHeight: '95%',
        height: '90%',
        data:this.dataDialogo('Búsqueda de personas',undefined,undefined,undefined,25,'J'),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.setPersona(result);
          this.form.disable();
          this.visible = false;
        }
      });
  }
  override modificarAction(): void {
    super.modificarAction();
    this.visible = true;
  }

  setPersona(persona: PersonaView): void {
    this.form.reset();

    if (typeof persona.fechanacimiento != undefined) {
      // persona.fechanacimiento =
      //   new DatePipe('en_US').transform(
      //     persona.fechanacimiento,
      //     'YYYY-MM-dd'
      //   ) || '';


      persona.fechanacimiento = moment(persona.fechanacimiento).format('YYYY') || ''
    }

    this.form.patchValue(persona);

    this.telefonos.clear();
    this.direcciones.clear();

    if (persona.telefonos != null) {
      for (let i = 0; i < persona.telefonos.length; i++) {
        this.addTelefono(persona.telefonos.at(i));
      }
    }

    if (persona.direcciones != null) {
      for (let i = 0; i < persona.direcciones.length; i++) {
        this.addDireccion(persona.direcciones.at(i));
      }
    }
  }

  get direcciones() {
    return this.form.controls['direcciones'] as FormArray;
  }

  get telefonos() {
    return this.form.controls['telefonos'] as FormArray;
  }

  addTelefono(tel: TelefonoCorreo | undefined | null): void {
    if (tel) {
      this.telefonos.push(
        new FormGroup({
          telefonotipcod: new FormControl(
            tel?.telefonotipcod,
            Validators.required
          ),
          telefonocodigopais: new FormControl(
            tel?.telefonocodigopais,
            Validators.required
          ),
          telefonocodigoarea: new FormControl(
            tel?.telefonocodigoarea,
            Validators.required
          ),
          telefononumero: new FormControl(
            tel?.telefononumero,
            Validators.required
          ),
        })
      );
    } else {
      this.telefonos.push(
        new FormGroup({
          telefonotipcod: new FormControl('', Validators.required),
          telefonocodigopais: new FormControl('+58', Validators.required),
          telefonocodigoarea: new FormControl('', Validators.required),
          telefononumero: new FormControl('', Validators.required),
        })
      );
    }
  }

  deleteTelefono(i: number): void {
    this.telefonos.removeAt(i);
  }

  addDireccion(dir: Direcciones | undefined | null): void {
    if (dir) {
      this.direcciones.push(
        new FormGroup({
          dirtipocod: new FormControl(dir.dirtipocod, Validators.required),
          direccion1: new FormControl(dir.direccion1, Validators.required),
          direccion2: new FormControl(dir.direccion2),
          direccion3: new FormControl(dir.direccion3),
          direccion4: new FormControl(dir.direccion4),
          localidadcod: new FormControl(dir.localidadcod),
          localidadtexto: new FormControl(dir.localidadtexto),
          codpostalcod: new FormControl(dir.codpostalcod),
          dir_latitud: new FormControl<number | null>(dir.dir_latitud),
          dir_longitud: new FormControl<number | null>(dir.dir_longitud),
        })
      );
    } else {
      this.direcciones.push(
        new FormGroup({
          dirtipocod: new FormControl('', Validators.required),
          direccion1: new FormControl('', Validators.required),
          direccion2: new FormControl(''),
          direccion3: new FormControl(''),
          direccion4: new FormControl(''),
          localidadcod: new FormControl(''),
          localidadtexto: new FormControl(''),
          codpostalcod: new FormControl(''),
          dir_latitud: new FormControl<number | null>(null),
          dir_longitud: new FormControl<number | null>(null),
        })
      );
    }
  }

  deleteDireccion(i: number): void {
    this.direcciones.removeAt(i);
  }

  personaJuridica(dato: TipNip): boolean {
    return dato.personatipocod == 'J';
  }

  override incluir(): void {
    if (this.form.get('email1')?.value == this.form.get('email2')?.value) {
      this.dialog
        .open(CatalogoGenericoComponent, {
          maxWidth: '400px',
          width: '100%',
          maxHeight: '250px',
          height: '90%',
          data: this.dataDialogo(
            'Error de validación',
            'Los correos deben ser distintos'
          ),
        })
        .afterClosed()
        .subscribe();
      return;
    }
    // esto debería suceder al aceptar, estando en modo incluir
    if (this.form.status === 'VALID') {
      super.incluir();
      this.showSpinner = true;
      let persona: PersonaView = this.form.getRawValue();
  
      if (persona.tipnip == 'TJ') {
            const pt:any = persona
            pt.codnip =null
            persona=pt
            // persona.nombreprimero='T'
            // persona.apellidoprimero='T'
      }

      persona.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr;
      // persona.fechanacimiento = moment(
      //   this.form.get('fechanacimiento')?.value
      // ).format('YYYY/MM/DD');


      const anoInicioActividades = `${this.form.get('fechanacimiento')?.value}/01/01`
      persona.fechanacimiento = moment(anoInicioActividades).format('YYYY/MM/DD')

      console.log(persona)
      this.service.upserPersona(persona.ciaopr, persona).subscribe(
        (result) => {
          if (result) {
            this.form.reset();
            this.snack.msgSnackBar(
              'Guardado con éxito',
              'OK',
              undefined,
              'success'
            );
            this.setPersona(result);
            this.visible = false;
            this.showSpinner = false;
            this.configBTNForms(false);
            this.form.disable();
            //this.top.nativeElement.scrollIntoView({  block: 'start', behavior: 'smooth'})
            window.scrollTo(0, 0)
          } else {
            this.showSpinner = false;
            this.snack.msgSnackBar(
              'Error al guardar',
              'OK',
              undefined,
              'error'
            );
            console.log('hubo un error');
          }
        },
        (error) => {
          console.log('HUBO UN ERROR');
          console.log(error);
          this.snack.msgSnackBar('Error al guardar', 'OK', undefined, 'error');
          this.showSpinner = false;
        }
      );
    } else {
      this.snack.msgSnackBar(
        'Faltan campos requeridos o tipo de dato no válido',
        'Corregir',
        undefined,
        'warning'
      );
      this.form.markAllAsTouched();
    }
  }

  override modificar(): void {
    if (this.form.get('email1')?.value == this.form.get('email2')?.value) {
      this.dialog
        .open(CatalogoGenericoComponent, {
          maxWidth: '400px',
          width: '100%',
          maxHeight: '250px',
          height: '90%',
          data: this.dataDialogo(
            'Error de validación',
            'Los correos deben ser distintos'
          ),
        })
        .afterClosed()
        .subscribe();
      return;
    }
    // esto debería suceder al aceptar, estando en modo modificar
    if (this.form.status == 'VALID') {
      super.modificar();
      this.showSpinner = true;
      const persona: PersonaView = this.form.getRawValue();
      persona.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr;
      // persona.fechanacimiento = moment(
      //   this.form.get('fechanacimiento')?.value
      // ).format('YYYY/MM/DD');

      const anoInicioActividades = `${this.form.get('fechanacimiento')?.value}/01/01`
      persona.fechanacimiento = moment(anoInicioActividades).format('YYYY/MM/DD')


      this.service.upserPersona(persona.ciaopr, persona).subscribe(
        (result) => {
          if (result) {
            this.form.reset();
            this.snack.msgSnackBar(
              'Modificado con éxito',
              'OK',
              undefined,
              'success'
            );
            this.setPersona(result);
            this.showSpinner = false;
            this.configBTNForms(false);
            this.form.disable();
            //this.top.nativeElement.scrollIntoView({  block: 'start', behavior: 'smooth'})
            window.scrollTo(0, 0)
            this.visible = false;
          } else {
            this.showSpinner = false;
            console.log('hubo un error');
            this.snack.msgSnackBar(
              'Error al modificar',
              'OK',
              undefined,
              'error'
            );
          }
        },
        (error) => {
          console.log('HUBO UN ERROR');
          console.log(error);
          this.snack.msgSnackBar('Error al guardar', 'OK', undefined, 'error');
          this.showSpinner = false;
        }
      );
    } else {
      this.snack.msgSnackBar(
        'Faltan campos requeridos o tipo de dato no válido',
        'Corregir',
        undefined,
        'warning'
      );
      this.form.markAllAsTouched();
    }
  }

  parseGpsData(event: any, i: number): void {
    const gpsData = event.target.value.split(',');
    if (gpsData.length == 2) {
      const data = {
        dir_latitud: parseFloat(gpsData[0]),
        dir_longitud: parseFloat(gpsData[1]),
      };
      this.direcciones.at(i).patchValue(data);
    }
  }

  catalogoActividad() {
    this.dialog
      .open(CatalogoOcupacionActividadComponent, {
        data: this.dataDialogo(
          'Búsqueda de Ocupación/Actividad',
          undefined,
          undefined,
          undefined,
          undefined,
          'A'
        ),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.form.patchValue({
            ocupacion_actividad: result,
          });
        }
      });
  }

  catalogoLocalidad(i?: number): void {
    this.dialog
      .open(CatalogoLocalidadComponent, {
        data: this.dataDialogo('Búsqueda de localidad'),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (i == undefined) {
            this.form.patchValue({
              localidad: result,
            });
          } else {
            this.direcciones.at(i).patchValue({
              localidadtexto: result.localidadnombre,
              localidadcod: result.localidadcod,
            });
          }
        }
      });
  }

  changeNip(e:MatSelectChange):void{
    if (e.value == 'TJ'){
      this.form.get('codnip')?.setValue('0')
      this.form.get('codnip')?.disable()
    } else {
      this.form.get('codnip')?.setValue('')
      this.form.get('codnip')?.enable()
    }
  }
}
