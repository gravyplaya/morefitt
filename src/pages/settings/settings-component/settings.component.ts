import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';


@Component({
    templateUrl: 'settings.html'
})
export class SettingsComponent implements OnInit {

	language: string;
	subd: boolean;
	isIOS: boolean; 

	constructor(
		private storage: Storage,
		private translate: TranslateService,
		private iab: InAppBrowser,
		private iap: InAppPurchase,
		public plt: Platform,
		public http: Http
		){

		this.isIOS = this.plt.is('ios');
	}

	ngOnInit() {
	    this.storage.get('language')
	    .then(value => {
	        if(value) {
	        	this.language = value;
	        } else {
	        	this.language = 'en';
	        }
	    });

	    this.storage.get('subd')
	    .then(value => {
	        if(value) {
	        	this.subd = value;
	        } else {
	        	this.subd = false;
	        }
	    });
	}

	selectLanguage() {
		this.storage.set('language', this.language);
        this.translate.setDefaultLang(this.language);
        this.translate.use(this.language);
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

  	linkTo(link) {
		const browser = this.iab.create(link, '_blank');
		browser.show();
	}
}


