import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { login, loginReq } from '../model/login';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL = environment.baseUrl;
  
  constructor( private http: HttpClient) { }

  sendOtp(data): Observable<string> {
    let req= {
      phone_number: data
    }
    return this.http.post<string>(this.baseURL +`sendOtp`, req);
  }

  login(req: loginReq): Observable<login> {
    return this.http.post<login>(this.baseURL +`Login`, req)
    .pipe(map(resp => {
        sessionStorage.setItem("phone_number", req.phone_number);
        sessionStorage.setItem("otp", req.otp)
        sessionStorage.setItem("token", resp.token)
        return resp;
    }));
  }

}
