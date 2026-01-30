import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LibEnvService, PersonaView, UserView2, UserView2Persona, UsuariosService } from 'personas';
import { SnackbarService } from 'src/app/layout/snackbar.service';
import { CrudImpl } from 'vcore';
import { CatalogoPersonaComponent } from '../borrame/catalogo-persona/catalogo-persona.component';
import { TablasApoyo } from 'personas/lib/dto/config';
import { MatSelectChange } from '@angular/material/select';
import { TipNip } from 'personas/lib/dto/tip-nip';
import { Md5 } from 'ts-md5';
import { CatalogoUsuariosComponent } from '../borrame/catalogo-usuarios/catalogo-usuarios.component';
import { CatalogoGenericoComponent } from '../borrame/catalogo-generico/catalogo-generico.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.css']
})
export class AdministrarUsuariosComponent  extends CrudImpl implements OnInit  {

  visible=false
  tablasApoyo:TablasApoyo

  defaults:object

  constructor(
    private libEnvService: LibEnvService,
    private route: Router,
    private service: UsuariosService, 
    private snack:SnackbarService,
    private formBuilder: FormBuilder, 
    public dialog: MatDialog) {
    super()
    this.form = this.formBuilder.group({
      nrousuario: new FormControl(''), 
      nropersona: new FormControl('',Validators.required),
      alias: new FormControl('',Validators.required),
      email_publico: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      password2: new FormControl(''),
      cambia_passwd: new FormControl(''),
      nro_not_ws: new FormControl(''),
      
      // SOLO VISIBLES CUANDO SE MODIFICA EL USUARIO
      correo_verificado: new FormControl(''),
      tlf_verificado: new FormControl(''),
      ced_rif_verificado: new FormControl(''),
      dir_verificado: new FormControl(''),
      telegram_chat_id: new FormControl(''),

      persona: new FormGroup({
        tipnip: new FormControl(''),
        codnip: new FormControl(''),
        nombreprimero: new FormControl(''),
        nombresegundo: new FormControl(''),
        apellidoprimero: new FormControl(''),
        apellidosegundo: new FormControl(''),
        nombrecorto: new FormControl(''),
        nombrecompleto: new FormControl(''),
      }),
    })
    this.tablasApoyo = this.libEnvService.getConfig().tablasApoyo
  }


  ngOnInit(): void {
    this.setDefaults()
    this.cancelarAction()
    this.crud.btnEliminar.visible=false
  }

  

  protected override incluirAction(): void {
    super.incluirAction()
    this.form.reset()
    this.form.patchValue(this.defaults)
    this.visible=true
    this.getPersona()
  }

