import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-placeholder',
  templateUrl: 'trifecta.html'
})
export class TrifectaComponent {

  constructor(public navCtrl: NavController, private iab: InAppBrowser) {

  }

  	linkTo(link) {
		const browser = this.iab.create(link, '_blank');
		browser.show();
	}

}
