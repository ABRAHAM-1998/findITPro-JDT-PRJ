import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  private readonly userDataKey = 'encryptedUserData';


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkUserAuthentication();
  }

  private checkUserAuthentication(): Observable<boolean> {
    const storedUser = localStorage.getItem(this.userDataKey);
    if (storedUser) {
      return this.afAuth.authState.pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}