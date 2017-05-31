import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public wordpressApiUrl = 'https://www.morefitt.com/wp-json';
	// public wordpressApiUrl = 'http://demo.wp-api.org/wp-json'
	public wordpressMenusNavigation = false;
	public feedsUrl = './assets/data/feeds.json';
	public feedsCategoryUrl = './assets/data/feeds-category.json';
	public youtubeKey = 'AIzaSyClMa-MaKro_m95tb--4LaAorl-NmGPJxc';
	public youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/';
	public youtubeUsername = 'MoreFitt';
	public youtubeChannelId = 'UCDejBWVOoUFFwZ8VKvCZGqw';
	public youtubeResults = 50;
	public emailTo = 'geovanni@morefitt.com';
}
