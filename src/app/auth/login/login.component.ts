import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userData;
  isEnableOTP: boolean = false;
  loginForm: FormGroup;
  intervalId = 0;
  message;
  seconds = 11;
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router: Router) {}

  ngOnInit() {
    this.userService.currentUserData.subscribe(userData => (this.userData = userData));
    this.loginForm =  this.fb.group({
      PhoneNumber: new FormControl(null, [Validators.required]),
      Otp: new FormControl(null, [Validators.required])
    })
  }

  changeData(event) {
    var msg = event.target.value;
    this.userService.changeData(msg);
  }
  login(data) {
    this.userService.changeData(data);
  }

  clearTimer() { clearInterval(this.intervalId); }
  stop()  {
    this.clearTimer();
    if(this.loginForm.controls.Otp.invalid)
      this.loginForm.controls.Otp.disable();
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.message = '';
        this.stop();
      } else {
        if (this.seconds < 0) { this.seconds = 10; } // reset
        this.message = `${this.seconds}`;
      }
    }, 1000);
  }


  sendOtp(data: boolean){
    console.log("this.logn", this.loginForm)
    this.loginForm.controls.Otp.enable();
    if (this.loginForm.controls.PhoneNumber.invalid) {
      return;
    } 
      // if (data) {
    
    this.isEnableOTP = true;
    console.log("this.userService",this.loginForm)
    this.countDown()
    this.userService.sendOtp(this.loginForm.value.PhoneNumber).subscribe(res=>{
      console.log("res");
    })
      
    
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    } 
    let req= {
      phone_number: this.loginForm.value.PhoneNumber,
      otp: this.loginForm.value.Otp
    }
    this.userService.login(req).subscribe(res=>{
      console.log("res", res)
      if (res)
        this.router.navigate(['/dashboard']);
    },err=>{
      console.log(err);
    })
  }
}
