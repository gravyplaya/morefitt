import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomeComponent } from '../../home/home-component/home.component';

@Component({
  templateUrl: 'slides.html'
})
export class SlidesComponent {
  constructor(public nav: NavController) {}

  slides = [
    {
      title: "Welcome to the Ionic 2 App",
      description: "",
      image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic 2 App?",
      description: "",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic 2 App Features?",
      description: "",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];

  openPage() {
    this.nav.setRoot(HomeComponent);
  }
}
