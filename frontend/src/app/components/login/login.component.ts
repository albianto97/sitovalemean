import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    loginForm: FormGroup;

    constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
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
      this.userService.login(newUser).subscribe((response: any) => {
        console.log(response);
        if (response.isValid) {
          // Login riuscito, salva il token e naviga al profilo
          this.userService.saveToken(response.token);
          this.router.navigate(['/profile']);
        }
      });
    }
  }
  }

