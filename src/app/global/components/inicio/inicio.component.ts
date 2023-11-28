import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  form: FormGroup
  user: User;

  constructor(private router: Router) {
    this.user = new User()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    });

    this.focarInput();
  }
  
  goToChat() {

    if (this.form.invalid) {
      return;
    }
    this.router.navigate(["/chat"], { state: { user: this.user } })
    this.user = new User()
  }

  focarInput() {
    document.getElementById("name")?.focus()
  }
}
