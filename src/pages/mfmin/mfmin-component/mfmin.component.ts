import { Component } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Http, ResponseContentType, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Rx';
import * as Firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FirebaseHomeComponent } from '../../firebase/firebase-home/firebase-home.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PhotoLibrary, RequestAuthorizationOptions } from '@ionic-native/photo-library';

@Component({
  selector: 'page-placeholder',
  templateUrl: 'mfmin.html',
  providers: [ MediaCapture, Camera, File ]
})
export class MfminComponent {

  //@ViewChild('myvideo') myVideo: any;
  public guestVideo: any;
  public fb : any;
  public user : any;
  public clips : any;
  public mfmins : any;
  public _clipsdb: any;
  public _clipsstore: any;
  public _mfmindb: any;
  public _mfminstore: any; 
  public isAndroid: any; 

  constructor(public navCtrl: NavController, private loadingController: LoadingController, private socialSharing: SocialSharing, public mediaCapture: MediaCapture,  public camera: Camera, public file: File, public storage: Storage, public http: Http,  public alertCtrl: AlertController, private angularFireAuth: AngularFireAuth, private streamingMedia: StreamingMedia, public plt: Platform, private ga: GoogleAnalytics, private photoLibrary: PhotoLibrary) {
    this.isAndroid = this.plt.is('android');
    this.ga.trackView("MFmin");
  }

  ngOnInit() {
    this.angularFireAuth.authState.subscribe(data => {
      if (data) {
          this.user = data;
                this._clipsdb = Firebase.database().ref(`clips/${this.user.uid}/`);
                this._clipsstore = Firebase.storage().ref(`clips/${this.user.uid}/`);
                this._mfmindb = Firebase.database().ref(`mfmins/${this.user.uid}/`);
                this._mfminstore = Firebase.storage().ref(`mfmins/${this.user.uid}/`);
                this.getClips();
                this.getMFMins();
      } else {
        this.user = null;
      }

    });

  }


