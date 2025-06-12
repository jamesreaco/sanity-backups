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

### Install dependencies

Run this command in your terminal in the root directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`| Installs dependencies.|

### Setup Convex

Navigate to the web directory using `cd apps/web` and run the following command to set up a [Convex deployment](https://docs.convex.dev/quickstart/nextjs). This will prompt you to log into Convex with GitHub, create a project (or select an exisiting one), and save your production and deployment URLs. 

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
