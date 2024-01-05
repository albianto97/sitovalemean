import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    loginForm: FormGroup;

    constructor(private authService: AuthService,
       private fb: FormBuilder,
       private router: Router) {
      this.loginForm= this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

    ngOnInit() {
      console.log("Inizializzo: Log-In");
    }

    onSubmit() {

      if (this.loginForm.valid) {
        var newUser = new User(this.loginForm.value.email, "username", this.loginForm.value.password);
        this.authService.login(newUser).subscribe((response: any) => {
          this.router.navigate(['']);
        });
      }
    }
  }

