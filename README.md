# Sanity Backups.

An open-source backup solution for websites and apps built with Sanity.

<img width="1391" alt="demo" src="https://github.com/user-attachments/assets/1a48b862-6833-4447-9415-8f34ed5e5f28" />

## Tech Stack

* [Next.js](https://nextjs.org/)
* [Express.js](https://expressjs.com/)
* [Turborepo](https://turborepo.com/)
* [Sanity](https://sanity.io/)
* [Amazon S3](https://aws.amazon.com/s3/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind](https://tailwindcss.com/)
* [Shadcn](https://ui.shadcn.com/)

## Key Features

* Create on-demand backups.
* Download previously generated backups.

## ⚠️ Important - Please Read

This open source project is intended to be used locally. If you want to deploy it on the web you will need to add authentication. Convex has first-class support for [Clerk](https://docs.convex.dev/auth/clerk) and [Auth0](https://docs.convex.dev/auth/auth0), as well as their own auth solution [Convex Auth](https://labs.convex.dev/auth).

## Getting Started

### Create an S3 bucket

This project uses Amazon S3 to store the generated backups so you'll need to [create an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

#### Step 1: Sign in to AWS

1. Go to the AWS Console.
2. Log in with your credentials.

#### Step 2: Navigate to S3

1. In the top search bar, type "S3" and select S3 from the services list.
2. This will take you to the Amazon S3 dashboard.

#### Step 3: Create a Bucket

1. Click the “Create bucket” button.
2. Fill out the bucket details:
    - Bucket name: Must be globally unique (e.g. my-app-bucket-2025).
    - AWS Region: Choose the region closest to your users or application.

#### Step 4: Create Bucket

- Click “Create bucket” at the bottom of the page.

### Create an IAM user.

To access our S3 bucket we need to create an IAM user to get Access and Secret Access keys.

#### Step 1: Access AWS Console

1. Go to the AWS Console.
2. Log in with your credentials.
3. In the search bar at the top, type "IAM" and select IAM (Identity and Access Management) from the dropdown.

#### Step 2: Navigate to Users

1. In the IAM dashboard, click on "Users" in the left sidebar.
2. Click the "Create user" button (orange button on the right).

#### Step 3: Set User Details

1. User name: Enter a descriptive name like `sanity-backup-user` or `s3-backup-service`.
2. Leave "Provide user access to the AWS Management Console" unchecked.
3. Click "Next".

#### Step 4: Set Permissions

1. Click "Attach policies directly" and choose `AmazonS3FullAccess`.
2. Click "Next".
3. Review your user details then click "Create user".

#### Step 5: Create access and secret access keys

3. In the "Users" table click on your newly created user.
6. In the summary section click on "Create access key".
7. For "Use case" choose "Application running outside AWS" and then click next.
8. Add a description and click "Create access key".
9. Copy your access key and secret access key as we need to add them to our project as environment variables.

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

- `AWS_REGION` - The AWS Region you choose when creating your bucket.
- `AWS_ACCESS_KEY_ID` - The Access key we created in the previous steps.
- `AWS_SECRET_ACCESS_KEY` - The Secret Access Key we created in the previous steps.
- `S3_BUCKET_NAME` - The name you gave your S3 bucket.

### Install dependencies

Run this command in your terminal in the root directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`| Installs dependencies.|

### Setup Convex

Navigate to the web directory using `cd apps/web` and run the following command to set up a [Convex deployment](https://docs.convex.dev/quickstart/nextjs). This will prompt you to log into your Convex account with GitHub, create a project (or select an exisiting one), and save your production and deployment URLs. 

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npx convex dev`| Sets up a convex dev deployment.|

### Start a local server

Navigate to the root directory and start the development servers by running the following command:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`| Starts local dev servers at http://localhost:3000 (web) and http://localhost:3001 (api)
 
## Author

#### James Rea

- LinkedIn ([@jamesreaco](https://linkedin.com/in/jamesreaco))
- Website ([jamesrea.co](https://jamesrea.co))
- X (Twitter) ([@jamesreaco](https://x.com/jamesreaco))
