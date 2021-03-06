import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressService } from '../shared/services/wordpress.service';
import { Trainer } from '../wordpress-trainer/wordpress-trainer.component';

@Component({
	templateUrl: './wordpress-trainers.html',
	providers: [ WordpressService ]
})
export class Trainers implements OnInit {

	posts: any;
	postsMF: any;
	postsMetas: any;
	pageCount: number;
	category: any;
	postType: any;
	trainers: any;
	search: string;
	hideSearchbar: boolean;
	favoritePosts: any;

	constructor(
		private navParams: NavParams,
		private wordpressService: WordpressService,
		private navController: NavController,
		private loadingController: LoadingController,
		private toastController: ToastController,
		private storage: Storage) {  }

	ngOnInit() {
		this.category = this.navParams.get('category');
		this.postType = this.navParams.get('postType');
		this.hideSearchbar = true;
		this.search = '';
		this.favoritePosts = [];
	    this.storage.get('wordpress.favorite')
	    .then(data => {
	        if(data) {
	        	this.favoritePosts = JSON.parse(data);
	        }
	    });
		this.getTrainers();
		
	}

	getPosts() {
		this.pageCount = 1;

		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getPosts(query)
		.subscribe(result => {
			//console.log(result);
			this.posts = result;
			loader.dismiss();
		});

	}

	getWorkouts() {
		this.pageCount = 1;

		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getWorkouts(query)
		.subscribe(result => {

			this.posts = result;
			loader.dismiss();
		});

	}


	getNutritions() {
		this.pageCount = 1;

		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getNutritions(query)
		.subscribe(result => {
			//console.log(result);
			this.posts = result;
			loader.dismiss();
		});

	}

	getTrainers() {
		this.pageCount = 1;

		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getTrainers(query)
		.subscribe(result => {
			this.trainers = result;
			loader.dismiss();
		});

	}

	searchPosts() {
    	this.getWorkouts();
	}

	loadMore(infiniteScroll) {
		this.pageCount++;

		let query = this.createQuery();
	  	let loader = this.loadingController.create({
			content: "Loading more trainers..."
		});
		let toast = this.toastController.create({
			message: "There are no more trainers.",
            duration: 2000
		});

		loader.present();
	    	this.wordpressService.getTrainers(query)
				.subscribe(result => {
					
					infiniteScroll.complete();
					if(result.length < 1) { 
						infiniteScroll.enable(false);
						toast.present();
					} else {
						this.trainers.concat(result);
					}
					loader.dismiss();
				});

	}

	loadPost(post) {
		this.navController.push(Trainer, {
			post: post
		});
	}

	favoritePost(post) {
	    let newPost:Boolean = true;
	    let message:string;

	    this.favoritePosts.forEach(favPost => {
			if(JSON.stringify(favPost) === JSON.stringify(post)) {
				newPost = false;
			}
	    });
	    
	    if(newPost) {
			this.favoritePosts.push(post);
			this.storage.set('wordpress.favorite', JSON.stringify(this.favoritePosts));
			message = "This post has been saved to your list";
	    } else {
	    	message = "This post is already in your list";
	    }
		let toast = this.toastController.create({
			message: message,
            duration: 2000
		});
	    toast.present();
	}

	toggleSearchbar() {
		this.hideSearchbar = !this.hideSearchbar;
	}

	createQuery() {
	let query = {};
	query['page'] = this.pageCount;
	query['per_page'] = 20;
	query['exclude'] = [2,4];
	if(this.search) {
	 	query['search'] = this.search;
	}
	if(this.category) {
		query['categories'] = this.category.id;
	}
	return query;
	}
}
