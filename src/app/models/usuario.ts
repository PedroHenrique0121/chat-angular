export class Usuario{
     
    nome: string;

    constructor(attrs?: Partial<Usuario>){
        Object.assign(this,attrs);
    }
}
