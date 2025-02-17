export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Sage ",
    description: "A free plan to get you started!",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: ["MIT Licence", "Fast Performance", "Stripe Integration"],
  },
  {
    id: "pro",
    name: "Sage Pro",
    description: "For lots of conversations ",
    price: "$20",
    priceIntervalName: "per month",
    stripe_price_id: "price_1QlbqoGbYMYqQNOiH7NVTjkh",
    stripe_product_id: "prod_Revi7eFuZN3d7Z",
    features: [
      "Everything in Free",
      "Support us with fake money",
      "Test the purchase experience",
    ],
  },
  // {
  //   id: "enterprise",
  //   name: "Sage Enterprise",
  //   description:
  //     "For large companies looking for agents. Try buying this with the test credit card 4242424242424242.",
  //   price: "$10000",
  //   priceIntervalName: "per month",
  //   stripe_price_id: "price_1QlbreGbYMYqQNOi2BEg9qe8",
  //   stripe_product_id: "prod_Revje2uBYG8Vzu",
  //   features: [
  //     "Everything in Pro",
  //     "Try the 'upgrade plan' UX",
  //     "Still actually free!",
  //   ],
  // },
]
