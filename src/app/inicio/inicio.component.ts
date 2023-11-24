import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  
  formulario!: FormGroup
  usuario!: Usuario;

  constructor(private router: Router) {
    this.usuario = new Usuario()
    
   }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    },);
    this.focarInput()
    console.log(this.formulario.invalid)
  }

   get nome(){
     return this.formulario.get("nome")
   }

  enviarParaChat(){
   
    console.log(this.formulario.valid)
    if (this.formulario.invalid) {
      return;
    }
       this.router.navigate(["/chat"], {state:{usuario: this.usuario}})
       this.usuario= new Usuario()
  }

  focarInput(){
    document.getElementById("nome")?.focus()
  }
}
