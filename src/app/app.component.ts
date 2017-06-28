import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';;
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate';
import { Config } from './app.config';
//import  WooCommerceAPI  from 'woocommerce-api';
import { Deploy } from '@ionic/cloud-angular';
import { TabsComponent } from '../pages/tabs/tabs-component/tabs.component';
//import { HomeComponent } from '../pages/home/home-component/home.component';
import { WordpressFavorites } from '../pages/wordpress/wordpress-favorites/wordpress-favorites.component';
//import { GridComponent } from '../pages/grid/grid-component/grid.component';
//import { DatetimeComponent } from '../pages/datetime/datetime-component/datetime.component';
//import { RangesComponent } from '../pages/ranges/ranges-component/ranges.component';
import { SettingsComponent } from '../pages/settings/settings-component/settings.component';
//import { ActionSheetComponent } from '../pages/action-sheet/action-sheet-component/action-sheet.component';
//import { PlaceholderComponent } from '../pages/placeholder/placeholder-component/placeholder.component';
import { FacebookConnectComponent } from '../pages/facebook-connect/facebook-connect-component/facebook-connect.component';
//import { LoginComponent } from '../pages/login/login-component/login.component';
import { WordpressMenus } from '../pages/wordpress/wordpress-menus/wordpress-menus.component';
import { ContactComponent } from '../pages/contact/contact-component/contact.component';
import { FirebaseHomeComponent } from '../pages/firebase/firebase-home/firebase-home.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


@Component({
	templateUrl: './app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;
	fb : any;
	rootPage = TabsComponent;
	menuPage = WordpressMenus;
	pages: Array<{title: string, component: any, icon: string, params?: any}>;
	wordpressMenusNavigation: boolean = false;
	products = "";
	user: any;
	subd: boolean;


	constructor(
		private platform: Platform,
		private translate: TranslateService,
    	private storage: Storage,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
    //public wc: WooCommerceAPI,
    	public deploy: Deploy,
		private config: Config,
		private loadingController: LoadingController,
		private ga: GoogleAnalytics		
		) {
		this.initializeApp();


// SET LANGUAGE	
		this.translate.setDefaultLang('en');
		storage.get('language').then((value) => {
			if (value) {
				this.translate.use(value);
			} else {
				this.translate.use('en');
				this.storage.set('language', 'en');
			}
		});
		storage.get('subd').then((value) => {
			if (value) {
				this.subd = true;
			} else {
				this.storage.set('subd', false);
			}
		});

		this.pages = [
		  { title: 'Home', component: TabsComponent, icon: 'home' },
			//{ title: 'All', component: HomeComponent, icon: 'home' },
				{ title: 'Favorites', component: WordpressFavorites, icon: 'heart' },
	      { title: 'Settings', component: SettingsComponent, icon: 'settings'},
      { title: 'Contact', component: ContactComponent, icon: 'mail'},

	      //{ title: 'GRID', component: GridComponent, icon: 'grid'},
	      //{ title: 'DATETIME', component: DatetimeComponent, icon: 'clock'},
	      //{ title: 'RANGES', component: RangesComponent, icon: 'sunny'},
	      //{ title: 'ACTION_SHEET', component: ActionSheetComponent, icon: 'create'},
	      //{ title: 'Placeholder', component: PlaceholderComponent, icon: 'logo-buffer' },
	      { title: 'Facebook Connect', component: FacebookConnectComponent, icon: 'logo-facebook' }
	      //{ title: 'Login', component: LoginComponent, icon: 'log-in' }
		];
		this.wordpressMenusNavigation = config.wordpressMenusNavigation;

 /*   let wc = new WooCommerceAPI({
      url: 'https://jonb.morefitt.com', // Your store URL
      consumerKey: 'ck_dcf392e25c3b87476d1673fadd266837fb220e56', // Your consumer key
      consumerSecret: 'cs_69da30db8eb3d058c8edca34d9761ea71fdcc21c', // Your consumer secret
      wpAPI: true,
      version: 'wc/v2'
    });
    this.products = wc.getAsync('products').then(function(result) {
      console.log(result.toJSON().body);
      return JSON.parse(result.toJSON().body);
    });  */
	}

	initializeApp() {
		let loader = this.loadingController.create({
          content: `Reloading...`
        });
            
		
		this.platform.ready().then(() => {
			// Enable RTL Support
			// this.platform.setDir('rtl', true);
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.isLoggedIn();
// if on device then activate the deploy plugin
			if (this.platform.is('cordova')) {
					// SET DEPLOY CHANNEL
			    	//this.deploy.channel = 'dev';
			    	// check and remove obsolete deploys from device to save space
			    	this.deploy.getSnapshots().then((snapshots) => {
			        	this.deploy.info().then((x) => {
				          for (let suuid of snapshots) {
				            if (suuid !== x.deploy_uuid) {
				              this.deploy.deleteSnapshot(suuid);
				            }
				          }
				        })
				      });
			    	// download and extract the latest snapshot
					this.deploy.check().then((snapshotAvailable: boolean) => {
					  if (snapshotAvailable) {
					    this.deploy.download().then(() => {
					    	loader.present();
						   			this.deploy.extract().then(() => {
						   				return	this.deploy.load();
									});
						});
					  }
					});  
			}
//SET TRACKING
		this.ga.startTrackerWithId('UA-92256699-1')
		   .then(() => {
		   	this.ga.setAllowIDFACollection(false);
     	     this.ga.trackEvent("open", "app initialized");

		   })
		   .catch(e => console.log('Error starting GoogleAnalytics', e));

		});
	}
    isLoggedIn() {
        this.storage.get('user')
        .then(data => {
            if(data) {
                this.user = JSON.parse(data);
            } else {
                 this.storage.get('facebook.user')
                      .then(data2 => {
                          if(data2) {
                              this.user = JSON.parse(data2);
                          }
                      })
                      .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));


    }

	openPage(page) {
		this.nav.setRoot(page.component, page.params);
	}
	openLink(page) {
		switch(page) { 
		   case "login": { 
		      this.nav.setRoot(FirebaseHomeComponent);
		      break; 
		   } 
		   case "home": { 
		      this.nav.setRoot(TabsComponent);
		      break; 
		   } 
		   case "contact": {
		      this.nav.setRoot(ContactComponent);
		      break;    
		   } 
		   case "settings": { 
		      this.nav.setRoot(SettingsComponent);
		      break; 
		   }
		   case "favorites": { 
		      this.nav.setRoot(WordpressFavorites);
		      break; 
		   }   
		   default: { 
		      this.nav.setRoot(TabsComponent);
		      break;              
		   } 
		}

		
	}
}
