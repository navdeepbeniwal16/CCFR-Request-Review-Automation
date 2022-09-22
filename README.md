# CP QUOKKA README

## Project Overview

The Colon Cancer Family Registry (CCFR) Cohort is an international consortium of six institutes across Northern America and Australasia, formed as a resource to support studies on the aetiology, prevention, and clinical management of colorectal cancer. The strength of the CCFR is enhanced by remaining engaged with the scientific community. This project involves developing a web-based project management application to process incoming collaboration requests from external researchers. The application will automate existing manual tasks and workflows providing a streamlined user-friendly system.
The application will facilitate growth in collaboration requests and ease workloads of CCFR staff. The application will centralise all components of collaboration request management providing a holistic and entirely integrated system for the requestor and CCFR team. The application will include the following features:

- Researcher registration portal allowing researchers to save and return to incomplete applications.

- Replace existing paper-based request forms with web-based forms.

- Automated tracking system.

- Automated workflows and task assignment.

- In-built messaging/notification system integrating communications between CCFR team and the researcher.

## Authors
- Dimitri Sadikin
- Navdeep Beniwal
- Irgio Basrewan
- Michael Hannon
- Mohammad Saood Abbasi

## Deployment
Set up instructions
```bash
  npm install
```

On the off chance that an error occur when trying to install npm, try running:
```bash
npm install -legacy-peer-deps
```
The instruction above will install the dependencies for the libraries used for this project

To deploy this project run:

```bash
  npm run dev
```
or 

```bash
  npm start
```
As the regitration functionality has not been complicated, please refer to the following user profile to test other functionalities including authentication:


| User              | Password             |
| ----------------- | -------------------- |
| testuser@test.com | password1            |