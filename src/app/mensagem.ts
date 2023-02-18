import { Usuario } from "./usuario";

export class Mensagem{
    conteudo!:string;
    usuario!:Usuario;
    type!:number;
    horario!: string
}
