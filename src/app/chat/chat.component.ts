import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Timestamp } from '@angular/fire/firestore';

interface Message {
  sender: string;
  receiver: string;
  text: string;
  timestamp: any;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;
  state: any;
  currentUser: any;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.state = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      console.log('User state:', user?.uid);
      if (user) {
        this.afs
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((userData: any) => {
            this.currentUser = userData;
            console;
            console.log('Current state:', this.state);
            this.currentUser.uid = user.uid;
            this.loadMessages();
            this.loadChatUsers();
          });
      }
    });
  }

  loadMessages() {
    const chatId = this.getChatId(this.currentUser.uid, this.state.uid);
    this.afs
      .collection(`chats/${chatId}/messages`, (ref) => ref.orderBy('timestamp'))
      .valueChanges()
      .subscribe((msgs: any) => {
        this.messages = msgs;
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const chatId = this.getChatId(this.currentUser.uid, this.state.uid);
    const message: Message = {
      sender: this.currentUser.uid,
      receiver: this.state.uid,
      text: this.newMessage,
      timestamp: Timestamp.now(),
    };

    this.afs
      .collection(`chats/${chatId}/messages`)
      .add(message)
      .then(() => {
        this.newMessage = '';
      })
      .catch((error) => {
        this.snackBar.open(`Error sending message: ${error.message}`, 'Close', {
          duration: 3000,
        });
      });
  }

  getChatId(uid1: string, uid2: string): string {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop =
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  chatUsers: any[] = [];

  loadChatUsers() {
    this.afs
      .collectionGroup('messages', (ref) =>
        ref.where('sender', '==', this.currentUser.uid)
      )
      .valueChanges()
      .subscribe((messages: any[]) => {
        const receiverUids = [...new Set(messages.map((msg) => msg.receiver))];
  
        const fetchedUsers: any[] = [];
  
        receiverUids.forEach((uid, index) => {
          this.afs
            .collection('users')
            .doc(uid)
            .valueChanges()
            .subscribe((userData: any) => {
              if (userData) {
                fetchedUsers.push({ ...userData, uid });
  
                if (fetchedUsers.length === receiverUids.length) {
                  this.chatUsers = Array.from(
                    new Map(fetchedUsers.map(user => [user.uid, user])).values()
                  );
                }
              }
            });
        });
      });
  }
  
  loadChatWith(user: any) {
    this.state = user;
    this.loadMessages(); 
  }
}
