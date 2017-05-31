### How do I get set up? ###

## Installing/Serving/Testing the App ##
Update Node (optional  but recommended ) 

$ sudo npm cache clean -f

$ sudo npm install -g n

$ sudo n stable

## Install Latest Ionic Framework ##
$ npm install -g ionic@latest

**Browse to the App**

$ cd ionic2app


**Install package.json dependencies**

$ npm install


**Install Cordova/PhoneGap plugins (Cordova Plugins package.json branch dependencies)
**

$ ionic state restore


**Test your app on multiple screen sizes and platform types by starting a local development server**


$ ionic serve

or

$ ionic serve --lab


**Build iOS**

$ ionic state restore

$ ionic platforms add ios 

$ ionic build ios --prod


**Build Android**

$ ionic state restore

$ ionic platforms add android 

$ ionic build android --prod

Build Android (Production)

$ ionic state restore

$ ionic platforms add android

$ ionic build android --release --prod