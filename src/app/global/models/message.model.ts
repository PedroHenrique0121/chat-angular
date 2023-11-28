import { Midia } from "./midia.model";
import { User } from "./user.model";

export class Message {
    content?: string;
    user: User;
    midia: Midia;
    type: number;
    horario: string;

    constructor(attrs?: Partial<Message>) {
        Object.assign(this, attrs);
        this.midia = new Midia(attrs?.midia);
    }

}
