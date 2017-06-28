import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SharedModule } from './shared/shared.module'
import { HomeModule } from '../pages/home/home.module';
import { TabsModule } from '../pages/tabs/tabs.module';
import { GoogleMapsModule } from '../pages/google-maps/google-maps.module';
import { WordpressModule } from '../pages/wordpress/wordpress.module';
import { SlidesModule } from '../pages/slides/slides.module';
import { GridModule } from '../pages/grid/grid.module';
import { SettingsModule } from '../pages/settings/settings.module';
import { FeedsModule } from '../pages/feeds/feeds.module';
import { YoutubeModule } from '../pages/youtube/youtube.module';
import { AboutModule } from '../pages/about/about.module';
import { ContactModule } from '../pages/contact/contact.module';
import { DatetimeModule } from '../pages/datetime/datetime.module';
import { RangesModule } from '../pages/ranges/ranges.module';
import { ActionSheetModule } from '../pages/action-sheet/action-sheet.module';
import { FacebookConnectModule } from '../pages/facebook-connect/facebook-connect.module';
import { LoginModule } from '../pages/login/login.module';
import { BarcodeScannerModule } from '../pages/barcode-scanner/barcode-scanner.module';
import { ChartsModule } from '../pages/charts/charts.module';
// Module Example: Use the PlaceholderModule for any new App Module
import { PlaceholderModule } from '../pages/placeholder/placeholder.module';
import { SubscribeModule } from '../pages/subscribe/subscribe.module';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { MfminModule } from '../pages/mfmin/mfmin.module';
import { TrifectaModule } from '../pages/trifecta/trifecta.module';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
//import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';
import { FirebaseModule } from '../pages/firebase/firebase.module';
import { PhotoLibrary } from '@ionic-native/photo-library';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '5a635efa'
  }
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    SharedModule,
    HomeModule,
    TabsModule,
    GoogleMapsModule,
    WordpressModule,
    SlidesModule,
    GridModule,
    SettingsModule,
    FeedsModule,
    YoutubeModule,
    AboutModule,
    ContactModule,
    DatetimeModule,
    RangesModule,
    ActionSheetModule,
    FacebookConnectModule,
    LoginModule,
    BarcodeScannerModule,
    ChartsModule,
    PlaceholderModule,
    SubscribeModule,
    MfminModule,
    TrifectaModule,
    CloudModule.forRoot(cloudSettings),
    FirebaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, InAppPurchase, StreamingMedia, GoogleAnalytics, PhotoLibrary]
})
export class AppModule {}
