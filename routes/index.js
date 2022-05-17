/* Route file */
const url = require('url');
const express = require('express');
const router = express.Router();
if (!process.env.STRIPE_SECRET_KEY) {
  console.log('[!] Error - need to setup the .env file with Stripe publishable and secret keys, or run `export STRIPE_PUBLISHABLE_KEY=<stripe_public_key>` and `export STRIPE_SECRET_KEY=<stripe_secret_key>`');
  process.exit(1);
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

var CUSTOMER;

// For demo purposes, just retrieve one customer via the API
async function getCustomer() {
  const customer = await stripe.customers.list({limit: 1});
  if (customer.data.length > 0) {
    CUSTOMER = customer.data[0].id;
    console.log('[+] Demo Customer ID is ' + CUSTOMER);
  }
  else {
    console.log('[-] No customers found!');
  }
}
getCustomer();

router.get('/', (req, res) => {
  res.render('demo', {
    layout: 'dashboard.hbs',
    hasDefaultCustomer: CUSTOMER != undefined
  });
});

router.get('/customer', (req, res) => {
    res.render('customer', {
        layout: 'dashboard.hbs',
    });
});

router.post('/customer', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const country = req.body.country;
  const addressLine1 = req.body.address_line1;
  const addressCity = req.body.address_city;
  const addressState = req.body.address_state;
  const addressPostalCode = req.body.address_postal_code;

  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      address: {
        line1: addressLine1,
        city: addressCity,
        state: addressState,
        postal_code: addressPostalCode,
        country: country,
      },
    });

    CUSTOMER = customer.id;
    console.log('New default customer is ' + CUSTOMER);

    console.log(customer);
    res.redirect('/success-customer');
  } catch (error) {
    console.log(error);
    res.render('customer', {
        layout: 'dashboard.hbs',
        error: error,
    });
  }
});

router.get('/setup-intent', async (req, res) => {
  const setupIntent = await stripe.setupIntents.create({
    customer: CUSTOMER,
    payment_method_types: ['card', 'us_bank_account'],
  });

  res.render('setup-intent', {
    layout: 'dashboard.hbs',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: setupIntent.client_secret,
  });
});

router.get('/customer-portal', async (req, res) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: CUSTOMER,
    return_url: 'http://localhost:3000/',
  });

  res.redirect(portalSession.url);
});

router.get('/success', (req, res) => {
  res.render('success', {
    layout: 'dashboard.hbs',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.get('/success-customer', (req, res) => {
  res.render('success-customer', {
    layout: 'dashboard.hbs',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.get('/verify-debit-card/:pmId', async (req, res) => {
  const paymentMethodId = req.params.pmId;
  const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (pm.card) {
    console.log(pm.card);
    if (pm.card.funding == 'debit') {
      res.json({
        isDebit: true
      });
    }
    else {
      res.json({
        isDebit: false
      });
      // Detach the payment method from the customer (can't delete via the API)
      await stripe.paymentMethods.detach(paymentMethodId);
    }
  }
  else {
    res.json({
      isDebit: true
    });
  }
});

module.exports = router;
