# Setting up CloudFront

* Select `Cloudfront` from the AWS Service.
* Select `Create Distribution` button
* Under `Select delivery method`, click the `Get Started` button under `Web`
* On the Create Distribution Page,
    * Under **Origin Settings** Section
    * For the field `Origin Domain Name` select the name of the S3 Bucket you created.
    * For the field `Restrict Bucket Access` select `yes`   
    * For the field `Origin Access Identity` select `Create a New Identity`
    * For the field `Grant Read Permissions on Bucket` select `Yes, Update Bucket Policy`

    * Under **Default Cache Behavior Settings** Section
    * For the field `Viewer Protocol Policy` select `Redirect HTTP to HTTPS`
    * For the field `Allowed HTTP Methods` select `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
    
    * Under **Distribution Settings** Section
    * For the field `Price Class` select `Use US, Canada and Europe`
    * For the field `AWS WAF Web ACL` select the `generic-owasp-acl`
    * For the field `Default Root Object` enter `index.html`
    * Now click `create Distribution` 
    * The creation of distribution takes 10 mins. 
* You can see the progress of the distribution creation by clicking the top left end corner `Distributions`.
* Once created, select your Cloud distribution and open the `General` tab.
* Here copy the value in `Domain Name`.

# Launch your website from cloudfront domain name URL

* Open a browser and paste the Cloudfront website URL you got from copying the value `Domain name` field.
* Try registering a user.
* Execute as Bot by clicking `Click if you are a BOT`.

# STOP the threat

* In your slack channel you should recieve a message of the attack. 
* Now copy the ipaddress from the `Source Ipaddress` field. Note: This is actually your machine's ipaddress. 

## Block the Ip in wAF
