import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressService } from '../shared/services/wordpress.service';
import { WordpressPost } from '../wordpress-post/wordpress-post.component';

@Component({
	templateUrl: './wordpress-posts.html',
	providers: [ WordpressService ]
})
export class WordpressPosts implements OnInit {

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
	showMFposts: boolean = false;

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

	    if (this.postType.name == "morefitt") {
	    	this.showMFposts = true;
	    	this.getWorkoutsMF();
	    } 

	    if (this.postType.name == "workout") {
	    	this.getWorkouts();
	    } else {
			this.getNutritions();
	    }

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
	getWorkoutsMF() {
		this.pageCount = 1;

		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getWorkoutsMF(query)
		.subscribe(result => {
			this.postsMF = result.posts;
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
			content: "Please wait"
		});
		let toast = this.toastController.create({
			message: "There are no more posts.",
            duration: 2000
		});

		loader.present();
	    if (this.postType.name == "workout") {
	    	this.wordpressService.getWorkouts(query)
				.subscribe(result => {
					infiniteScroll.complete();
					if(result.length < 1) { 
						infiniteScroll.enable(false);
						toast.present();
					} else {
						this.posts = this.posts.concat(result);
					}
					loader.dismiss();
				});
	    } 
		/* this.wordpressService.getWorkouts(query)
		.subscribe(result => {
			infiniteScroll.complete();
			if(result.length < 1) { 
				infiniteScroll.enable(false);
				toast.present();
			} else {
				this.posts = this.posts.concat(result);
			}
			loader.dismiss();
		});  */
	}

	loadPost(post) {
		console.log(post);
		//this.navController.push(WordpressPost, {
		//	post: post
		//});
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
	if(this.search) {
	 	query['search'] = this.search;
	}
	if(this.category) {
		query['categories'] = this.category.id;
	}
	return query;
	}
}
