# Framework for node (with NodeJS, ExpressJS, Mongoose, PassportJS)
Feature: 
1. Configs: environment custom default with (dev, pro)
2. Authentication: login with passport local, google (oauth2), register, forgot password, grant permission, actions for entity, groups user for team.
3. CRUD: simple create crud controller, crud api.
4. Log4js: Log Hourly log files kept for 1 month
5. I18N
6. Run with shell

## Setup
`npm install`

## Usage
Start with npm:
1. `npm start` //for run code development
2. `npm run start:pro`  //for run code productment

Start with pm2:
1. `pm2 start npm --name "node-core" -- run start`  //for run code development
2. `pm2 start npm --name "node-core" -- run start:pro`  //for run code productment

Restart and stop pm2:
1. `pm2 restart node-core`  //restart
2. `pm2 stop node-core`  //stop

## File Structure

```
source_core/
 │
 ├── apps/
 │   ├── example/					* folder entity base
 │   │   ├── api					* api routes
 │   │   ├── controller				* controller routes
 │   │   ├── index					* register routes /api/entity/* & /entity/*
 │   │   ├── model					* schema entity & logic
 │   │   └── test.spec				* test code
 │   │	 
 │   │── routes						* all routes handle
 │   └── setup						* setup modules imports for apps
 │   				    
 │
 ├── configs/
 │   ├── _locales/					* folder i18n json file multi language
 │   │   ├── en.json				* english
 │   │   └── vi.json				* vietnam
 │   │	 
 │   ├── dev/						* folder config development
 │   │   └── common					* all config
 │   │	 
 │   ├── pro/						* folder config productment
 │   │   └── common					* all config
 │   │	 
 │   └── index						* call config from environment
 │
 │
 ├── helpers/						* all file utils handle
 ├── middlewares/					* all file middlewares handle
 ├── public/						* public static file browser
 ├── temp/							* folder contain log file
 ├── views/							* all file views
 └── app.js							* run 
```