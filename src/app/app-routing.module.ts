import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { InicioComponent } from './global/components/inicio/inicio.component';
import { LayouteComponent } from './layoute/layoute.component';
import { NotFoundComponent } from './global/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('././chat/chat.module').then( (mod)=> mod.ChatModule)
  },

  { path: 'sign-in', component: InicioComponent },

  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
