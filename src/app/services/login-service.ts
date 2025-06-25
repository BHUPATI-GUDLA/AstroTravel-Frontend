import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginReqResp } from '../entities/login-req-resp';
import { order } from '../entities/order';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginReqResp: loginReqResp) {
    return this.http.post<any>("http://localhost:8080/api/v1/Login",loginReqResp);
  }

  verifyOtp(loginReqResp: loginReqResp) {
    return this.http.post<any>("http://localhost:8080/api/v1/Verify",loginReqResp);
  }

  createOrder(orderDetails: any){
    return this.http.post<any>("http://localhost:8080/api/v1/create-order",orderDetails,{ observe: 'response' });
  }
 

}
