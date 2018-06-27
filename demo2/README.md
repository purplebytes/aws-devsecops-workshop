# Objective
The goal of this module is to demonstrate a how a compromise server attacks on other servers on the network. How you can use AWS Guardduty and other services to detect and remediate the attack. Slack is used for alerts.

# setup 

## Enable Guardduty
Go to the console and enable Guardduty. It is free for 30 days. you can suspend or disable the service after the demo.

## run the cloudformation
Run the cloudformation template to the infrasture and integrate it with the slack.

### slack configuration
You will add your incoming web hook as the first parameter in the template
Add the slack channel as a parameter - example, #devsecops or #general
Add the minimum severity - example, LOW sends all findings
Acknowledge that the template will create IAM resources and execute it

## login to hosts

Click the checkbox next to your running CloudFormation stack created in the step above. In the displayed set of tabs, select the Output tab. Note the IP addresses assigned to the bastion host and the tester EC2 instance. You need both of these IP addresses in order to ssh into the tester EC2 instance.

Create the following entry in your ~/.ssh/config file to login to your instance through the bastion host:

Host bastion
    HostName {Elastic IP Address of Bastion}
    User ec2-user
    IdentityFile ~/.ssh/{your-ssh-key.pem}
Host tester
    ForwardAgent yes
    HostName {Local IP Address of RedTeam Instance}
    User ec2-user
    IdentityFile ~/.ssh/{your-ssh-key.pem
    ProxyCommand ssh bastion nc %h %p
    ServerAliveInterval 240

You would simply run following command in the command prompt

```sh
$ ssh tester 
```

For more details on configuring and connecting through bastion hosts you can check out this [article]( https://aws.amazon.com/blogs/security/securely-connect-to-linux-instances-running-in-a-private-amazon-vpc/)



## run attack script
After logging into the Redteam instance, run the following command on the ec2-user home directory

```sh
$ ./guardduty_tester.sh 
```

This will initiate interaction between your tester and target EC2 instances, simulate attacks, and generate GuardDuty Findings. 



## check the logs in Guardduty
Go to the AWS Console in the browser and choose Guard duty, you will find the alerts.


## alerts send to slack

The cloudwatch events trigger the lambda which in turn alert the slack. Expect few minute delay.

## remediate
you can use guardduty to blacklist these IP address or take other corrective action as per your playbook.


# Credits
This module is inspired by following git hub projects. It has been adapted to simplify setup and demo for audiences (who we assume may not have any prior knowledge on some of the topics or this setup) in the workshop. 

* [amazon-guardduty-tester](https://github.com/awslabs/amazon-guardduty-tester)
* [amazon-guardduty-to-slack](https://github.com/aws-samples/amazon-guardduty-to-slack)


# Disclaimer
The repo and the modules have been setup to explain the concepts and give hands-on demo in a workshop. 
It has been optimised for ease of use and to teach how to use various tools. It is for demo and educational purpose only. 
There is no explicit or implicit warranty that code is production ready or support will be provided. 

