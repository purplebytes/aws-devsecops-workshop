

# AWS DevSecOps Workshop Demo 1 
Provide hands on experience in using AWS services to secure your internet facing service end points.

# Use Case : Proactive defense using Honeypot and AWS WAF
Demonstrate end point protection by using Honeypot to find the IP addresses of BOT and block the IP Address. Thereby preventing further scan and eventual attack.

## How we achieve this
We create a simple 3 tier architecture based web application. The simple webpage takes email address of user who wants to register for the product announcements. This email address is stored in the Dynambo DB. <br>

We setup a simple honeypot by including an invisble button in the webpage. The legitimate user of the website through browser will not see this button. However, a BOT reading the HTML will click this assuming it is part of the form. 

For the purpose of this excercise, we have made the `invisible button` visible to help the participants to click and simulate BOT behavior. 

When the `invisible button` is clicked, Honeypot function (Lambda) will collect all the user-agent and IP address details of the BOT and notify the DevSecOps team using pre-configured Slack Channel. 

Whilst this offers a way to detect suspicious activities, it does not stop the bot. 

*To Demonstrate End Point protection* We then turn on AWS WAF and add OWASP 10 rule set and enable AWS cloudfront.

We take on the role of DevSecOps to update the BOT's IP address to the Blacklist IPs of the AWS WAF.

Now re-trying the webpage from the same IP address will give 403 access denied error message.

This demonstrates capabilites of AWS services to protect the end points in real-time. In a real life scenario, updating the IP addresses in the AWS WAF should be automated using AWS Lambda. We are doing this manually in this excercise so that participants can understand each steps.

## Why serverless and DynamoDB in the demo
To keep the cost low for the participants. It will be few pences. Please delete the cloudformation stack after the demo to avoid further costs.

## Reference Architecture

<img alt="Proactive Defense Architecture" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Demo1+Arch.png">

## Setup instructions

Note : Please always select your region as "EU-WEST-1" or EU(Ireland). We have hard corded all the configurations to point to EU-WEST-1 to simplify the setup of the demo. It will not work or will give misleading error if you attempt to run some of the Cloudformation templates in another region.

### Step 1: Pre-requisites
* Login to your AWS Console
* Go to IAM and make sure your IAM user has administrator policy attached. This will help to run these demos without any issues.**This is for Demo purpose only. Not advised in real scenerios**
If you would like to create new User follow these steps - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console

<img width="1372" alt="IAM Administrator rights needed" 
src="http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.14.00.png">

* If you are login as a "Root User" then you may not need to do the above mentioned step. 

```
Top Tip: As you follow the instructions, please create a notes.txt file and copy top tips links that you generate
. <br> It will be handy when you have to setup the configurations to run the application
```


### Step 2: Setting up S3 for website hosting

#### Creation of S3 Bucket
* Go to `S3` service and click `Create Bucket` button <br>
   * In the pop-up window give an unique name for your bucket. For example, **mywebsite-bucket**. `Pro-tips`: few numbers at the end always help to create a unique bucket.<br>
   * Make sure you choose, `EU(Ireland)` as the region <br>
   * Click `next` and `next` to complete the setup. <br>
   * Your S3 Bucket is created.
   
#### Update the S3 properties to enable web hosting
* Now click the new bucket your created **mywebsite-bucket** and go to the properties<br>
<img width="1372" alt="S3 properties" 
src="http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.26.33.png">
* Select the `Static Web Hosting` option and fill in the details as below
<img width="1372" alt="S3 enable static hosting" 
src= "http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.26.58.png">
Now you have enabled your bucket to host the website.


### Step 3: Run the cloudformations templates to setup the demo1

* Go to `CloudFormation` service
* Select the region as `EU(Ireland)`.

* Click `Create Stack` or `Create New Stack` Button
<img width="1372" alt="Cloudformation" 
src="http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.15.48.png">

* Choose `Upload a template to S3` option and use the file selector to choose `1-setup-myunicorn-app.json` from `Demo1` directory of your local repo and click `Next` Button in the console.

<img width="1372" alt="Upload the cloudformation json" 
src="http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.17.43.png">

* Fill in the details for the cloudformation<br><br>
  * `Stack Name` text box provide a name to your stack `nextunicorn-app`<br><br>
  * `Website Bucket` text box provide **the name of the S3 bucket you just created in Step 2** and click `Next` Button
<img width="1372" alt="provide website bucket name" 
src="http://devsecops-demo-images.s3-website-eu-west-1.amazonaws.com/Screen%20Shot%202018-06-26%20at%2016.32.03.png">


* All the fields in this screen are `optional`. No need to fill them, just click `Next` Button
<img width="1372" alt="next screen" 
src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.32.24.png">

