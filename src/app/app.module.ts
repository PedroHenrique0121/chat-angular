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
import { InicioComponent } from './inicio/inicio.component'
import { SocketService } from './services/socket.service';


@NgModule({
  declarations: [
    AppComponent,
    LayouteComponent,
    
    ChatComponent,
         InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    IonicModule.forRoot(),
    FormsModule,
    SocketIoModule,
    FormsModule,
    ReactiveFormsModule
   
    
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
