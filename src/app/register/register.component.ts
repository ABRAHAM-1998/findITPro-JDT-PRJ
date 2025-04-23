import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  company = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    services: [''],
    category: '',
    location: '',
    logoUrl: '',
    description: '',
    details: '',
    uid: '',
    createdAt: new Date(),
  };

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar,
    private auth: AngularFireAuth
  ) {}

  // Add new service input field
  addService() {
    this.company.services.push('');
  }

  // Remove service input field
  removeService(index: number) {
    if (this.company.services.length > 1) {
      this.company.services.splice(index, 1);
    }
  }

  // Handle file selection & show preview
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  // Form Submission
  async onSubmit() {
    this.auth.authState.subscribe(async (user) => {
      if (user) {
        // Validate required fields
        if (
          !this.company.name ||
          !this.company.email ||
          !this.company.phone ||
          !this.company.address ||
          !this.company.category ||
          !this.company.location ||
          !this.company.description ||
          !this.company.details
        ) {
          this.snackBar.open('Please fill out all required fields.', 'Close', {
            duration: 3000,
          });
          return;
        }

        if (!this.selectedFile) {
          this.snackBar.open('Please upload a company logo.', 'Close', {
            duration: 3000,
          });
          return;
        }

        this.company.services = this.company.services.filter(
          (service) => service.trim() !== ''
        );

        if (this.company.services.length === 0) {
          this.snackBar.open('Please add at least one valid service.', 'Close', {
            duration: 3000,
          });
          return;
        }

        this.isLoading = true;

        try {
          const docRef = this.firestore.collection('companies').doc(user.uid);
          const docSnapshot = await lastValueFrom(docRef.get());

          if (docSnapshot.exists) {
            this.isLoading = false;
            this.snackBar.open(
              'Company already registered with this account.',
              'Close',
              { duration: 3000 }
            );
            return;
          }

          // const filePath = `company-logos/${Date.now()}_${this.selectedFile.name}`;
          // const fileRef = this.storage.ref(filePath);
          // const uploadTask = this.storage.upload(filePath, this.selectedFile);

          // await lastValueFrom(uploadTask.snapshotChanges());
          // const logoUrl = await lastValueFrom(fileRef.getDownloadURL());

          this.company.logoUrl = 'logoUrl';
          this.company.uid = user.uid;

          await docRef.set({
            ...this.company,
            services: [...this.company.services],
          });

          this.isLoading = false;
          this.snackBar.open('Company registered successfully!', 'Close', {
            duration: 3000,
          });

          this.router.navigate(['/home']);
        } catch (error: any) {
          this.isLoading = false;
          console.error('Error uploading:', error);
          this.snackBar.open(`Error: ${error.message}`, 'Close', {
            duration: 5000,
          });
        }
      } else {
        this.snackBar.open('Please log in to register a company.', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
