import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import  Firebase from 'firebase';
import { TabsComponent } from '../../tabs/tabs-component/tabs.component';


@Component({
  templateUrl: './facebook-connect.html'
})
export class FacebookConnectComponent {
  account: {username: string, password: string} = {
    username: '',
    password: ''
  };
  user: any;
  zone: any;
  
  constructor(
    private navController: NavController,
    public toastController: ToastController,
    private platform: Platform,
    private storage: Storage,
    private fb: Facebook) {}

    ngOnInit() {

        this.getUser();

    }

    getUser() {
        this.storage.get('facebook.user')
        .then(data => {
            if(data) {
                this.user = JSON.parse(data);
            } else {
                 this.storage.get('user')
                      .then(data2 => {
                          if(data2) {
                              this.user = JSON.parse(data2);
                          }
                      })
                      .catch(err => console.log(err));
            }
        });
    }


    login() {
        let env = this;
        let permissions = new Array();
        permissions = ['public_profile', 'user_friends', 'email'];

        this.fb.login(permissions)
        .then((response: FacebookLoginResponse) => {
            let userId = response.authResponse.userID;
            let params = new Array();

            this.fb.api("/me?fields=name,gender,email", params)
            .then(function(response) {
                response.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                env.user = response;
                console.log(env.user);
                env.storage.set('facebook.user', JSON.stringify(env.user));
            })
        })
        .catch(e => console.log('Error logging into Facebook', e));

       
    }


    loginEmail() {
    let self = this;
        let message = 'Succesful Login';

      let toast = this.toastController.create({
        message: message,
        duration: 3000,
        position: 'bottom'
      });


        Firebase.auth().signInWithEmailAndPassword(this.account.username, this.account.password).catch(function(error) {
          // Handle Errors here.
          console.log("ERROR: "+error);
         let toast2 = self.toastController.create({
            message: ""+error,
            duration: 4000,
            position: 'bottom'
          });
          toast2.present();
        });

        toast.present();
     this.navController.setRoot(TabsComponent);
    //this.ngOnInit();
  }

  register() {
    let self = this;
        let message = 'Adding you...';
      let toast = this.toastController.create({
        message: message,
        duration: 2000,
        position: 'bottom'
      });
    toast.present();
    Firebase.auth().createUserWithEmailAndPassword(this.account.username, this.account.password).catch(function(error) {
      // Handle Errors here.
      console.log("ERROR: "+error);
      let toast3 = self.toastController.create({
        message: ""+error,
        duration: 4000,
        position: 'bottom'
      });
      toast3.present();
    });
    this.navController.setRoot(this.navController.getActive().component);
  }

    logoutFB() {
        let env = this;
        this.fb.logout()
        .then(function(response){
            env.user = null;
            env.storage.remove('facebook.user');
        }, function(error){});
    }

  logout() {  
  let env = this;      
    let message = 'Logged Out';
      let toast = this.toastController.create({
        message: message,
        duration: 2000,
        position: 'bottom'
      });
 
     this.fb.logout()
        .then(function(response){
            env.user = null;
            env.storage.remove('facebook.user');
        }, function(error){});

    this.storage.remove('user');
    Firebase.auth().signOut().then(function() {
      console.log('jus logged out');
    }).catch(function(error) {
      console.log(error);
    });
    toast.present();
    this.navController.setRoot(this.navController.getActive().component);

  }

}
