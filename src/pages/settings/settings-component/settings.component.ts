import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    templateUrl: 'settings.html'
})
export class SettingsComponent implements OnInit {

	language: string;

	constructor(
		private storage: Storage,
		private translate: TranslateService,
		private iab: InAppBrowser,
		private iap: InAppPurchase
		){}

	ngOnInit() {
	    this.storage.get('language')
	    .then(value => {
	        if(value) {
	        	this.language = value;
	        } else {
	        	this.language = 'en';
	        }
	    });
	}

	selectLanguage() {
		this.storage.set('language', this.language);
        this.translate.setDefaultLang(this.language);
        this.translate.use(this.language);
	}

	restorePurchases() {
		this.iap.restorePurchases()
		 .then((res) => {
		   console.log(res);
		 })
		 .catch((err) => {
		   console.log(err);
		 });
	}

  	linkTo(link) {
		const browser = this.iab.create(link, '_blank');
		browser.show();
	}
}


