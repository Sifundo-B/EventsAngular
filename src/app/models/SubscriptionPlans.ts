import { Feature } from "./Feature";


export interface SubscriptionPlan {
    id: number;
    planName: string;
    price: number;
    duration: string; 
    features: Feature[];
    subscriptionExpiryDate:Date

   
  }
  