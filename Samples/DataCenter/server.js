const express = require('express');
const path = require('path');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const bodyParser = require('body-parser');
const compression = require('compression');



let serverUrl = 'http://localhost:4666/parse';

// judge databaseURI && serverURL

const deaoparseconfig = {
  appName: 'DeAo(得奥)',
  databaseURI: 'mongodb://sirvinguser:sirvinguser@deao.chinacloudapp.cn:27017/createreactappparse', // Connection string for your MongoDB database
  cloud: __dirname + '/deao/cloud/main.js', // Absolute path to your Cloud Code
  verbose: false,
  logLevel:"ERROR",
  logsFolder: 'D:/logs',
  appId: 'myAppId',
  restAPIKey: 'myrestkey',
  javascriptKey:'myjskey',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: serverUrl, // Don't forget to change to https if needed
  maxUploadSize: '100mb',
  // liveQuery: {
  //   classNames: ['StudentSigns','TeacherRatingStudent'],
  //   redisURL: 'redis://h:DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=@svdeao.redis.cache.chinacloudapi.cn:6379/5'
  // },
  websocketTimeout: 10 * 1000,
  cacheTimeout: 60 * 600 * 1000
}


const nycloudparseconfig = {
  appName: 'NYCloud(农业)',
  databaseURI: 'mongodb://127.0.0.1:27017/nycloud', // Connection string for your MongoDB database
  cloud: __dirname + '/nycloud/cloud/main.js', // Absolute path to your Cloud Code
  verbose: false,
  logLevel:"ERROR",
  logsFolder: 'D:/logs',
  appId: 'myAppId',
  restAPIKey: 'myrestkey',
  javascriptKey:'myjskey',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: serverUrl, // Don't forget to change to https if needed
  maxUploadSize: '100mb',
  // liveQuery: {
  //   classNames: ['StudentSigns','TeacherRatingStudent'],
  //   redisURL: 'redis://h:DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=@svdeao.redis.cache.chinacloudapi.cn:6379/5'
  // },
  websocketTimeout: 10 * 1000,
  cacheTimeout: 60 * 600 * 1000
}

//require('./src/server/parse_to_kue');

const app = express();
//console.log(app);
app.use(compression()); //use compression 
app.use(bodyParser.urlencoded({ extended: true, limit: '2048mb' }))
// app.use(bodyParser.json({ type: 'application/json' }));

const api = new ParseServer(deaoparseconfig);
const api1 = new ParseServer(nycloudparseconfig);

app.use('/parse', api);
app.use('/parse1', api1);

const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: deaoparseconfig.serverURL,
      appId: deaoparseconfig.appId,
      masterKey: deaoparseconfig.masterKey,
      appName: deaoparseconfig.appName,
      restKey:  deaoparseconfig.restAPIKey,
    },
    {
      serverURL: nycloudparseconfig.serverURL,
      appId: nycloudparseconfig.appId,
      masterKey: nycloudparseconfig.masterKey,
      appName: nycloudparseconfig.appName,
      restKey:  nycloudparseconfig.restAPIKey,
    }
  ],
  "users": [
    {
      "user": "admin",
      "pass": "admin"
    }
  ]
});


app.use('/dashboard', dashboard);
console.info(`dashboard available at http://localhost:4666/dashboard`); // eslint-disable-line no-console


app
  .use(function respondError(err, req, res, next) {
    console.log('500');
    var status,
      errmsg;
    status = err.status || 500;
    res.status(status);
    errmsg = err.message || 'oo there was a problem!';

    if (req.method === 'GET') {
      res
        .status('500')
        .send('服务器错误：' + errmsg)
    } else {
      res
        .type('txt')
        .send(errmsg + '\n');
    }
  });

// Listen

var httpServer = require('http').createServer(app);

httpServer.listen(4666, function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Server running on 127.0.0.1:%s', 4666);
});

// var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer,{
//   redisURL: 'redis://h:DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=@svdeao.redis.cache.chinacloudapi.cn:6379/5'
// });

