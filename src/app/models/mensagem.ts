import { Midia } from "./midia.model";
import { Usuario } from "./usuario";

export class Mensagem{
    conteudo?:string;
    usuario:Usuario;
    audio: Midia;
    type:number;
    horario: string;

    constructor(attrs?: Partial<Mensagem>){
        Object.assign(this, attrs);
        this.audio = new  Midia(attrs?.audio);
    }

}
