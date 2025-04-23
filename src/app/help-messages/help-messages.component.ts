import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-help-messages',
  templateUrl: './help-messages.component.html',
  styleUrl: './help-messages.component.scss'
})
export class HelpMessagesComponent {


  messages: any[] = [];
    selectedMessage: any | null = null; // Store selected message
  
    constructor(private firestore: AngularFirestore) {
      this.fetchMessages();
    }
  
    fetchMessages() {
      this.firestore.collection('helpMessages').snapshotChanges().subscribe(data => {
        this.messages = data.map(e => {
          const message = e.payload.doc.data() as any;
          message.id = e.payload.doc.id;
          return message;
        });
        console.log('Messages fetched:', this.messages);
      });
    }
  
    selectMessage(message: any): void {
      this.selectedMessage = message; // Set selected message when a user is clicked
    }
  
    deleteMessage(messageId: string): void {
      if (confirm('Are you sure you want to delete this message?')) {
        this.firestore.collection('contactMessages').doc(messageId).delete()
          .then(() => {
            console.log('Message deleted successfully');
            if (this.selectedMessage?.id === messageId) {
              this.selectedMessage = null;
            }
          })
          .catch(error => console.error('Error deleting message:', error));
      }
    }
}
