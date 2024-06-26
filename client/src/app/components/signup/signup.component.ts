import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import { SignupService } from 'src/app/service/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = {
    email: '',
    password: '',
    name: '',
    location:'',
  
  };
  message: string = '';
  constructor(private userService: SignupService) { }

  ngOnInit(): void {
  }
  signup(): void {
    if (!this.user.email || !this.user.password || !this.user.name ) {
      this.message = 'All fields are required';
      return;
    }

    this.userService.signup(this.user).subscribe(
      response => {
        this.message = response.message;
      },
      error => {
        console.error('Error during signup:', error);
        this.message = 'Signup failed. Please try again.';
      }
    );
  }
}
