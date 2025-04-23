import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-comp',
  templateUrl: './chat-comp.component.html',
  styleUrls: ['./chat-comp.component.scss']
})
export class ChatCompComponent implements OnInit {
  currentUserUid: string = '';
  chatUsers: any[] = [];

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid;
        this.loadAllChats();
      }
    });
  }

  loadAllChats() {
    this.afs.collectionGroup('messages', ref =>
      ref.where('sender', '==', this.currentUserUid).orderBy('timestamp', 'desc')
    ).valueChanges().subscribe((sentMsgs: any[]) => {
      this.afs.collectionGroup('messages', ref =>
        ref.where('receiver', '==', this.currentUserUid).orderBy('timestamp', 'desc')
      ).valueChanges().subscribe((receivedMsgs: any[]) => {
        const allUids = new Set([
          ...sentMsgs.map(msg => msg.receiver),
          ...receivedMsgs.map(msg => msg.sender)
        ]);

        const fetchedUsers: any[] = [];

        allUids.forEach(uid => {
          this.afs.collection('users').doc(uid).valueChanges().subscribe(userData => {
            if (userData) {
              fetchedUsers.push({ ...userData, uid });
              this.chatUsers = Array.from(
                new Map(fetchedUsers.map(user => [user.uid, user])).values()
              );
            }
          });
        });
      });
    });
  }

  // Function to load chat with selected user
  loadChatWith(user: any) {
    const chatId = this.getChatId(this.currentUserUid, user.uid);
    this.router.navigate(['/chat'], { state: user });
  }

  getChatId(uid1: string, uid2: string): string {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }
}
