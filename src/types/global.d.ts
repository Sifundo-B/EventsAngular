interface PayPalActions {
    order: {
      create: (data: any) => Promise<string>;
      capture: () => Promise<any>;
    };
  }
  
  declare var paypal: {
    Buttons: (options: {
      createOrder: (data: any, actions: PayPalActions) => Promise<string>;
      onApprove: (data: any, actions: PayPalActions) => Promise<void>;
      onError?: (err: any) => void;
    }) => {
      render: (selector: string) => void;
    };
  };
  