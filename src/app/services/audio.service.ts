import { Injectable } from '@angular/core';
import { Midia } from '../models/midia.model';
import { type } from 'os';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  stream!: any;
  audio!: string;
  recorder!: MediaRecorder;
  private blob: Blob[] = [];
  constructor() { }

  gravarAudio() {
    window.navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.start();
      })
  }

  async recordingStop() : Promise<Midia> {
    this.recorder.stop();
    // Cria uma Promise que será resolvida quando o evento "dataavailable" for disparado
    const dataPromise = new Promise<Midia>((resolve) => {
      this.recorder.addEventListener("dataavailable",async (event) => {
        this.blob= []
        this.blob.push(event.data);
        const audioBlob = new Blob(this.blob, { type: 'audio/mp3' });
        const audioURL = URL.createObjectURL(audioBlob);
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
  
        // Obtém a duração total do áudio em segundos
        const duration = audioBuffer.duration;
  
        const audio = new Midia({})
        audio.duration=duration;
        audio.url=audioURL;
        // Resolve a Promise com a URL do áudio
        resolve(audio);
      });
    });
  
    // Aguarda a resolução da Promise antes de retornar o valor
    return  await dataPromise;
    
  }
}
