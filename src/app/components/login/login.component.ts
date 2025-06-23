import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { loginReqResp } from '../../entities/login-req-resp';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  otpSent = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginService: LoginService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['']
    });
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;  // fetching email value
    let data: loginReqResp = {
      emailId: this.loginForm.get('email')?.value,
      OTP: ''
    }

    this.loginService.login(data).subscribe({
      next: (response: loginReqResp) => {
        this.otpSent = true;
        console.log('below is the response');
        console.log('email ' + response.emailId);
        console.log('OTP ' + response.OTP);
      },
      error: () => {
        alert('Failed to send OTP');
      }
    });
  }




  verifyOtp() {
    const { email, otp } = this.loginForm.value;
    let data: loginReqResp = {
      emailId: email,
      OTP: otp
    }
    this.loginService.verifyOtp(data).subscribe({
      next: (response: loginReqResp) => {
        alert("OTP IS VERIFIED ...")
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('OTP verification failed');
      }
    });


    // this.http.post<any>('http://localhost:8080/api/v1/Verify', data).subscribe({
    //   next: (response: loginReqResp) => {
    //     alert("OTP IS VERIFIED ...")
    //   },
    //   error: () => {
    //     alert('OTP verification failed');
    //   }
    // });

  }

}
