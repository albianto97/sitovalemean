import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
    loginForm: FormGroup;
  
    constructor(private userService: UserService, private fb: FormBuilder) {
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
        var newUser = new User("atest@test.it", "username", "pddsw");
        this.userService.login(newUser).subscribe((response: any) => {
          console.log(response);
        });
      }
    }
  }
  
