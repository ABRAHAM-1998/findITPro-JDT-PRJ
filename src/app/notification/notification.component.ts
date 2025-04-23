import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  activeTabIndex: number = 0;
  changeTab(index: number): void {
    this.activeTabIndex = index;
  }
  
}
