require('dotenv').config();
const demoConfig = require('./demo.config');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Currency all products/prices will show in the demo
const currency = demoConfig.currency
const products = demoConfig.products

// Create Products and Prices
// To customize the products being created edit the demo.config.js file
const setup = async () => {

  const seededProducts = await Promise.all(
    products.map(async (product) => {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: [product.image]
      })

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        nickname: product.name,
        currency: currency
      })
    })

  )

  console.log(`🛍️  Products and Prices created`);

  return { data: seededProducts };
}

setup();
