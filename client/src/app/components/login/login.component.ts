import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    email: '',
    password: '',
    name: '',
    location:'',
 
  
  };
  hide = true;
  formUser!: FormGroup;
  message: string = '';
  
  constructor(private userService:LoginService , private router: Router,private formBuilder: FormBuilder) {
    
    this.formUser = this.formBuilder.group({

      email:['', [Validators.required, Validators.email]],

      password:['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
  login():void{
    if (!this.formUser.value.email || !this.formUser.value.password) {
      this.message = 'All fields are required';
      return;
    }
    this.userService.login(this.formUser.value).subscribe(
      response=>{
        this.message=response.message;
        this.userService.setLoggedInUser(response.user);
      
        console.log("wlc :)");
        console.log(response);
        this.router.navigate(['/buy-energy']); 
        console.log();
        
      },
      error => {
        console.error('Error during signup:', error);
        this.message = 'Signup failed. Please try again.';
      }
    )
  }

}
