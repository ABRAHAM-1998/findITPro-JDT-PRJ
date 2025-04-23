import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  user: any = null;
  activeTabIndex: number = 0;

  name="Ajmal Roshan K K";
  email="ajmalroshandev@gmail.com"


  constructor(
      private firestore: AngularFirestore,
      private afAuth: AngularFireAuth,
    ) {}

    ngOnIt(){
      this.getCurrentUser();
      console.log(this.user);
    }

    getCurrentUser() {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.firestore.collection('users').doc(user.uid).valueChanges().subscribe(userData => {
            this.user = userData;
          });
        }else {
          this.user = null;  // If no user is logged in, set user to null
        }
      });
    }

  // Method to change the active tab
  changeTab(index: number): void {
    this.activeTabIndex = index;
  }
}
