# heroku-pingdom-github-jekyll-reporter
Reports Pingdom incidents to a Jekyll post

Currently runs http://status.re3-labs.net


#### How to run
Add a Procfile to the directory.

Put this in:
```
web: ACCESS_TOKEN=personal-oauh-token REPO=user/repo NAME=committer-name EMAIL=committer-email@re3-labs.net node index.js
```

Start your instance, then point the Pingdom webhook to instance/report-pingdom
