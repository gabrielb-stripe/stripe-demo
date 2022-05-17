## Overview:

This is a simple NodeJS demo app to show the processes of:

* Creating a new [Customer](https://stripe.com/docs/billing/customer)
* Showing the [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
* Showing how to save a payment method and verify that it is either a debit card or bank account

## Approach:
For simplicity this is a node + express app that uses vanilla javascript and handlebars for server-side rendering. Tailwind is the CSS framework.

### Tech Used:
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/en/starter/installing.html)
- Vanilla Javascript
- [Handlebars](https://handlebarsjs.com/api-reference/)
- [Tailwind](https://tailwindcss.com/docs)
- [Stripe](https://stripe.com/docs/js)

## Setup:
Run `npm install` to install all necessary dependencies

Create a Stripe account [here](https://dashboard.stripe.com/register).

Update the `.env` file with your test account's publisable and secret key values.

Update your Customer Portal settings in the Dashboard [here](https://dashboard.stripe.com/test/settings/billing/portal). Specifically, add a Terms of Service URL and Privacy Policy URL under the "Business Information" section. You can also enable things in there to allow customers to update their saved payment methods and other personal information.

## Run the demo
Run `npm start` to run the demo and visit `http://localhost:3000`

## API Reference
[Stripe API reference](https://stripe.com/docs/api)
