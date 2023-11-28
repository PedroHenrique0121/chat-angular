import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayouteComponent } from './layoute/layoute.component';

import { ChatComponent } from './chat/chat.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { InicioComponent } from './global/components/inicio/inicio.component'

import { ChatModule } from './chat/chat.module';
import { SocketService } from './global/services/socket.service';
import { GlobalModule } from './global/global.module';


@NgModule({
  declarations: [
    AppComponent,
    LayouteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    IonicModule.forRoot(),
    FormsModule,
    SocketIoModule,
    FormsModule,
    ReactiveFormsModule,
    ChatModule,
    GlobalModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
