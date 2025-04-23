import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  name="Ajmal Roshan K K";
  email="ajmalroshandev@gmail.com"
  user: any = null;
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.getCurrentUser();
    console.log(this.user)
  }
  getCurrentUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe(userData => {
          this.user = userData;
        });
      }
    });
  }


  logout() {
    this.afAuth.signOut().then(() => {
      this.user = null;
      this.router.navigate(['login']);  
    });
  }
}
