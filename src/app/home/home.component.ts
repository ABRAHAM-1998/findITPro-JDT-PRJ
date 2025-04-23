import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: any = null;
  companies: any[] = [];
  filteredCompanies: any[] = [];
  selectedCategory: string = 'All';

  isFilterMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((userData) => {
            this.user = userData;
            console.log('Current user:', this.user);
    this.fetchCompanies();

          });
      }
    });
  }

  fetchCompanies() {
    console.log(this.user);
    if (!this.user?.uid) return;
  
    this.firestore
      .collection('companies')
      .ref.where('uid', '!=', this.user.uid)
      .get()
      .then((querySnapshot) => {
        const companies: any[] = [];
  
        querySnapshot.forEach((doc) => {
          const companyData = doc.data() as any
          const id = doc.id;
          console.log(id)
          companyData.id! = id;
  
          // ✅ Ensure both data and id are collected
          companies.push({
            id,
            ...companyData!,
          });
        });
        console.log('Companies:', companies);
  
        this.companies = companies;
  
        // Calculate average ratings for each company
        this.companies.forEach((company) => {
          this.calculateAverageRating(company.id, company);
        });
  
        this.filterCompanies();
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      });
  }
  

  calculateAverageRating(companyId: string, company: any) {
    this.firestore
      .collection(`companies/${companyId}/reviews`)
      .valueChanges()
      .subscribe((reviews) => {
        if (reviews.length > 0) {
          const totalStars = reviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          );
          company.averageRating = parseFloat((totalStars / reviews.length).toFixed(1));
        } else {
          company.averageRating = 0;
        }

        this.firestore
          .collection('companies')
          .doc(companyId)
          .update({ averageRating: company.averageRating });
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.user = null;
      this.isUserMenuOpen = false;
      this.router.navigate(['login']);
    });
  }

  filterCompanies() {
    this.filteredCompanies =
      this.selectedCategory === 'All'
        ? this.companies
        : this.companies.filter(
            (company) => company.category === this.selectedCategory
          );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterCompanies();
  }

  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  viewCompanies(object: any) {
    const extras: NavigationExtras = {
      state: object,
    };
    this.router.navigate(['/view-details'], extras);
  }
}
