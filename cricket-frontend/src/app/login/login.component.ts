import { Component,OnInit } from '@angular/core';
import { FormsModule ,FormControl,Validators,FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
loginForm!: FormGroup;
otpForm!: FormGroup;
isOtpDiv = false;
authError: string = '';
isError: any = "";

constructor(private authService: AuthserviceService, private router: Router) {}

ngOnInit() {
    this.loginForm = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required,Validators.maxLength(16)])
    });

    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.maxLength(4)])
    });
  }
login() {
  if(this.loginForm.valid) {
   console.log(this.loginForm.value);
   



    
  }
}

}
