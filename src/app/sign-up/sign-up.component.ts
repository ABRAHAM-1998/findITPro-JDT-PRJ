
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../SERVICE/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  // Define the form fields and their initial values
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Error message variables
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router,private afAuth:AngularFireAuth,private snackBar:MatSnackBar,private firestore:AngularFirestore) {}

  // Method to handle the signup form submission
  onSubmit() {
    // Reset error message and success message
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation
    if (!this.user.fullName || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    if ((this.user.password && this.user.confirmPassword).length>=8) {
      this.errorMessage = 'Passwords must more than 8 charecters';
      return;
    }
    console.log(this.user);
    this.onRegister();

    // Simulate an API request (this would normally be an actual HTTP request)
  }
  async onRegister() {
    if (this.user) {
      try {
        const result = await this.afAuth.createUserWithEmailAndPassword(this.user.email, this.user.password);
        console.log(result)
        
        const userData: User = {
          uid: result.user?.uid || '',
          name:this.user.fullName,
          email:this.user.email,
          emailVerified: result.user?.emailVerified || false,
          role:'',
          address:'',
          gender:''
        };

        await this.firestore.collection('users').doc(result.user?.uid).set(userData);
        
        this.snackBar.open('Registration Successful', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      } catch (error: any) {
        this.snackBar.open(`Error: ${error.message}`, 'Close', { duration: 5000 });
      }
    } else {
      this.snackBar.open('Please fill out the form correctly', 'Close', { duration: 3000 });
    }
  }
}
