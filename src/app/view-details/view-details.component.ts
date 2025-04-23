import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent implements OnInit, AfterViewInit {
  companies: any[] = [];
  state: any;
  companyId: string = '';

  // ⭐ Review & Rating Variables
  reviews: any[] = [];
  userRating: number = 0;
  userComment: string = '';
  averageRating: number = 0;

  constructor(
    private firestore: AngularFirestore,
    private activateRoute: ActivatedRoute,
    private route: Router
  ) {
    this.state = this.route.getCurrentNavigation()?.extras.state;
    console.log(this.state);
  }

  ngOnInit(): void {
    this.fetchCompanies();

    // Get company ID from state and fetch reviews
    if (this.state && this.state.id) {
      this.companyId = this.state.id;
      this.fetchReviews();
    }
  }

  ngAfterViewInit(): void {
    if (this.state && this.state.location) {
      this.initMap();
    }
  }

  fetchCompanies() {
    this.firestore.collection('companies').snapshotChanges().subscribe(data => {
      this.companies = data.map(e => {
        const company = e.payload.doc.data() as any;
        company.id = e.payload.doc.id;
        return company;
      });
    });
  }

  // ⭐ Handle Star Click
  selectRating(rating: number) {
    this.userRating = rating;
  }

  // 💬 Submit Review
  submitReview() {
    if (this.userRating === 0 || this.userComment.trim() === '') {
      alert('Please provide a rating and a comment.');
      return;
    }

    const newReview = {
      rating: this.userRating,
      comment: this.userComment,
      timestamp: new Date(),
    };

    this.firestore.collection(`companies/${this.companyId}/reviews`).add(newReview)
      .then(() => {
        alert('Review submitted successfully!');
        this.userRating = 0; // Reset rating
        this.userComment = ''; // Reset comment
        this.fetchReviews(); // Refresh reviews
      })
      .catch(error => console.error('Error submitting review:', error));
  }

  // 🔄 Fetch Reviews
  fetchReviews() {
    this.firestore.collection(`companies/${this.companyId}/reviews`, ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .subscribe(snapshot => {
        this.reviews = snapshot.map(doc => doc.payload.doc.data());
      });
  }

  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
    } else {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = parseFloat((totalRating / this.reviews.length).toFixed(1));
    }
    
    // Store the average rating in Firebase
    this.firestore.collection('companies').doc(this.companyId).update({
      averageRating: this.averageRating
    }).catch(error => console.error('Error updating average rating:', error));
  }

  // 📍 Initialize Google Map
  initMap(): void {
    const geocoder = new google.maps.Geocoder();
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 14,
      center: { lat: 0, lng: 0 } // Default center
    });

    geocoder.geocode({ address: this.state.location }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map,
          position: results[0].geometry.location
        });
      } else {
        console.error('Geocode failed: ' + status);
      }
    });
  }


  fnChat(){
    this.route.navigate(['/chat'], {
      state: this.state
    });
  }
}
