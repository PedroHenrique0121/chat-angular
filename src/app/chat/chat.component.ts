import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { SocketIoConfig } from 'ngx-socket-io/src/config/socket-io.config';
import { Mensagem } from '../models/mensagem';
import { Socket } from 'ngx-socket-io';

import { Usuario } from '../models/usuario';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { AudioService } from '../services/audio.service';
import { Midia } from '../models/midia.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export type Info = {
  id: number,
  host: string,
}
export type U = {
  usuario: Usuario;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mensagens!: Mensagem[];
  mensagem!: Mensagem;
  src: HTMLAudioElement;
  currentTime: number= 0;
  usuario!: Usuario;

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
    this.mensagens = new Array<Mensagem>();
    this.mensagem = new Mensagem({conteudo: "", usuario: new Usuario()});
    this.informacoes = new Array<Info>()
  }


  ngOnInit(): void {
    this.initConnection()
    .then(() => {
      this.connected= true;
    })
    .catch(error=>{
      this.connected= false;
    })
    this.socketService.on("error", (error: any) => {
      console.log("tipo do erro", + error)
    });

    this.verificarUsuario()
    this.on();

  }

  get connection(){
    console.log(this.connected)
    return this.connected;
  }

  verificarUsuario() {
    this.usuario = new Usuario()
    const state = this.location.getState() as U
    console.log(state)
    if (state.usuario != null) {
      this.usuario = state.usuario;
    } else {
      this.router.navigateByUrl("/login")
    }
  }

  enviar() {
    this.mensagem= new Mensagem({conteudo: this.mensagem.conteudo , type: 1, usuario: this.usuario, horario:  new Date().toLocaleTimeString()})
    this.emitir(this.mensagem)
    this.mensagens.push(...[this.mensagem])
    this.mensagem = new Mensagem();
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
    if (this.mensagem.conteudo != null && this.mensagem.conteudo != "") {
      this.enviar();
    }
  }

  enviarMensagem(event: KeyboardEvent) {
    if (event.keyCode == 13 && this.mensagem.conteudo != null) {
      this.enviar();
    }
  }

  on() {
    this.socketService.on("evento", (event: Mensagem) => {
      this.mensagens.push(...[event])
      document.getElementById("mensagem")?.focus()
      this.rolarAutomatico()
    })

  }

  emitir(mensagem: Mensagem) {
    this.socketService.emit("evento", mensagem);
  }

  async initConnection() {
   this.connected= false;
    try {
      await this.socketService.connect();
    }
    catch (err) {
    }
  }

  enviarAudio() {
    if (!this.gravando) {
      this.gravando = true;
      this.audioService.gravarAudio()
    } else {
      
      this.gravando = false;

      this.audioService.stopGravacao().then(
        (midia: Midia) => {
          this.mensagem= new Mensagem({ audio: new Midia(midia), type: 1, usuario: this.usuario, horario:  new Date().toLocaleTimeString()})
          this.mensagem.audio.src = new Audio(this.mensagem.audio.url);
          this.mensagem.audio.currentTime=0;
          // console.log(Math.floor(midia.duration/60)+":"+ (Math.floor(midia.duration % 60 ) < 10? '0'+ Math.floor(midia.duration % 60 ):  Math.floor(midia.duration % 60 )))
          this.mensagens.push(...[this.mensagem]);
          this.mensagem= new Mensagem({});
          this.cdr.detectChanges();
          this.rolarAutomatico()
        }
      )
    }
  }

  isNotEmptyString(str: any) {
    if(!str){
      return false;
    }
    return str.trim().length > 0;
  }

  onPlayOrStop(mensagem: Mensagem){
   mensagem?.audio?.src.play();
   mensagem?.audio?.src.addEventListener('timeupdate', () => {
     // Atualiza o valor do controle deslizante durante a reprodução
     mensagem.audio.currentTime = mensagem?.audio?.src.currentTime;
   });

  }

}
