import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginReqResp } from '../entities/login-req-resp';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginReqResp: loginReqResp) {
    console.log("data in login service");
    console.log(loginReqResp);
    return this.http.post<any>("http://localhost:8080/api/v1/Login",loginReqResp);
  }

  verifyOtp(loginReqResp: loginReqResp) {
    console.log("data in login service");
    console.log(loginReqResp);
    return this.http.post<any>("http://localhost:8080/api/v1/Verify",loginReqResp);
  }
 

}
