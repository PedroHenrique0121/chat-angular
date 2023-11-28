import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Midia } from '../models/midia.model';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  stream!: any;
  audio!: string;
  recorder!: MediaRecorder;
  private _midia = new Midia();

  private blob: Blob[] = [];
  constructor(private sanitizer: DomSanitizer) { }

  gravarAudio() {
    window.navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.start();
      })
  }

  async recordingStop(): Promise<Midia> {
    this.recorder.stop();
    // Cria uma Promise que será resolvida quando o evento "dataavailable" for disparado
    const dataPromise = new Promise<Midia>((resolve) => {
      this.recorder.addEventListener("error", (event) => {
        console.error('Erro na gravação:', event);
      });
      
      this.recorder.addEventListener("dataavailable", async (event) => {
        this.blob = []

        this.blob.push(event.data);
        //test

        const audioBlob = new Blob(this.blob, {
          type: 'audio/mp3',
        });
        // const audioURL = URL.createObjectURL(audioBlob);
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
         const duration = audioBuffer.duration;

        const normalUrl = URL.createObjectURL(audioBlob);

        const sanitizerUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(audioBlob));

        const audioName = encodeURIComponent(
          'audio_teste_' + new Date().getTime() + '.ogg'
        );

        this._midia = new Midia({ blob: audioBlob, title: audioName, normalUrl, sanitizerUrl, currentTime: 0, duration, url: normalUrl });
        audioContext.addEventListener("error", (event) => {
          console.error('Erro na decodificação de áudio:', event);
        });
        // const audioBlob = new Blob(this.blob, { type: 'audio/mp3' });
        // const audioURL = URL.createObjectURL(audioBlob);
        // const audioContext = new AudioContext();
        // const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());

        // // Obtém a duração total do áudio em segundos
        // const duration = audioBuffer.duration;

        // const audio = new Midia({})
        // audio.duration=duration;
        // audio.url=audioURL;
        // Resolve a Promise com a URL do áudio
        resolve( this._midia);
      });
    });

    // Aguarda a resolução da Promise antes de retornar o valor
    return await dataPromise;

  }
}
