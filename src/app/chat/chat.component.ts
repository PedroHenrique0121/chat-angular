import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { SocketIoConfig } from 'ngx-socket-io/src/config/socket-io.config';
import { Mensagem } from '../mensagem';
import { Socket } from 'ngx-socket-io';

import { Usuario } from '../usuario';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

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

  usuario!: Usuario;

  informacoes!: Info[]
  tamanho!: number;


  constructor(private location: Location,
    private router: Router,
    private socketService: SocketService,
    private renderer: Renderer2, private el: ElementRef
  ) {
    this.mensagens = new Array<Mensagem>();
    this.mensagem = new Mensagem();
    this.mensagem.conteudo = ""
    this.usuario = new Usuario()
    this.informacoes = new Array<Info>()
  }


  ngOnInit(): void {
    this.socketService.on("error", (error: any) => {
      console.log("tipo do erro", + error)
    });

    this.socketService.on("connect", () => {
      console.log("conectou")
    })
    this.verificarUsuario()
    this.on();

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
    this.mensagem.type = 1
    this.mensagem.usuario = this.usuario
    const horario = new Date().toLocaleTimeString();
    this.mensagem.horario = horario
    this.emitir(this.mensagem)
    this.mensagens.push(...[this.mensagem])
    this.mensagem = new Mensagem();
    this.rolarAutomatico()
  }

  rolarAutomatico() {
    const scrollable = document.querySelector('.mensagens') as HTMLDivElement;
     this.tamanho = scrollable?.scrollHeight
   
    console.log(scrollable?.scrollHeight)
    console.log(this.tamanho)

    setTimeout(function() {
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

}