  override eliminarAction(): void {
    super.eliminarAction()
    const usuario:UserView2 = this.form.getRawValue()

    this.dialog.open(CatalogoGenericoComponent,{maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Eliminar Registro","Está seguro de que desea eliminar el registro","Eliminar")} ).afterClosed().subscribe(
        (respuesta)=>{
          if (respuesta) {
            this.showSpinner = true
            this.service.deleteUsuario(this.libEnvService.getConfig().ciaopr.ciaopr,usuario.nrousuario).subscribe({
              next: () => {
                  this.snack.msgSnackBar('Usuario eliminado correctamente', 'Ok', undefined, 'success')
                  this.cancelarAction()
                  // this.setUser(result)
              },
              error: (e) => {
                console.log(e.error)
                this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')

                this.showSpinner = false
              },
              complete: ()=>{
                this.cancelarAction()
                this.showSpinner = false
              }
            })
          } else {
            this.showSpinner = false
          }
        }
      )

  }


  override incluir(): void {
    super.incluir()
    if (this.form.status !== 'VALID') {
      this.form.markAllAsTouched()
      return
    }
    if (this.form.get('password')?.value.trim() === '')  {
      this.snack.msgSnackBar('Debe especificar una Contraseña', 'Corregir', undefined, 'warning')
      return
    }
    if (this.form.get('password')?.value !== this.form.get('password2')?.value) {
      this.snack.msgSnackBar('Las contraseñas no coinciden', 'Corregir', undefined, 'warning')
      return
    }

    this.showSpinner = true
    const newUser: UserView2 = this.form.getRawValue()
    newUser.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr
    newUser.password = Md5.hashStr(this.form.get('password')?.value)


    // console.log(JSON.stringify(newUser))
    // this.showSpinner = false
    // return

    this.service.createUsuario(newUser.ciaopr,newUser).subscribe({
      next: (result: UserView2) => {
        if (result) {


          this.service.getUsuario(newUser.ciaopr, result.nrousuario).subscribe({
            next: (result: UserView2Persona) => {
              this.setUser(result)
            }
          })

          this.snack.msgSnackBar('Usuario incluido correctamente', 'Ok', undefined, 'success')
          this.showSpinner = false
          this.crud.btnModificar.disabled=false
          this.form.disable()
          // this.setUser(result)
        } else {
          this.snack.msgSnackBar('Error al guardar', 'OK', undefined, 'error')
          this.showSpinner = false
        }
      },
      error: (e) => {
        console.log(e.error)
        this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')
        this.showSpinner = false
      }
    })

  }



  override consultar(): void {
    super.consultar()
    this.dialog.open(CatalogoUsuariosComponent,{data:this.dataDialogo('Búsqueda de Usuarios',undefined,undefined,undefined,25)}).afterClosed()
      .subscribe((result:UserView2Persona)=> {
        if (result) {
          this.setUser(result)
          this.form.disable()
          this.visible=false
          
        }
    })
  }

  override modificar(): void {
    super.modificar()

    if (this.form.status !== 'VALID') {
      this.form.markAllAsTouched()
      return
    }

    const updateUser: UserView2 = this.form.getRawValue()
    updateUser.ciaopr = this.libEnvService.getConfig().ciaopr.ciaopr

    updateUser.dir_verificado = this.getSlideToggleFromBoolean(this.form.get('dir_verificado')?.value)
    updateUser.ced_rif_verificado = this.getSlideToggleFromBoolean(this.form.get('ced_rif_verificado')?.value)
    updateUser.tlf_verificado = this.getSlideToggleFromBoolean(this.form.get('tlf_verificado')?.value)
    updateUser.correo_verificado = this.getSlideToggleFromBoolean(this.form.get('correo_verificado')?.value)

    this.showSpinner = true
    this.service.updateUsuario(updateUser.ciaopr, updateUser).subscribe({
      next: (result: UserView2) => {
        if (result) {

          this.service.getUsuario(updateUser.ciaopr, updateUser.nrousuario).subscribe({
            next: (result: UserView2Persona) => {
              this.setUser(result)
            }
          })

          this.snack.msgSnackBar('Usuario modificado correctamente', 'Ok', undefined, 'success')
          this.showSpinner = false
          this.form.disable()
          // this.setUser(result)
        } else {
          this.snack.msgSnackBar('Error al modificar', 'OK', undefined, 'error')
          this.showSpinner = false
        }
      },
      error: (e) => {
        console.log(e.error)
        this.snack.msgSnackBar(e.error.mensaje, 'OK', undefined, 'error')
        this.showSpinner = false
      },
      complete: ()=>{
        this.showSpinner = false
      }
    })
    // GUARDAR DATOS
    
  }
  protected override cancelarAction(): void {
    super.cancelarAction()
    this.visible=false
  }
  protected override modificarAction(): void {
    super.modificarAction()
    this.visible=true
  }


  setDefaults():void{
    this.defaults = {
      nropersona:null,
      nrousuario:null,
      tipnip:this.tablasApoyo.tipNip.find(t=>t.valorpordefecto==='S')?.tipnipcod,
    }

    this.form.patchValue(this.defaults)
  }




  getPersona(): void {
    this.setDefaults()
    this.dialog.open(CatalogoPersonaComponent, 
      {data: this.dataDialogo('Búsqueda de personas',undefined,undefined,undefined,25,undefined)}).afterClosed().subscribe(
      (result:PersonaView)=>{
        if(result){
          this.setPersona(result)
          this.form.patchValue({
            password:result.codnip,
            password2:result.codnip
          })
        }
        this.visible=true
    })
  }


  setUser(user:UserView2Persona): void {
    this.form.reset()


    this.form.patchValue(user)
    this.form.patchValue({password2:user.password})

    this.form.patchValue({
      correo_verificado:this.setSlideToggleFromString(user.correo_verificado),
      tlf_verificado:this.setSlideToggleFromString(user.tlf_verificado),
      ced_rif_verificado:this.setSlideToggleFromString(user.ced_rif_verificado),
      dir_verificado:this.setSlideToggleFromString(user.dir_verificado),
    })
    
  }

  setPersona(persona: PersonaView): void {
    this.form.reset()
    this.form.patchValue({persona:persona})

    let alias = '';

    this.dialog.open(CatalogoGenericoComponent, {maxWidth: '400px', width: '100%', maxHeight: '250px', height: '90%',
      data: this.dataDialogo("Usuario XityPay",` ¿ ${persona.nombrecorto} será un usuario XityPay ?`,'SI','NO')}).afterClosed().subscribe(result=>{
      if(result){
        alias =`${persona.tipnip.toUpperCase()}${persona.codnip}`
        this.form.get('alias')?.disable()
      }
      this.form.patchValue({
        nropersona: persona.nropersona,
        email_publico: persona.email1,
        alias
      })
      // console.log(this.form.getRawValue())
    })


  }


  personaNatural(dato:TipNip):boolean{
    return dato.personatipocod == 'N'
  }


  changeNip(e:MatSelectChange):void{
    if (e.value == 'T'){
      this.form.get('codnip')?.setValue('0')
      this.form.get('codnip')?.disable()
    } else {
      this.form.get('codnip')?.setValue('')
      this.form.get('codnip')?.enable()
    }
  }
  

  createAlias():void{
    if (this.form.get('alias')?.value !== ''){
      return
    }
    this.form.patchValue({
      alias: `${this.form.get('tipnip')?.value.toUpperCase()}${this.form.get('codnip')?.value}`
    })
  }


  changeAlias():void{
    const nrousuario = this.form.get('nrousuario')?.value
    if (nrousuario){
      this.route.navigate([`/username-change/${nrousuario}`])
    }
    return
  }

  resetPassword():void{
    const nrousuario = this.form.get('nrousuario')?.value
    if (nrousuario){
      this.route.navigate([`/password-reset/${nrousuario}`])
    }
    return
  }

  changeEmail():void{
    const nrousuario = this.form.get('nrousuario')?.value
    if (nrousuario){
      this.route.navigate([`/email-change/${nrousuario}`])
    }
    return
  }

  errorPasswd():boolean{
    const samePasswd = this.form.get('password2')?.value === this.form.get('password')?.value
    return !samePasswd
  }


  setSlideToggleFromString(value:string|undefined):boolean{
    if (value == 'S') return true
    if (value == 'N') return false
    return false
  }
  getSlideToggleFromBoolean(value:boolean):string{
    if (value) return 'S'
    return 'N'
  }


  
}
