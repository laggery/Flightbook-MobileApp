# Flightbook Mobile App
Flightbook is a personal logbook for paraglider and hang glider pilots. The flights must be registered manually and the logbook is not connected to any GPS.

Why is-it not connected to GPS?
There exist a lot of application that are connected to the GPS but often you don’t want to register the track but you just like to have a trace of the flight. For example: Tandem pilots

How is construct this project?
The entire project is construct in two parts.
- An API for the mobile applications https://github.com/laggery/Flightbook-API
- A Mobile application – Current repository

## History
I started with this project in 2013 and first it was used from some Friends and me. 2015 I published the first mobile application version and developed a Symfony web page. 2020 I decided to redevelop the mobile application with the Ionic Framework, the backend with nestjs and make the entire project open source.

## Getting started
To be able to install package, you need to create a .npmrc file for github packages
```
@laggery:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
```

## Docker
Build docker image
```
docker build --build-arg NPM_TOKEN=xxxx -t mobile .
```

## Security
If you discover security related issues, please email yannick.lagger@flightbook.ch instead of using the issue tracker.

## Xlsx package
Information under https://docs.sheetjs.com/

Version -> https://git.sheetjs.com/sheetjs/sheetjs/tags

Package installation
```
npm i --save https://cdn.sheetjs.com/xlsx-0.20.0/xlsx-0.20.0.tgz
```

## Licence
Copyright (C) 2013-2020 Yannick Lagger, Switzerland.
Flightbook is released under the [GPL3 License](https://opensource.org/licenses/GPL-3.0)

## Other used open source project
- 

## Authors
- Yannick Lagger yannick.lagger@flightbook.ch