import { Component } from '@angular/core';
import { AuthService } from '../SERVICE/auth.service';
import { Router } from '@angular/router';
import { User } from '../SERVICE/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public password: any;
  public email: any;
  private readonly userDataKey = "encryptedUserData";

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {

  }

  async onLogin(email: string, password: string) {
    try {
      const user = (await this.authService.SignIn(email, password))
      if (user) {
        console.log(user)
        const encryptedUserData = btoa(JSON.stringify(user));
        localStorage.setItem(this.userDataKey, encryptedUserData);
        if(user.role == "ADMIN"){
          this.router.navigate(['admin'])
        }else{
          this.router.navigate(['home'])
        }

      } else {
        console.error("Invalid user object:", user);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
  async ngOnInit(): Promise<void> {
      const encryptedUserData = localStorage.getItem("encryptedUserData");
      if (encryptedUserData) {
        const userEnc = atob(encryptedUserData!);
        const userData: User = JSON.parse(userEnc!);
        if(userData.role == "ADMIN"){
          this.router.navigate(['admin'])
        }else{
          this.router.navigate(['home'])
        }
    }

  }

}