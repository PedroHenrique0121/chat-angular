export class Midia {
    src: HTMLAudioElement;
    duration: number;
    url: string;
    currentTime: number;

    constructor(attrs?: Partial<Midia>){
        Object.assign(this, attrs);
    }
}
