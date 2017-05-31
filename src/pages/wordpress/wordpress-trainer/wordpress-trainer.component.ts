import { Component } from '@angular/core';
import { NavParams, LoadingController, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { WordpressService } from '../shared/services/wordpress.service';
import { WordpressPost } from '../wordpress-post/wordpress-post.component';

@Component({
	templateUrl: './wordpress-trainer.html',
	providers: [ WordpressService ]
})
export class Trainer {
	post: any;
	postMetas: any;
	user: any;
    authorData: any;
    tab: number = 1;
    comments = [];
    workouts: any;
    nutritions: any;
    trainer: any;

	constructor(
			private navParams: NavParams,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
			private navController: NavController,
			private iab: InAppBrowser,
			private socialSharing: SocialSharing,
			private http: Http,
			private storage: Storage
		) {
		if (navParams.get('post')) {
			this.post = navParams.get('post');
			this.postMetas = this.getPostMetas(this.post.id);
			this.trainer = {id: this.post.id, slug: this.post.slug, name: this.post.name};
			this.getWorkouts(this.post.slug);
			this.getNutritions(this.post.slug);
			// this.authorData = this.post["_embedded"].author[0];
			// if(this.post["_embedded"].replies) {
			//  	this.comments = this.post["_embedded"].replies[0];
			// }
		}
		if (navParams.get('id')) {
			this.getPost(navParams.get('id'));
			
		}
		this.getUser();
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

	setTab(newTab){
        this.tab = newTab;
    };

    isSet(tabNum) {
        return this.tab === tabNum;
    };

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
			if (result.hasOwnProperty("days")) this.postMetas = result.days;
			if (result.hasOwnProperty("meals")) this.postMetas = result.meals;		
		});
	}

	getWorkouts(name) {
		let loader = this.loadingController.create({
			content: "Loading..."
		});
		loader.present();
		this.wordpressService.getWorkoutsFromAuthor(name)
		.subscribe(result => {
			this.workouts = result.posts;
			loader.dismiss();
		});
	}
	getNutritions(name) {
		let loader = this.loadingController.create({
			content: "Loading..."
		});
		loader.present();
		this.wordpressService.getNutritionsFromAuthor(name)
		.subscribe(result => {
			this.nutritions = result.posts;
			loader.dismiss();
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

	loadPost(post) {
		this.navController.push(WordpressPost, {
			post: post
		});
	}

}
