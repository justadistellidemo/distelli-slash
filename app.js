var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var secrets = require('./config/secrets');

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function(req, res, callback){
  var query = req.body.text;
  var username = req.body.user_name;
  var slacktoken = req.body.token;
  var slackteam_id = req.body.team_id;
  processQuery(slacktoken, slackteam_id, query, username, function(returnData){
    res.send(returnData);
  })
});

function processQuery(slacktoken, slackteam_id, query, username, callback){
  query = query.toLowerCase();

  if(slacktoken == secrets.slack.token){


  //List apps
  if(query == "list apps"){
    request('https://api.distelli.com/' + secrets.distelli.username + '/apps?apiToken='
      + secrets.distelli.apiToken + '&max_results=50', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.apps.length; i++){
            returnData.push("<" + contents.apps[i].html_url + "|" + contents.apps[i].name + ">");
          }
          returnData = "Here are your apps " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List apps after [appName]
  else if(query.substring(0, 15) == "list apps after"){
    var queryArray = query.split(" ");
    var marker = queryArray[3];
    request('https://api.distelli.com/' + secrets.distelli.username + '/apps?apiToken='
      + secrets.distelli.apiToken + '&marker=' + marker + '&max_results=50', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.apps.length; i++){
            returnData.push("<" + contents.apps[i].html_url + "|" + contents.apps[i].name + ">");
          }
          returnData = "Here are your apps after " + marker + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, I didn't recognize that marker " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List builds
  else if(query == "list builds"){
     request('https://api.distelli.com/' + secrets.distelli.username + '/builds?apiToken='
      + secrets.distelli.apiToken + '&max_results=50&order=desc', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.builds.length; i++){
            returnData.push("<" + contents.builds[i].html_url + "|" + contents.builds[i].commit.msg + ">" + " by "
              + contents.builds[i].commit.committer + " (" + contents.builds[i].status + ")" );
          }
          returnData = "Here are your builds" + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
   }

   //List builds after [buildNum]
   else if(query.substring(0, 17) == "list builds after"){
    var queryArray = query.split(" ");
    var marker = queryArray[3];
    request('https://api.distelli.com/' + secrets.distelli.username + '/builds?apiToken='
      + secrets.distelli.apiToken + '&marker=' + marker + '&max_results=50', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.servers.length; i++){
            returnData.push("<" + contents.builds[i].commit.url + "|" + contents.builds[i].commit.msg + ">" + " by "
              + contents.builds[i].commit.committer + " (" + contents.builds[i].status + ")" );
          }
          returnData = "Here are your builds after " + marker + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, I didn't recognize that marker " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List servers
  else if(query == "list servers"){
    request('https://api.distelli.com/' + secrets.distelli.username + '/servers?apiToken='
      + secrets.distelli.apiToken + '&max_results=50', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.servers.length; i++){
            returnData.push("<" + contents.servers[i].html_url + "|" + contents.servers[i].dns_name + ">");
          }
          returnData = "Here are your servers" + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List servers are [serverName]
  else if(query.substring(0, 18) == "list servers after"){
    var queryArray = query.split(" ");
    var marker = queryArray[3];
    request('https://api.distelli.com/' + secrets.distelli.username + '/servers?apiToken='
      + secrets.distelli.apiToken + '&marker=' + marker + '&max_results=25', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.servers.length; i++){
            returnData.push("<" + contents.servers[i].html_url + "|" + contents.servers[i].dns_name + ">");
          }
          returnData = "Here are your servers after " + marker + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, I didn't recognize that marker " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List envs
  else if(query == "list envs"){
     request('https://api.distelli.com/' + secrets.distelli.username + '/envs?apiToken='
      + secrets.distelli.apiToken + '&max_results=25', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.envs.length; i++){
            returnData.push(contents.envs[i].app_name + ' / ' + "<" + contents.envs[i].html_url + "|" + contents.envs[i].name + ">");
          }
          returnData = "Here are your envs" + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List envs for app [appName]
  else if(query == "list envs for app"){
    var queryArray = query.split(" ");
    var appName = queryArray[4];
     request('https://api.distelli.com/' + secrets.distelli.username + '/apps/' + appName + '/envs?apiToken='
      + secrets.distelli.apiToken + '&max_results=25', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.envs.length; i++){
            returnData.push(contents.envs[i].app_name + ' / ' + "<" + contents.envs[i].html_url + "|" + contents.envs[i].name + ">");
          }
          returnData = "Here are your envs for app " + appName + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List envs after [envName]
  else if(query.substring(0, 15) == "list envs after"){
    var queryArray = query.split(" ");
    var marker = queryArray[3];
    request('https://api.distelli.com/' + secrets.distelli.username + '/envs?apiToken='
      + secrets.distelli.apiToken + '&marker=' + marker + '&max_results=25', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.envs.length; i++){
            returnData.push("<" + contents.envs[i].html_url + "|" + contents.envs[i].name + ">");
          }
          returnData = "Here are your envs after " + marker + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //List servers for env [envName]
  else if(query.substring(0, 20) == "list servers for env"){
    var queryArray = query.split(" ");
    var envName = queryArray[4];
     request('https://api.distelli.com/' + secrets.distelli.username + '/envs/' + envName + '/servers?apiToken='
      + secrets.distelli.apiToken + '&max_results=25', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i =0; i < contents.servers.length; i++){
            returnData.push("<" + contents.servers[i].html_url + "|" + contents.servers[i].dns_name + ">");
          }
          returnData = "Here are the servers associate with env" + envName + " " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //Create app [appName]
  else if(query.substring(0, 10) == "create app"){
    var queryArray = query.split(" ");
    var appName = queryArray[2];
     request.put('https://api.distelli.com/' + secrets.distelli.username + '/apps/' + appName + '?apiToken='
      + secrets.distelli.apiToken, function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          returnData = "App *" + appName + "* has been created"  + " " + username + " :thumbsup:";
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
   }

   //Create env [envName] for app
   else if(query.substring(0, 9) == "create env"){
    var queryArray = query.split(" ");
    var envName = queryArray[2];
    var appName = queryArray[5];

    request('https://api.distelli.com/' + secrets.distelli.username + '/apps/'+ appName + '/envs/' + envName + '?apiToken='
      + secrets.distelli.apiToken, function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          returnData = "Env *" + envName + "* has been created" + " " + username + "  :thumbsup:";
          callback(returnData);
        }
        else{
          returnData = "Uh-oh, looks like something went wrong " + " " + username + "!";
          callback(returnData);
        }
      })
  }

  //Restart env [envName]
  else if(query.substring(0, 9) == "restart env"){
    var queryArray = query.split(" ");
    var envName = queryArray[2];
    var appName = queryArray[5];

     request.put('https://api.distelli.com/' + secrets.distelli.username + '/envs/' + envName + '/restart?apiToken='
      + secrets.distelli.apiToken, function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          returnData = "Env *" + envName + "* has been restarted " + username;
          callback(returnData);
        }
        else{
          var contents = JSON.parse(body);
          returnData = "That environment does not exist " + username;
          callback(returnData);
        }
      })
  }

  //List releases for app [appName]
  else if(query.substring(0, 21) == "list releases for app"){
    var queryArray = query.split(" ");
    var appName = queryArray[4];
     request('https://api.distelli.com/' + secrets.distelli.username + '/apps/' + appName + '/releases?apiToken='
      + secrets.distelli.apiToken + '&max_results=25&order=desc', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var returnData = [];
          for(var i = 0; i < contents.releases.length; i++){
            var desc = contents.releases[i].description.substr(0, contents.releases[i].description.indexOf('\n'));
            returnData.push("<" + contents.releases[i].html_url + "|" + contents.releases[i].release_version + ": " + desc  + ">");
          }
          returnData = "Here are your releases for " + appName + ", " + username + ":\n" + returnData.join("\n");
          callback(returnData);
        }
        else{
          returnData = "We couldn't find app " + appName + ", " + username + "!";
          callback(returnData);
        }
      })
  }

  //Latest release for app [appName]
  else if(query.substring(0, 22) == "latest release for app"){
    var queryArray = query.split(" ");
    var appName = queryArray[4];
     request('https://api.distelli.com/' + secrets.distelli.username + '/apps/' + appName + '/releases?apiToken='
      + secrets.distelli.apiToken + '&max_results=25&order=desc', function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          contents.releases[0].release_version;
          returnData = "Here's the latest release for " + appName + ", " + username + ": " +
          contents.releases[0].release_version + ": " + contents.releases[0].description;
          callback(returnData);
        }
        else{
          returnData = "We couldn't find app " + appName + ", " + username + "!";
          callback(returnData);
        }
      })
   }

   //Deploy latest to env [envName]
   else if(query.substring(0, 20) == "deploy latest to env"){
    var queryArray = query.split(" ");
    var envName = queryArray[4];
    request('https://api.distelli.com/' + secrets.distelli.username + '/envs/' + envName + '?apiToken='
      + secrets.distelli.apiToken, function (error, response, body) {
        if(!error && response.statusCode == 200) {
          var contents = JSON.parse(body);
          var appName = contents.env.app_name;
          request('https://api.distelli.com/' + secrets.distelli.username + '/apps/' + appName + '?apiToken='
            + secrets.distelli.apiToken, function (error, response, body) {
               if(!error && response.statusCode == 200) {
              var appContents = JSON.parse(body);
              var latestRelease = appContents.app.latest_release.release_version;
              request.post({headers: {'content-type' : 'application/json'}, url: 'https://api.distelli.com/'
                + secrets.distelli.username + '/envs/' + envName + '/deploy' + '?apiToken='+ secrets.distelli.apiToken + '',
                body: JSON.stringify({"release_version": latestRelease, "description": "Deploy via Slack by " + username})}, function (error, response, body) {
                  if(!error && response.statusCode == 200) {
                    var releaseContents = JSON.parse(body);
                    returnData ="<" + releaseContents.deployment.html_url + "|" + "Release " + latestRelease + " has been deployed to env " + envName + " " + username + " !" + ">";
                    callback(returnData);
                  }
                  else{
                    returnData = "We couldn't find env " + envName + ", " + username + "!";
                    callback(returnData);
                  }
                })
              }
              else{
                returnData = "We couldn't find that env, " + username + "!";
                callback(returnData);
              }
            })
          }
          else{
            returnData = "We couldn't find that env, " + username + "!";
            callback(returnData);
          }
        })
    }

  //Help
  else if(query == 'help'){
    returnData = "Here are the commands I recognize:\n•List Apps\n•List Builds\n•List Envs\n•List Servers\n" +
    "•List Servers for Env [Env Name]\n•List Release for App [App Name]\n•Create App [App Name]\n" +
    "•Create Env [Env Name] for App [AppName]\n•Restart Env [Env Name]\n•Latest release for app [appName]\n" +
    "•Deploy latest to env [envName]\n•List Envs for App [AppName]";
    callback(returnData);
  }

  //If command is not understood
  else{
    returnData = "I didn't recognize that command " + username + ". Here are the commands I recognize:\n•List Apps\n" +
    "•List Builds\n•List Envs\n•List Servers\n•List Servers for Env [Env Name]\n•List Release for App [App Name]\n" +
    "•Create App [App Name]\n•Create Env [Env Name] for App [AppName]\n•Restart Env [Env Name]\n•Latest release for app [appName]\n" +
    "•Deploy latest to env [envName]\n•List Envs for App [AppName]";
    callback(returnData);
  }
}
else{
  returnData = "Bad slack creds!";
  callback(returnData);
}
}

app.listen(port, function(){
  console.log('DistelliSlash is alive on port ' + port + '.');
})
