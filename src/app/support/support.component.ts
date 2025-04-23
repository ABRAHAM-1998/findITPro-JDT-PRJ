import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {

  helpMessage = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private firestore:AngularFirestore,private snackBar:MatSnackBar){}

  sendMessage() {
    if (!this.helpMessage.name || !this.helpMessage.email || !this.helpMessage.subject || !this.helpMessage.message) {
      this.snackBar.open('Please fill all fields!', 'Close', { duration: 3000 });
      return;
    }
    this.firestore.collection('helpMessages').add(this.helpMessage).then(() => {
      this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
      
      // Reset form fields after submission
      this.helpMessage = { name: '', email: '',subject:'', message: '' };
    }).catch(error => {
      this.snackBar.open('Error sending message: ' + error.message, 'Close', { duration: 5000 });
    });
  }
}
