export class CatalogoDto<T> {

    titulo: string

    mensaje: string

	results: T[]
    
    pagina: number
    
    paginas: number
    
    reg_x_pagina: number
    
    total: number
    
    registros_en_pagina: number

    constructor() { }

}
