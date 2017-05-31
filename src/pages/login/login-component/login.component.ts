import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import  Firebase from 'firebase';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: './login.html'
})
export class LoginComponent {
  account: {username: string, password: string} = {
    username: '',
    password: ''
  };
  public fb : any;
  public user : any;
  
  constructor(
    private navController: NavController,
    private toastController: ToastController,
    public storage: Storage) {

      this.getUser();
      
  }

  login() {
        let message = 'Succesful Login';
    let toast = this.toastController.create({
        message: message,
        duration: 3000,
        position: 'bottom'
      });


   /* Firebase.auth().currentUser.link(credential).then(function(user) {
      console.log("Anonymous account successfully upgraded", user);
      toast.present();
    }, function(error) {
      console.log("Error upgrading anonymous account", error);
    }); */


    Firebase.auth().signInWithEmailAndPassword(this.account.username, this.account.password).catch(function(error) {
      // Handle Errors here.
      console.log("ERROR: "+error);
    });
   /* var credential = firebase.auth.EmailAuthProvider.credential(this.account.username, this.account.password);
    this.fb.auth.currentUser.link(credential).then(function(user) {
      console.log("Anonymous account successfully upgraded", user);
      toast.present();
    }, function(error) {
      console.log("Error upgrading anonymous account", error);
    });
    */
    this.getUser();
  this.navController.setRoot(this.navController.getActive().component);
    
  }

  register() {
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
    });
    
  }

  logout() {        
    let message = 'Logged Out';
      let toast = this.toastController.create({
        message: message,
        duration: 2000,
        position: 'bottom'
      });
    
    this.storage.remove('user');
    Firebase.auth().signOut().then(function() {
      console.log('jus logged out');
    }).catch(function(error) {
      console.log(error);
    });
    toast.present();
    this.navController.setRoot(this.navController.getActive().component);

  }

    getUser() {
        this.storage.get('user')
        .then(data => {
            if(data) {
                this.user = JSON.parse(data);
                
            }
        })
        .catch(err => console.log(err));
        
    }

}
