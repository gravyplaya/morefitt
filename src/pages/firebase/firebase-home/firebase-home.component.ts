import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import { FirebaseLoginComponent } from '../firebase-login/firebase-login.component';
import { FirebaseSignUpComponent } from '../firebase-sign-up/firebase-sign-up.component';
import { FirebaseResetPasswordComponent } from '../firebase-reset-password/firebase-reset-password.component';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

import { InAppPurchase } from '@ionic-native/in-app-purchase';

@Component({
  templateUrl: './firebase-home.html'
})
export class FirebaseHomeComponent {
  
  auth: any;
  loading: boolean;
    subd: boolean  = false;
  isIOS: boolean; 

  constructor(
    private navController: NavController,
    private toastController: ToastController,
    private angularFireAuth: AngularFireAuth,
    private firebaseDB: AngularFireDatabase,
    private platform: Platform,
    private storage: Storage,
    private iap: InAppPurchase,
    private http: Http,
    private fb: Facebook) {}

  ngOnInit() {
    this.loading = true;
    this.isIOS = this.platform.is('ios');
    this.angularFireAuth.authState.subscribe(data => {
      if (data) {
          this.auth = data;
      } else {
        this.auth = null;
      }
      this.loading = false;
    });
  }

  loginWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then((data) => {
          this.auth = data;
          this.storage.set('facebook.user', JSON.stringify(data));
        }).catch((error) => {
          let errorMessage = error;
          if (errorMessage && errorMessage.message) {
            let message = errorMessage.message.replace(/<(?:.|\n)*?>/gm, '');
            let toast = this.toastController.create({
              message: message,
              duration: 6000,
              position: 'bottom'
            });
            toast.present();
           }
        });
      })
    }
    else {
      return this.angularFireAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((data) => {
        this.auth = data.user;
        this.storage.set('facebook.user', JSON.stringify(data.user));
      }).catch((error) => {
        let errorMessage = error;
        if (errorMessage && errorMessage.message) {
          let message = errorMessage.message.replace(/<(?:.|\n)*?>/gm, '');
          let toast = this.toastController.create({
            message: message,
            duration: 6000,
            position: 'bottom'
          });
          toast.present();
         }
      });
    }
  }

  restorePurchases() {
    if (!this.isIOS) {
      this.iap.restorePurchases()
       .then((res) => {
         console.log(res);
           if (res.state == 0) {
             this.subd = true;
          this.storage.set('subd', true);
           }

       })
       .catch((err) => {
         console.log(err);
       });
      }

    if (this.isIOS) {
      this.iap.getReceipt()
       .then((res) => {
          // production url: https://buy.itunes.apple.com/verifyReceipt
                  this.http.post('https://buy.itunes.apple.com/verifyReceipt', JSON.stringify({"receipt-data": res, "password": "69de8559225b46b7a898e21f03be11d2"}))
                    .map(response => response.json())
                    .subscribe(
                        response => {
                            if (response.status == 0) {
                                console.log(response);
                               this.subd = true;
                              this.storage.set('subd', true);
                            } else {
                                console.log(response);
                            }
                        }, error => {
                            console.log(error);
                        }
                    );
         

       })
       .catch((err) => {
         console.log(err);
       });
      } 
  }

  login() {
    this.navController.push(FirebaseLoginComponent);
  }

  logout() {
      this.angularFireAuth.auth.signOut();
      this.storage.remove('facebook.user');
  }

  signUp() {
    this.navController.push(FirebaseSignUpComponent);
  }

  resetPassword() {
    this.navController.push(FirebaseResetPasswordComponent);
  }

}
