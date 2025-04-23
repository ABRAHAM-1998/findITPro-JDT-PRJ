import { Component } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  isNavActive = false;


  contactMessage = {
    name: '',
    email: '',
    message: ''
  };
  isLoggedIn: boolean=false;

  constructor(private firestore: AngularFirestore, private snackBar: MatSnackBar, private router : Router,private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
  
  // Toggle navigation sidebar
  toggleNav() {
    this.isNavActive = !this.isNavActive;
  }

  sendMessage() {
    if (!this.contactMessage.name || !this.contactMessage.email || !this.contactMessage.message) {
      this.snackBar.open('Please fill all fields!', 'Close', { duration: 3000 });
      return;
    }
    this.firestore.collection('contactMessages').add(this.contactMessage).then(() => {
      this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
      
      // Reset form fields after submission
      this.contactMessage = { name: '', email: '', message: '' };
    }).catch(error => {
      this.snackBar.open('Error sending message: ' + error.message, 'Close', { duration: 5000 });
    });
  }

  goToHome() {
    console.log(user)
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    } else {
      alert('You need to log in first!');
      this.router.navigate(['/login']);
    }
  }

}
