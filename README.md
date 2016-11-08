# Description
[![Feature Yourself Logo](https://www.dropbox.com/s/52qofg3j2ntwxff/Feature%20Yourself%20Logo%20Text%20425x120.png?raw=1)](https://github.com/FranciscoFornell/Feature-Yourself)

Feature Yourself is a solution meant to build your own personal promotion page. It's based on [MEAN.JS](http://meanjs.org/), a MEAN (Mongo DB, Express, Angular, Node.js) full-stack JavaScript open-source framework, and enhanced with Google's Material Design visual style thanks to [Angular-Material](https://material.angularjs.org) UI Component framework.

You can see a working demo [here](http://demo-feature-yourself.mybluemix.net).

MEAN.JS is a full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components.

# Features
### Current features
+ i18n internationalization. Only English and Spanish for now.
+ Skills, educations and professional experiences details.
+ You can have different profiles in different tabs, each one with it's own description. Only related skills, educations and experiences are shown on each tab.
+ A general profile tab will be automatically added with all skills, educations and experiences. This tab will be optional in future versions.
+ If you add /profile/ and a profile id to the url, it will automatically select the appropriate tab. (example: [http://demo-feature-yourself.mybluemix.net/profile/software-developer](http://demo-feature-yourself.mybluemix.net/profile/software-developer)). You can see all profile ids in the profiles management page.
+ If you add /single-profile/ followed by a profile id, it will only load that profile and there will be no tabs. (example: [http://demo-feature-yourself.mybluemix.net/single-profile/software-developer](http://demo-feature-yourself.mybluemix.net/single-profile/software-developer))
+ Different social services login supported.
+ Theme personalization through environment variables

### Features planned for future versions
+ Recommendations system
+ Integrated blog
+ Theme personalization through a settings view on the UI.

# Direct deploy
This project can be deployed to many different platforms, but it's easier to do it to a Cloud Foundry instance. And it's even easier in the case of IBM Bluemix, as it can be done with a simple click and a few guided steps.

## Deploying Feature Yourself To IBM Bluemix In One Click
This is the easiest way to deploy this project. IBM Bluemix is a [Cloud Foundry](https://www.cloudfoundry.org/) based PaaS (platform-as-a-service). It provides free trials and pay-as-you-go models. By clicking the button below you can signup for Bluemix and easily deploy a working copy of Feature Yourself to the cloud.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/FranciscoFornell/Feature-Yourself.git)

After the deployment is finished you will be left with a copy of the Feature Yourself code in your own private Git repo
in Bluemix complete with a pre-configured build and deploy pipeline.  Just clone the Git repo, make your changes, and
commit them back.  Once your changes are committed, the build and deploy pipeline will run automatically deploying
your changes to Bluemix.

## Manually Deploying To IBM Bluemix

Cloud Foundry is an open source platform-as-a-service (PaaS). The Feature Yourself project
can easily be deployed to any Cloud Foundry instance. The easiest way to deploy the
Feature Yourself project to Cloud Foundry is to use a public hosted instance.  The two most popular
instances are [Pivotal Web Services](https://run.pivotal.io/) and
[IBM Bluemix](https://bluemix.net).  Both provide free trials and support pay-as-you-go models
for hosting applications in the cloud. After you have an account follow the below steps to deploy Feature Yourself to IBM Bluemix. If you want to deploy it to another public hosted cloud foundry instance, such as Pivotal Web Services, you'll need to change the login api url. The name of the services may vary too.

Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your grunt task. Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
``` 

* Install the [Cloud Foundry command line tools](http://docs.cloudfoundry.org/devguide/installcf/install-go-cli.html).
* Now you need to log into Cloud Foundry from the Cloud Foundry command line.
  *  If you want an American endpoint run `$ cf login -a api.ng.bluemix.net`.
  *  If you want an European endpoint run `$ cf login -a api.eu-gb.bluemix.ne`.
  *  If you want an Australian endpoint run `$ cf login -a api.au-syd.bluemix.net`.
* Create a Mongo DB service.
  *  Run `$ cf create-service mongodb 100 FY-mongo`
* Create an Object Storage service.
  *  Run `$ cf create-service Object-Storage Free FY-Object-Storage`
* Clone the GitHub repo for Feature Yourself if you have not already done so
  * `$ git clone https://github.com/FranciscoFornell/Feature-Yourself.git && cd Feature-Yourself`
* Run `$ npm install`
* Run the Grunt Build task to build the optimized JavaScript and CSS files
  * `$ grunt build`
* Deploy Feature Yourself to Cloud Foundry
  * `$ cf push`

After `cf push` completes you will see the URL to your running Feature Yourself application 
(your URL will be different).

    requested state: started
    instances: 1/1
    usage: 128M x 1 instances
    urls: feature-yourself.mybluemix.net

Open your browser and go to that URL and your should see your Feature Yourself app running!

## Configuring Social Services
Feature Yourself allows you to login via a number of social services (Facebook, Github, Google, Linkedin and Twitter). You need to configure your deployment with the various keys and secrets to enable these social services. One way to do this is through environment variables, but while this is possible in Cloud Foundry, it is not the preferred method. Credentials like this are usually surfaced through services an application can bind to. For this reason, when you deploy Feature Yourself you can fill the environment variables for the social services you want to enable, or (and this is the preferred method) you can configure and bind services to your application using what is called user provided services.

Once your application is deployed to Cloud Foundry run the following command using the Cloud Foundry CLI for the social services you would like to use. Make sure you insert the correct credentials for the service. 

### Facebook
```bash
$ cf cups mean-facebook -p
 '{"id":"facebookId","secret":"facebookSecret"}'
$ cf bind-service feature-yourself mean-facebook
```

### Twitter
```bash
$ cf cups mean-twitter -p '{"key":"twitterKey","secret":"twitterSecret"}'
$ cf bind-service feature-yourself mean-twitter
```

### Google
```bash
$ cf cups mean-google -p '{"id":"googleId","secret":"googleSecret"}'
$ cf bind-service feature-yourself mean-google
```

### LinkedIn
```bash
$ cf cups mean-linkedin -p '{"id":"linkedinId","secret":"linkedinSecret"}'
$ cf bind-service feature-yourself mean-linkedin
```

### GitHub
```bash
$ cf cups mean-github -p '{"id":"githubId","secret":"githubSecret"}'
$ cf bind-service feature-yourself mean-github
```

### Email
```bash
$ cf cups mean-mail -p '{"from":"fromEmail","service":"emailService","username":"emailServiceUsername",
"password":"emailServicePassword"}'
$ cf bind-service feature-yourself mean-mail
```

After you have bound the services your want to your Feature Yourself application, run
```bash
$ cf restage mean
```
to restage your application and your social services should now work.

If you prefer to use environment variables, you should create the following ones:

### Facebook
```bash
FACEBOOK_ID
FACEBOOK_SECRET
```

### Twitter
```bash
TWITTER_KEY
TWITTER_SECRET
```

### Google
```bash
GOOGLE_ID
GOOGLE_SECRET
```

### LinkedIn
```bash
LINKEDIN_ID
LINKEDIN_SECRET
```

### GitHub
```bash
GITHUB_ID
GITHUB_SECRET
```

### Email
```bash
MAILER_FROM
MAILER_SERVICE_PROVIDER
MAILER_EMAIL_ID
MAILER_PASSWORD
```

# Make it yours
Once you have your own feature yourself deployment up and running, it's time to personalize it.

## Theming
Feature Yourself has a preconfigured theme, but you can change it by adding the following environment variables to your server:
```bash
PRIMARY_PALETTE
ACCENT_PALETTE
WARN_PALETTE
```
If you decide to use this variables, they must be filled only with the palette names listed [here](https://material.google.com/style/color.html#color-color-palette), and they must be in **lowercase**, and **with dashes instead of spaces** if it has more than one word. **Otherwise, the application will fail**.

## Data population
The first time you open your Feature Yourself instance on a browser, it will show the following error message:
```
There is no local user in the database.
```
There can be only one local user per Feature Yourself instance, and this message is telling you that currently there are none. You can click on the top right button and sign up to create a new local user.

Once this is done, you will still see another error:
```
There are no profiles in the database.
```
Once you are logged in with the local user (which have administrator privileges), you should see the **Admin options** menu. From there you can populate and manage all the data you need, including the profiles. Once there is at least one profile in the database, you can click on the home button, and you should see the home page without errors.

Through the **Admin options** menu you can populate skills, educations and experiences, and of course as many profiles as you need. For each skill, education or experience you can select one or more profiles for them to be assigned to.

## User settings
If you click on the login button (the one on the top right corner) when you are already logged in, you will see a menu with an option for closing the session, and some extra options. These options will send you to the settings dashboard, in which you can change your profile picture, your password, your user data, or manage your social accounts. Any social account you connect with your local user will be linked on the home page.

# Download and make your own version of Feature Yourself

## Before You Begin
This project is open-source and you can download it and modify it as you need, but before you begin, I recommend you read about the basic building blocks that assemble a MEAN.JS application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS](http://expressjs.com/en/guide/routing.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your grunt task. Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
```

* Gulp - (Optional) You may use Gulp for Live Reload, Linting, and SASS or LESS.

```bash
$ npm install gulp -g
```

## Downloading Feature Yourself
There are several ways you can get the Feature Yourself code:

### Cloning The GitHub Repository
The recommended way to get Feature Yourself is to use git to directly clone the Feature Yourself repository:

```bash
$ git clone https://github.com/FranciscoFornell/Feature-Yourself.git Feature-Yourself
```

This will clone the latest version of the Feature Yourself repository to a **Feature-Yourself** folder.

### Downloading The Repository Zip File
Another way to use the Feature Yourself code is to download a zip copy from the [master branch on GitHub](https://github.com/FranciscoFornell/Feature-Yourself/archive/master.zip). You can also do this using `wget` command:

```bash
$ wget https://github.com/FranciscoFornell/Feature-Yourself/archive/master.zip -O Feature-Yourself.zip; unzip Feature-Yourself.zip; rm Feature-Yourself.zip
```

## Quick Install
Once you've downloaded the code and installed all the prerequisites, you're just a few steps away from starting to develop your Feature Yourself own version.

The first thing you should do is install the Node.js dependencies. The code comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Setting environment variables
If you need to change the environment variables in the development environment, you can create a file named .env on the project root directory. In that file you can declare the variables as explained [here](https://github.com/bkeepers/dotenv#usage).

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running.

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

* explore `config/env/production.js` for production environment configuration options

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true grunt
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true grunt prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ sh ./scripts/generate-ssl-certs.sh
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute grunt's prod task `grunt prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`

## Running your application with Gulp

After the install process, you can easily run your project with:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings. 

### Running Gulp Development Environment

Start the development environment with:

```bash
$ gulp dev
```

### Running in Production mode
To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
