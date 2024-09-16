export interface PayPalButtonsComponentOptions {
  createOrder: (data: Record<string, unknown>, actions: PayPalActions) => Promise<string>;
  onApprove: (data: Record<string, unknown>, actions: PayPalActions) => Promise<void>;
  onError: (err: Error) => void;
}

export interface PayPalActions {
  order: {
    create: (options: OrderOptions) => Promise<string>;
    capture: () => Promise<OrderDetails>;
  };
}

export interface OrderOptions {
  purchase_units: PurchaseUnit[];
}

export interface PurchaseUnit {
  amount: {
    value: string;
  };
}

export interface OrderDetails {
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  id: string;
  purchase_units: PurchaseUnit[];
}