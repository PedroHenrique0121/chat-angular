export class Midia {
    audio: HTMLAudioElement;
    duration: number;
    url: string;
    currentTime: number;
    blob: any;
    title: string;
    normalUrl: any;
    sanitizerUrl: any;


    constructor(attrs?: Partial<Midia>){
        Object.assign(this, attrs);
    }
}
