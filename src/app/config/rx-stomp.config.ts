import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { Stomp } from '@stomp/stompjs';

export const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: 'https://eventserver.qtune.io/ws',

  heartbeatIncoming: 0,
  heartbeatOutgoing: 50000,

  reconnectDelay: 30000,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
  
};
