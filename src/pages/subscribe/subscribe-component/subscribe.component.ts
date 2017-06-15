import { Component } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-placeholder',
  templateUrl: 'subscribe.html'
})
export class SubscribeComponent {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private iap: InAppPurchase, private iab: InAppBrowser) {

  }


	subscribenow() {
 			this.iap.getProducts(['AllAccess'])
					 .then((products) => {
					   console.log(products);
					       	this.iap.subscribe("AllAccess")
							  .then(data => this.iap.consume(data.productType, data.receipt, data.signature))
							  .then(() => console.log('product was successfully consumed!'))
							  .catch( err=> console.log('subscribe: '+err));
					 })
					 .catch((err) => {
					   console.log('getProducts: '+err);
					 });


	}

	close(){
		this.viewCtrl.dismiss();
	}

	linkTo(link) {
		const browser = this.iab.create(link, '_blank');
		browser.show();
	}
}
