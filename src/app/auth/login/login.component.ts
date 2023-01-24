import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { ToasterService } from 'src/app/shared/toaster.service';

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
  mask
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService) {}

  ngOnInit() {
    this.loginForm =  this.fb.group({
      PhoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)]),
      Otp: new FormControl(null, [Validators.required])
    })

    this.loginForm.controls.Otp.valueChanges.subscribe(value=>{
      this.stop();
    })
  }

  clearTimer() { clearInterval(this.intervalId); }
  stop()  {
    this.clearTimer();
    this.message = '';
    this.seconds = 11;
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


  resendOtp() {
    this.loginForm.controls.Otp.setValue(null);
    this.callSendOtp();
  }


  sendOtp(){
    this.loginForm.controls.Otp.enable();
    if (this.loginForm.controls.PhoneNumber.invalid) {
      return;
    } 
    
    this.isEnableOTP = true;
    this.loginForm.controls.PhoneNumber.disable();
    this.callSendOtp();
  }

  callSendOtp() {
    this.countDown()
    this.userService.sendOtp(this.loginForm.getRawValue().PhoneNumber).subscribe(res=>{
      this.toaster.show('success','','OTP sent');
    })
  }

  changeNumber() {
    this.loginForm.controls.PhoneNumber.enable();
    this.stop();
    this.isEnableOTP = false;
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    } 
    let req= {
      phone_number: this.loginForm.getRawValue().PhoneNumber,
      otp: this.loginForm.getRawValue().Otp
    }
    this.userService.login(req).subscribe(res=>{
      this.toaster.show('success','','Login Successful');
      if (res)
        this.router.navigate(['/dashboard']);
    },err=>{
      console.log(err);
      this.toaster.show('error','','Login Failed');
    })
  }
}
