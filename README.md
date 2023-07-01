# Bulk Device Registration in AWS IoT Core using Serverless Framework and Node.js

This tutorial demonstrates how to register multiple devices in bulk in AWS IoT Core using the Serverless Framework and Node.js. It provides a step-by-step guide to set up a Serverless project, configure the necessary AWS services, and register devices in bulk.

## Prerequisites

- AWS account with appropriate permissions to create and manage resources in AWS IoT Core.
- Node.js and npm (Node Package Manager) installed on your local machine.
- Serverless Framework CLI installed globally.

## Getting Started

Follow these steps to set up the project and register devices in bulk:

1. **Create a NodeJS project using the Serverless framework**

```bash
serverless create --template aws-nodejs
```

2. **NODE dependencies installation**

- Install Dependencies

```bash
npm install
```

3. **Configure AWS Credentials**
   Ensure that your AWS credentials are correctly set up on your machine, either by configuring the AWS CLI or setting the environment variables.

Create Access Key and Secret Key of your IaM user, then configure serverless using this command

```bash
serverless config credentials --provider aws --key AKIA46U7FRWUVQWOZNHF --secret n0MYdKyDG1McH0SBZ8ZXZBa52b+Rieg94bIy4Dv9
```

4. **Update Configuration**
   Open the serverless.yml file and update the AWS region, service name, IaM policy, and any other desired configurations.

5. **Implement Device Registration**
   Open the handler.js file and modify the registerDevices function to include the desired device information for bulk registration.

6. **Deploy the Serverless Service**

```bash
sls deploy
```

7. **Invoke the function to register the devices in AWS IoT Core.**

```bash
sls invoke -f registerDevices
```
