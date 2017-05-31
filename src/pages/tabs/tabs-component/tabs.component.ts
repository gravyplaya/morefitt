import { Component } from '@angular/core';
import { NavParams} from 'ionic-angular';

//import { HomeComponent } from '../../home/home-component/home.component';
//import { ContactComponent } from '../../contact/contact-component/contact.component';
import { Trainers } from '../../wordpress/wordpress-trainers/wordpress-trainers.component';
import { WordpressPosts } from '../../wordpress/wordpress-posts/wordpress-posts.component';
import { YoutubeVideosComponent } from '../../youtube/youtube-videos/youtube-videos.component';
import { MfminComponent } from '../../mfmin/mfmin-component/mfmin.component';
import { TrifectaComponent } from '../../trifecta/trifecta-component/trifecta.component';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsComponent {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = Trainers;
  tab2Root: any = WordpressPosts;
  tab3Root: any = TrifectaComponent;
  tab4Root: any = MfminComponent;
  params: any;
  caty: any;

  constructor(params: NavParams) {
    //console.log("Passed params", params.data);
      //this.params = params;
      //console.log(this.params); // returns NavParams {data: Object}
      //this.caty = this.params.category;
  }
}
