import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { InicioComponent } from './inicio/inicio.component';
import { LayouteComponent } from './layoute/layoute.component';

const routes: Routes = [

  {path: "", component: LayouteComponent, children:[
    {path: "chat", component: ChatComponent},
    {path: "login", component: InicioComponent},
    {path: "", redirectTo:"/login", pathMatch: "full"}
  ]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
