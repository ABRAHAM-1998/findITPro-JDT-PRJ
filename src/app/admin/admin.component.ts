import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  companies: any[] = [];
  totalCompanies: number=0;

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit() {
    this.fetchCompanies();
  }

  // ✅ Fetch all companies from Firebase
  fetchCompanies() {
    this.firestore.collection('companies').snapshotChanges().subscribe(snapshot => {
      this.companies = snapshot.map(doc => ({
        id: doc.payload.doc.id,
        ...doc.payload.doc.data() as any
      }));
      this.totalCompanies = this.companies.length;
    });
    
  }

  // ✅ Delete a company
  deleteCompany(companyId: string) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.firestore.collection('companies').doc(companyId).delete()
        .then(() => alert('Company deleted successfully!'))
        .catch(error => console.error('Error deleting company:', error));
    }
  }

  // ✅ Edit a company (redirect to edit page)
  editCompany(companyId: string) {
    this.router.navigate(['/edit-company', companyId]);
  }

  // ✅ Verify a company
  verifyCompany(companyId: string) {
    this.firestore.collection('companies').doc(companyId).update({ verified: true })
      .then(() => alert('Company verified successfully!'))
      .catch(error => console.error('Error verifying company:', error));
  }

}
