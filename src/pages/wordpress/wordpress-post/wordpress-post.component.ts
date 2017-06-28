import { Component } from '@angular/core';
import { NavParams, LoadingController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Http } from '@angular/http';
import { WordpressService } from '../shared/services/wordpress.service';
import { StreamingMedia } from '@ionic-native/streaming-media';

@Component({
	templateUrl: './wordpress-post.html',
	providers: [ WordpressService ]
})
export class WordpressPost {
	post: any;
	postMetas: any;
    authorData: any;
    comments = [];
    isAndroid: boolean;

	constructor(
			private navParams: NavParams,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
			private iab: InAppBrowser,
			private socialSharing: SocialSharing,
			private http: Http,
			public plt: Platform,
			private streamingMedia: StreamingMedia
		) {
		this.isAndroid = this.plt.is('android');
		if (navParams.get('id')) {
			this.getPost(navParams.get('id'));
		}
		if (this.navParams.get('post')) {
			this.post = this.navParams.get('post');
			this.getPostMetas(this.post.id);
			//console.log(this.getPostMetas(this.post.id));

		}
	}



	getPost(id) {
		let loader = this.loadingController.create({
			content: "Please wait"
		});
		loader.present();
		this.wordpressService.getPost(id)
		.subscribe(result => {
			this.post = result;
			this.authorData = this.post["_embedded"].author[0];
			if(this.post["_embedded"].replies) {
			 	this.comments = this.post["_embedded"].replies[0];
			}
			loader.dismiss();
		});

	}

	getPostMetas(id) {
		this.wordpressService.getPostMetas(id)
		.subscribe(result => {
			if (result.hasOwnProperty("days"))  { this.postMetas = result.days;  };
			if (result.hasOwnProperty("meals")) { this.postMetas = result.meals;  };	
		});
	}

	previewPost() {
		const browser = this.iab.create(this.post.link, '_blank');
		browser.show();
	}

	sharePost() {
		let subject = this.post.title.rendered;
        let message = this.post.content.rendered;
        message = message.replace(/(<([^>]+)>)/ig,"");
        let url = this.post.link;

        setTimeout(() => this.socialSharing.share(message, subject, '', url), 0);
		
	}
  playVideo(vid){
	this.streamingMedia.playVideo(vid);
  }

}
