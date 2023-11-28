export class User{
     
    nome: string;

    constructor(attrs?: Partial<User>){
        Object.assign(this,attrs);
    }
}