  startrecording() {
    let options: CaptureVideoOptions = { limit: 3, duration: 1 };
    
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          
            this.file.readAsArrayBuffer(this.file.tempDirectory, data[0].name)
              .then(result => {
                  let blobb = new Blob([result], { type: "video/mp4" });
                  let x = new Date();
                  let now = x.toLocaleDateString('en-US'); 
                  //save file to storage
                  this._clipsstore.child(data[0].name).put(blobb)
                    .then((savedVideo) => {
                      // save file location to db. 
                      //shorten  url for sharing 
                      this.shortenUrl(savedVideo.downloadURL).then(result2 => {
                          this._clipsdb.push({date: now, url: savedVideo.downloadURL, shortUrl: result2});
                      });
                       
                      //save to mfmins for page display
                      
                    }); 
                })
              .catch(err => console.log(err)); 
        },
        (err: CaptureError) => console.error(err)
      
  )}


  getClips(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this._clipsdb.on('value', snapshot => {
        let rawList = [];
        snapshot.forEach( snap => {
          rawList.push({
            id: snap.key,
            url: snap.val().url,
            shortUrl: snap.val().shortUrl,
            date: snap.val().date
          });
        return false
        });
        this.clips = rawList;
        resolve(rawList);
      });
    });
  }
  getMFMins(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this._mfmindb.on('value', snapshot => {
        let rawList = [];
        snapshot.forEach( snap => {
          rawList.push({
            id: snap.key,
            url: snap.val().url,
            shortUrl: snap.val().shortUrl,
            date: snap.val().date
          });
        return false
        });
        this.mfmins = rawList;
        resolve(rawList);
      });
    });
  }
  delClip(min, id) {
      var fileRef = Firebase.storage().refFromURL(min);
      var filename = decodeURIComponent(min);
       filename = filename.substring(filename.lastIndexOf('/')+1);
       filename = filename.split("?")[0];
           let confirm = this.alertCtrl.create({
              title: 'Delete this clip?',
              message: 'Do you want to delete this clip? It will be gone forever.',
              buttons: [
                {
                  text: 'No',
                  handler: () => {
                    //console.log('Disagree clicked');
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                           //remove reference from the db
                      this._clipsdb.child(id).remove().then((f) => {
                        //remove file from storage
                                   fileRef.delete().then((f) => {   
                                  }).catch(err => console.log(err));     
                        }).catch(err => console.log(err));
                  }
                }
              ]
            });
          confirm.present();
 
  }
  delMFmin(min, id) {
      var fileRef = Firebase.storage().refFromURL(min);
      var filename = decodeURIComponent(min);
       filename = filename.substring(filename.lastIndexOf('/')+1);
       filename = filename.split("?")[0];
           let confirm = this.alertCtrl.create({
              title: 'Delete this transformation?',
              message: 'Do you want to delete this transformation? It will be gone forever.',
              buttons: [
                {
                  text: 'No',
                  handler: () => {
                    //console.log('Disagree clicked');
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                     //remove reference from the db
                    this._mfmindb.child(id).remove().then((f) => {
                      //remove file from storage
                                 fileRef.delete().then((f) => {       
                                }).catch(err => console.log(err));     
                      }).catch(err => console.log(err)); 
                  }
                }
              ]
            });
          confirm.present();
  }
  makevideo() {
    let self = this;
        let urls = "";
        let loader = this.loadingController.create({
          spinner: 'dots',
          content: `Please wait..<br />May take up to 10 seconds.`
        });
            loader.present();
        // get the locations of the clips to make the mashup
         this.clips.forEach( res => {
            urls += res.url+"|";
         });
        // remove trailing slash
        urls = urls.slice(0, -1);
        
        var params = {
            auth: {
                key: "2108b51014be11e7b3cfb356495ce619"
            },
            steps: {
                // adds a watermark in the front, Mf logo by importing from URL
                "imported_roll": {
                    "robot": "/http/import",
                    "url": urls,
                    "url_delimiter": "|"
                },              
                 "concat": {
                    "use": {
                        "steps": [
                            {
                                "name": "imported_roll",
                                "as": "video_1"
                            }
                        ]
                    },
                    "robot": "/video/concat",
                    "ffmpeg_stack": "v2.2.3",
                    "preset": "ipad"
                },
                 "wmark": {
                    "robot": "/video/encode",
                    "use": "concat",
                    "width": 768,
                    "height": 1024,
                    "background": "00000000",
                    "watermark_url": "http://www.morefitt.com/wp-content/uploads/view_img_whitelogo.png",
                    "watermark_position": "bottom-right",
                    "watermark_size": "20%",
                    "result": true,
                    "preset": "ipad",
                    "rotate": 90
                }, 
            }
        };

    this.http.post("https://api2.transloadit.com/assemblies", { params:  JSON.stringify(params) })
      .subscribe(result => {
               let url = result.json().assembly_ssl_url;
                let obs = Observable.interval(3000)
                .switchMap(() => this.http.get(url)).map((data) => data.json())
                .subscribe((data) => {
                   if (data.ok == "ASSEMBLY_COMPLETED") {
                     obs.unsubscribe();
                       var mfminurl = data.results.wmark[0].ssl_url;
                       var filename = mfminurl.split("/").pop();
                       
                             this.http.get(mfminurl, { responseType: ResponseContentType.Blob })
                              .map(res => res.blob())
                             .subscribe (data2 => {
                                   var Blobb = new Blob([data2], { type: "video/mp4" });
                                   this._mfminstore.child(filename).put(Blobb).then(function(snapshot) {
                                         var dlurl = snapshot.downloadURL;
                                          let x = new Date();
                                          let now = x.toLocaleDateString('en-US'); 
                                             self.shortenUrl(dlurl).then(result2 => {
                                                  self._mfmindb.push({date: now, url: dlurl, shortUrl: result2});
                                              });
                                         
                                         loader.dismiss();
                                    });
                                }, error => {
                                  loader.dismiss();
                                   alert("There was an error. Please try again.");
                                  console.log(error);
                                });
                   }
                }, error => {
                      loader.dismiss();
                      alert("There was an error. Please try again.");
                     console.log(error);
                 });

    }); 
    
  }

  saveVideo(url) {
    
    let options: RequestAuthorizationOptions = { read: true, write: true};

    this.photoLibrary.requestAuthorization(options).then(() => {
      this.photoLibrary.saveVideo(url, "More Fitt").then(() => {
          console.log("video saved to library");
      })
      .catch(err2 => console.log(err2));
    })
    .catch(err => console.log(err));
  }

  playVideo(vid){
    this.ga.trackEvent("video", "view mf min video")
      this.streamingMedia.playVideo(vid);   
  }



  share(url) {
    let subject = "View my video";
    let message = "I have a video to share. ";
    setTimeout(() => this.socialSharing.share(message, subject, '', url), 0);
    this.ga.trackEvent("share", "mf min");
  }

shortenUrl(url) {

    let body = JSON.stringify({"longUrl": url});
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Promise(resolve => {
        this.http.post('https://www.googleapis.com/urlshortener/v1/url/?key=AIzaSyB4X-q9_F-aLYm_lbaN8IbSG7GjCRgRgtE', body, {headers: headers})
            .map(response => response.json())
            .subscribe(
                response => {
                    if (response) {
                        resolve(response.id);
                    } else {
                        resolve(false);
                    }
                }, error => {
                    resolve(false);
                }
            );
    });

}


  login(post) {
    this.navCtrl.push(FirebaseHomeComponent);
  }

}