* Make sure you select the `tick box` to **Acknowledge** you give neccessary permission to create the resources and click `Create` Button

<img width="1372" alt="final screen" 
src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.32.38.png">

* Wait for the stack to be created. It takes around 10 minutes for the setup to complete.

* Once the stack creation is complete, click the `outputs` tab to get your `ServiceEndPoint` URL. You will need this for subsequent steps
<img alt="Service Endpoint details" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.38.35.png">

```
Top Tip: note down the follwoing in your notes.txt<br> Service Endpoint : https://7aa42aaq5h.execute-api.eu-west-1.amazonaws.com/dev
```

### Step 3a: Setup AWS WAF ACL using OWASP Top 10
* Go to `CloudFormation` service and `Create Stack` and upload `2-setup-waf-owasp-10-base.yml` from demo1 directory.
* **Stack Name** Provide a stack name. For example, WAF-OWASP-Top10
* All the defaults are prepopulated. **DO NOT CHANGE** 
* Click few `Next` button till you reach `Create Stack`

* It will take around 10 minutes to finish


### Step 4: Slack incoming webhook
The slack channel will be used to intimate the DevSecOps team of an honeypot attack. Hence you need a Slack account, slack channel and WebhookURL which your project will utliize to send notifications to you through Slack.
* Setup an account in Slack if you dont have an existing acccount - https://slack.com/create#email

* Now create an incoming webhook URL - https://api.slack.com/incoming-webhooks

```
Tip: Slack Incoming webhook URL: https://api.slack.com/XXXXXX/YYYYYY/YOURWEBHOOKID
```

### Step 5: Update the Front end and upload
* Go to `demo1` directory in your local machine.
* Open `functions.js` with your favorite editor and update the variable URL with the service endpoint URL that you copied from the Cloudformation outputs tab.<br>
var URL with your `ServiceEndPoint` URL.<br>

```javascript
var URL = "https://yourserviceendpoint/dev"
```
<img alt="update the var" 
src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.45.55.png">
* Save the file.

* Now Open `notifications-config.json`. Update your Slackchannel webhookURL as below.

```javascript
 "alert": {
                "slack": {
                        "enabled": "true",
                        "webhook-url": "https://hooks.slack.com/services/XXXXXX/YYY/YOURWEBHOOK"
                },
```

* Now upload the following files to your s3 bucket.
 * notifications-config.json
 * functions.js
 * index.html
* In the permissions during upload ensure to select *"Grant public read access to this object"*
<img alt="Make files Read Only"  width="300" height="300" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/makingS3ObjectsPublic.png">
Now your setup is complete.

### Finding your website link
* Go to AWS Console, Select S3 service
 * Click the S3 bucket **mywebsite-bucket** you created step 2
 * Here select `Properties`
 * Here select `Static Web hosting` box.
 * Here copy the endpoint link. 
<img alt="S3 WebURL"  width="300" height="300" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/WebhostingURL.png">

```
Top Tip: website URL : http://mywebsite-bucket.s3-website-eu-west-1.amazonaws.com/
```

# Lets begin the testing!

## Submit the form as human. 
* In the browser window paste the endpoint link you copied from your S3 bucket. 
<img alt="s3 website" height="600" width="900" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-27+at+09.37.52.png">
* Enter your email id 
* Click the `Subscribe` button.
You will see an alert when it is successfully updated.


## Submit the form as Bot.
* On the top right hand corner of your web page, you will find the button `Click if you are a Bot`
* click the `Click if you are Bot` button.
* In your slack channel you will find the following message `HoneyToken triggered`.
* Now copy the `Source IP Address` mentioned in the slack message..

## Setting up End point protection by enabling WAF and Cloudfront.
Setups shown in Workshop

## Update WAF with the IP address to block
setup as shown in workshop

## Test access by BOT
<br>The Ip address is blocked and you have no more access to the site from this IP. <br>
Thus preventing further scan and attack. <br>
In real life scenerio, the WAF blocked should be automated. The honeypot lambda should update the WAF rules once triggered.<br>

**Well Done! you have completed Demo1**




# Trouble Shooting: 
This is just to check if setup was created properly

## Right AWS region
Ensure you are in the right AWS region.

## Testing honeyLambda
Go to the browser and type the service endpoint URL you copied from the Cloudformation stack URL.
```javascript
https://o8qqpwhy5d.execute-api.eu-west-1.amazonaws.com/dev/v1/get-pass
```

You will get following message when everything is setup correctly
<img alt="Honey pot is working"
src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.56.51.png">

or 

You will get internal server error.
<img alt="internal server error" src="https://s3-eu-west-1.amazonaws.com/devsecops-demo-images/Screen+Shot+2018-06-26+at+16.49.30.png">
Make sure you have copied the `notifications-config.json` to your website bucket.






