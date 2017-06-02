import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from '../../../../app/app.config';
import 'rxjs/add/operator/map';

@Injectable()
export class WordpressService {

	constructor(private http: Http, private config: Config) {}

	public login(data) {
		let url = this.config.wordpressApiUrl + '/jwt-auth/v1/token';
		return this.http.post(url, data)
	  	.map(result => {
			return result.json();
		});    
	}

	public getPosts(query) {
		query = this.transformRequest(query);
		let url = this.config.wordpressApiUrl + `/wp/v2/posts?${query}&_embed`;
		return this.http.get(url)
	  	.map(result => {
			return result.json();
		});    
	}

	public getPost(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/posts/${id}?_embed`)
	  	.map(result => {
			return result.json();
		});
	}
	public getPostMetas(id) {
		return this.http.get(`https://www.morefitt.com/get-metas/?id=${id}`)
	  	.map(result => {
			return result.json();
		});
	}
	public getMedia(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/media/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getCategories() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/categories')
		.map(result => {
			return result.json();
		});
	}

	public getPages() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/pages?per_page=100')
		.map(result => {
			return result.json();
		});
	}

	public getPage(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/pages/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getMenus() {
		return this.http.get(this.config.wordpressApiUrl + '/wp-api-menus/v2/menus')
		.map(result => {
			return result.json();
		});
	}

	public getMenu(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp-api-menus/v2/menus/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	private transformRequest(obj) {
		let p, str;
		str = [];
		for (p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}

	public getWorkouts(query) {
	  query = this.transformRequest(query);
	  let url = this.config.wordpressApiUrl + `/wp/v2/workout?${query}&_embed`;
	  return this.http.get(url)
	    .map(result => {
	    return result.json();
	  });    
	}
	public getWorkoutsMF(query) {
	  query = this.transformRequest(query);
	  let url = `https://www.morefitt.com/api/get_author_posts?${query}&id=6&post_type=workout`;
	  return this.http.get(url)
	    .map(result => {
	    return result.json();
	  });    
	}
	public getWorkoutsFromAuthor(query) {
	  //query = this.transformRequest(query);
	  let url = `https://www.morefitt.com/api/get_posts?author_name=${query}&post_type=workout`;
	  return this.http.get(url)
	    .map(result => {
	    return result.json();
	  });    
	}
	public getNutritionsFromAuthor(query) {
	  //query = this.transformRequest(query);
	  let url = `https://www.morefitt.com/api/get_posts?author_name=${query}&post_type=nutrition`;
	  return this.http.get(url)
	    .map(result => {
	    return result.json();
	  });    
	}
	public getWorkout(id) {
	  return this.http.get(this.config.wordpressApiUrl + `/wp/v2/workout/${id}?_embed`)
	    .map(result => {
	    return result.json();
	  });
	}

	public getNutritions(query) {
	  query = this.transformRequest(query);
	  let url = this.config.wordpressApiUrl + `/wp/v2/nutrition?${query}&_embed`;
	  return this.http.get(url)
	    .map(result => {
	    return result.json();
	  });    
	}

	public getNutrition(id) {
	  return this.http.get(this.config.wordpressApiUrl + `/wp/v2/nutrition/${id}?_embed`)
	    .map(result => {
	    return result.json();
	  });
	}

	public getTrainers(query) {
	  query = this.transformRequest(query);
	  let url = this.config.wordpressApiUrl + `/wp/v2/users?${query}&_embed`;
	  let filtered = []; let filtered2 = []; 
	  return this.http.get(url)
	    .map(result => {
	    	//for(let a of result.json()) {
			//        if (a.id !== 2 && a.id !== 4) {
            //            filtered.push(a);
            //        }
		//	}
			filtered = result.json();
			//get the avatar url for the trainer and add it to his object
			filtered.forEach((item, index) => {
			    this.http.get(`https://www.morefitt.com/wp-content/plugins/indeed-membership-pro/apigate.php?ihch=YokCnaHHHwL8y2K5JqJmgkquIdo8rU6ohq&action=user_get_details&uid=${item.id}`)
			      .map(res => res.json())
			      .subscribe(result => {
			        this.http.get(`https://www.morefitt.com/wp-json/wp/v2/media/${result.response.ihc_avatar}`).subscribe(result2 => {
			          filtered[index].avatar = result2.json().x_featured_media_large;
			        });
			      });
			});
	    return filtered;
	  });    
	}
	

}