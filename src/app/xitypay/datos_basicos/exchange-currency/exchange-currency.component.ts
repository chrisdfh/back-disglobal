import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Currency, XitypayService } from 'aliados';
import { SnackbarService } from 'src/app/layout/snackbar.service';

@Component({
  selector: 'app-exchange-currency',
  templateUrl: './exchange-currency.component.html',
  styleUrls: ['./exchange-currency.component.css']
})
export class ExchangeCurrencyComponent implements OnInit{
  exchangeChanged= false
  exchangeChangedMessage:string
  form:FormGroup
  showSpinner=false
  currentCurrency = 'dollar'


  constructor(
    public dialog: MatDialog,
    private snack:SnackbarService,
    private formBuilder:FormBuilder,
    private service: XitypayService,
  ){
    this.form = this.formBuilder.group({
      currency: new FormControl(''),
      value: new FormControl(''),
      old_value: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.getCurrency(this.currentCurrency)
  }

  setCurrencyValue():void{
    if (this.form.status === 'VALID') {
      this.showSpinner = true
      const currencyObject:Currency = this.form.getRawValue()
      currencyObject.ciaopr = '1'
      this.service.setCurrency('1',currencyObject).subscribe(
        result=>{
          this.showSpinner = false
          if(result){
            this.form.patchValue({
              old_value:result.value,
              value:'',
              currency:result.currency
            })
            this.exchangeChanged = true
            this.exchangeChangedMessage = 'Tasa Actualizada Exitosamente'
          }
        }
      )
    } else {
      this.snack.msgSnackBar('Faltan campos requeridos o tipo de dato no válido','Corregir',undefined,'warning')
      this.form.markAllAsTouched()
    }
  }

  getCurrency(currency:string):void{
    this.service.getCurrency('1',currency).subscribe(
      (data)=>{
        this.form.patchValue({
          currency:this.currentCurrency,
          old_value:data.value
        })
      }
    )
  }

  show():void{
    console.log(this.form.getRawValue())
  }

}
