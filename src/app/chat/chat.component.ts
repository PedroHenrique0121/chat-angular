import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { SocketIoConfig } from 'ngx-socket-io/src/config/socket-io.config';
import { Message } from '../global/models/message.model';
import { Socket } from 'ngx-socket-io';

import { User } from '../global/models/user.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Midia } from '../global/models/midia.model';
import { SocketService } from '../global/services/socket.service';
import { AudioService } from '../global/services/audio.service';

export type Info = {
  id: number,
  host: string,
}
export type U = {
  user: User;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[];
  message: Message;
  src: HTMLAudioElement;
  currentTime: number = 0;
  user!: User;

  informacoes!: Info[]
  tamanho!: number;
  gravando = false;
  connected: boolean = false;


  constructor(private location: Location,
    private router: Router,
    private socketService: SocketService,
    private renderer: Renderer2, private el: ElementRef,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {
    this.messages = new Array<Message>();
    this.message = new Message({ content: "", user: new User() });
    this.informacoes = new Array<Info>()
  }


  ngOnInit(): void {
    this.initConnection()
      .then(() => {
        this.connected = true;
      })
      .catch(error => {
        this.connected = false;
      })
    this.socketService.on("error", (error: any) => {
      console.log("tipo do erro", + error);
    });

    this.verifyUser();
    this.on();

  }

  get connection() {
    console.log(this.connected)
    return this.connected;
  }

  verifyUser() {
    this.user = new User()
    const state = this.location.getState() as U;
    if (state.user != null) {
      this.user = state.user;
    } else {
      this.router.navigateByUrl("/sign-in")
    }
  }

  send() {
    this.message = new Message({
      content: this.message.content,
      type: 1,
      user: new User(this.user),
      horario: new Date().toLocaleTimeString()
    })

    this.emitir(this.message);
    this.messages.push(...[this.message])
    this.message = new Message();
    this.rolarAutomatico()
  }

  rolarAutomatico() {
    const scrollable = document.querySelector('.mensagens') as HTMLDivElement;
    this.tamanho = scrollable?.scrollHeight;

    setTimeout(function () {
      // scrollable.scrollTop = scrollable.scrollHeight;
      scrollable?.scrollTo({
        top: scrollable.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);

  }

  enviarMensagemClicando() {
    if (this.message.content != null && this.message.content != "") {
      this.send();
    }
  }

  enviarMensagem(event: KeyboardEvent) {
    if (event.keyCode == 13 && this.message.content != null) {
      this.send();
    }
  }

  on() {
    this.socketService.on("evento", (event: Message) => {
      if (!!event.midia.blob) {
        const blob = new Blob([event.midia.blob], {
          type: 'audio/mp3',
        });

        const normalUrl = URL.createObjectURL(blob);

        this.message = new Message({
          midia: new Midia({
            blob,
            audio: new Audio(normalUrl),
            currentTime: 0
          }),
          type: event?.type,
          user: new User(event?.user),
          horario: event.horario
        })

      } else {
        this.message = new Message({
          content: event.content,
          type: event?.type,
          user: new User(event?.user),
          horario: event.horario
        })
      }
      // console.log(Math.floor(midia.duration/60)+":"+ (Math.floor(midia.duration % 60 ) < 10? '0'+ Math.floor(midia.duration % 60 ):  Math.floor(midia.duration % 60 )))
      this.messages.push(...[this.message]);
      this.message = new Message({});
      document.getElementById("mensagem")?.focus()
      this.rolarAutomatico()
    })

  }

  emitir(mensagem: Message) {
    this.socketService.emit("evento", mensagem);
  }

  async initConnection() {
    this.connected = false;
    try {
      await this.socketService.connect();
    }
    catch (err) {
    }
  }

  enviarAudio() {
    if (!this.gravando) {
      this.gravando = true;
      this.audioService.gravarAudio();
    } else {
      this.gravando = false;
      this.audioService.recordingStop().then(
        (midia: Midia) => {
          console.log(midia)
          this.message = new Message({
            midia: new Midia({
              audio: new Audio(midia.normalUrl),
              currentTime: 0,
              blob: midia.blob,
              url: midia.url,
            }),
            type: 1,
            user: new User(this.user),
            horario: new Date().toLocaleTimeString()
          })

          // console.log(Math.floor(midia.duration/60)+":"+ (Math.floor(midia.duration % 60 ) < 10? '0'+ Math.floor(midia.duration % 60 ):  Math.floor(midia.duration % 60 )))
          this.messages.push(...[this.message]);
          this.emitir(this.message);
          this.message = new Message({});
          this.cdr.detectChanges();
          this.rolarAutomatico()
        }
      )
    }
  }

  isNotEmptyString(str: any) {
    if (!str) {
      return false;
    }
    return str.trim().length > 0;
  }

  async onPlayOrStop(mensagem: Message) {
    const m = new Message(mensagem)
    console.log(mensagem);
    m.midia.audio.play();
    m.midia.audio.addEventListener('timeupdate', () => {
      mensagem.midia.currentTime = m.midia.audio.currentTime;
    });

    m.midia.audio.addEventListener('pause', () => {
    })

    m.midia.audio.addEventListener('ended', () => {
      mensagem.midia.currentTime = mensagem.midia.audio.duration;
    })
  }
}
