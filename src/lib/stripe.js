import "server-only";
import Stripe from "stripe";

// বাংলা মন্তব্য: Frontend API stripe helper lazy create করা হয়েছে যাতে missing key হলে build fail না করে।
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
