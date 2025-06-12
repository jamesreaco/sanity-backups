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

### 1). Create an S3 bucket

This project uses Amazon S3 to store the generated backups so you'll need to [create an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

#### Step 1: Access AWS Console 

1. Go to the [AWS Console](https://aws.amazon.com/).
2. Log in with your credentials.

#### Step 2: Navigate to S3

1. In the top search bar, type "S3" and select S3 from the services list.
2. This will take you to the Amazon S3 dashboard.

#### Step 3: Create a Bucket

1. Click the “Create bucket” button.
2. Fill out the bucket details:
    - Bucket name: Must be globally unique (e.g. my-app-bucket-2025).
    - AWS Region: Choose the region closest to your users or application.
3. Click “Create bucket” at the bottom of the page.

### 2). Create an IAM user.

To access the S3 bucket from an external application requires access and secret access keys, you can generate these by creating an IAM user.

#### Step 1: Access AWS Console

1. Go to the [AWS Console](https://aws.amazon.com/).
2. Log in with your credentials.

#### Step 2: Navigate to IAM (Identity and Access Management)

1. In the search bar at the top, type "IAM" and select IAM from the dropdown.
2. This will take you to the IAM dashboard.

#### Step 3: Navigate to Users

1. In the IAM dashboard, click on "Users" in the left sidebar.
2. Click the "Create user" button (orange button on the right).

#### Step 4: Set User Details

1. User name: Enter a descriptive name like `sanity-backup-user` or `s3-backup-service`.
2. Leave "Provide user access to the AWS Management Console" unchecked.
3. Click "Next".

#### Step 5: Set Permissions

1. Click "Attach policies directly" and add `AmazonS3FullAccess`.
2. Click "Next".
3. Review your user details then click "Create user".

#### Step 6: Create access and secret access keys

3. In the "Users" table click on your newly created user.
6. In the summary section click on "Create access key".
7. For "Use case" choose "Application running outside AWS" and then click next.
8. Add a description and click "Create access key".
9. Copy your access key and secret access key as we need to add them to our project as environment variables.

### 3). Install the project

Clone this repository and open it your code editor.

### 4). Add Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

- `AWS_REGION` - The AWS Region you chose when creating your bucket.
- `AWS_ACCESS_KEY_ID` - The access key you created in the previous steps.
- `AWS_SECRET_ACCESS_KEY` - The secret access key you created in the previous steps.
- `S3_BUCKET_NAME` - The name you gave your S3 bucket.

### 4). Install dependencies

Run this command in your terminal in the root directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`| Installs dependencies.|

### Setup Convex

Navigate to the web directory using `cd apps/web` and run the following command to set up a [Convex deployment](https://docs.convex.dev/quickstart/nextjs). This will prompt you to log into your Convex account with GitHub, create a project (or select an exisiting one), and save your production and deployment URLs. 

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npx convex dev`| Sets up a convex dev deployment.|

### 5). Start a local server

Navigate to the root directory and start the development servers by running the following command:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`| Starts local dev servers at http://localhost:3000 (web) and http://localhost:3001 (api)
 
If you have any questions or need help getting set up feel free to send me an email hello@jamesrea.co

## Author

#### James Rea

- LinkedIn ([@jamesreaco](https://linkedin.com/in/jamesreaco))
- Website ([jamesrea.co](https://jamesrea.co))
- X (Twitter) ([@jamesreaco](https://x.com/jamesreaco))
