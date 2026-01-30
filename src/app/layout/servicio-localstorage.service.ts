import { Injectable } from '@angular/core';
import { AES,enc  } from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class ServicioLocalstorage {


  SECRET_KEY  = '1563116015160559'
  setItem(key: string, value: string) {
    const encodedValue = this.encode(value);
    localStorage.setItem(key, encodedValue);
  }

  getItem(key: string): string | null {
    const value = localStorage.getItem(key);
    if (value) {
      return this.decode(value);
    }
    return null;
  }

  deleteItem(key: string) {
    localStorage.removeItem(key);
  }


  encode(value: string): string {
    return AES.encrypt(value, this.SECRET_KEY).toString()
  }

  decode(value:string):string{
    return AES.decrypt(value, this.SECRET_KEY).toString(enc.Utf8)
  }

}
