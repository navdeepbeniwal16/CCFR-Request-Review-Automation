# CP QUOKKA README

## Project Overview

The Colon Cancer Family Registry (CCFR) Cohort is an international consortium of six institutes across Northern America and Australasia, formed as a resource to support studies on the aetiology, prevention, and clinical management of colorectal cancer. The strength of the CCFR is enhanced by remaining engaged with the scientific community. This project involves developing a web-based project management application to process incoming collaboration requests from external researchers. The application will automate existing manual tasks and workflows providing a streamlined user-friendly system.
The application will facilitate growth in collaboration requests and ease workloads of CCFR staff. The application will centralise all components of collaboration request management providing a holistic and entirely integrated system for the requestor and CCFR team. The application will include the following features:

- Researcher registration portal allowing researchers to save and return to incomplete applications.

- Replace existing paper-based request forms with web-based forms.

- Automated tracking system.

- Automated workflows and task assignment.

- Notification feature that sends emails to CCFR team and researchers.

## Authors
- [Irgio Basrewan](https://github.com/irgiob) - Scrum Master
- [Dimitri Sadikin](https://github.com/dimitrisad) - Design Lead
- [Navdeep Beniwal](https://github.com/navdeepbeniwal16) - Architecture Lead
- [Mohammad Saood Abbasi](https://github.com/MohammadSaoodAbbasi) - Product Owner
- [Michael Hannon](https://github.com/mhannon11) - Quality Assurance Lead


## Tech Stack

**Application Development Platform:** Firebase

**Front End Framework:** React.js, Next.js, Mantine

**Back End Framework:** Node.js, next-firebase-auth

**Email Service Engine:** Nodemailer

## Running on Development
Set up instructions
```bash
  npm install
```

On the off chance that an error occur when trying to install npm, try running:
```bash
npm install -legacy-peer-deps
```
The instruction above will install the dependencies for the libraries used for this project

To run this project on your local machine:

```bash
  npm run dev
```
or 

```bash
  npm build
```
Followed by (only necessary when using "npm build")
```bash
  npm start
```
For testing, run:

```bash
  npm test
```


Please refer to the following user profile to test several functionalities including authentication:


| User              | Password             |
| ----------------- | -------------------- |
| derrick@test.com | password              |