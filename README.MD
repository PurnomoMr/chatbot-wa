API Framework
==============

Setup
------------

1. cp .env.example .env
2. cp config/config.example.json config/config.json
3. update file according to your local configuration
4. please use node v10.9.0
5. npm install
6. npm install -g sequelize-cli
7. npm install -g eslint
8. sequelize db:migrate
9. npm start
10. hit http://localhost:3000


PM2 Setup
------------
1. npm install -g pm2
2. pm2 install pm2-intercom
3. pm2 start pm2-staging.json for development mode or pm2 start pm2-production.json for development mode


List Action
-------
CASES country_code 
DEATHS country_code 
RECOVERED country_code
CASES TOTAL 
DEATHS TOTAL 
RECOVERED TOTAL 
COUNTRY country_name
------------