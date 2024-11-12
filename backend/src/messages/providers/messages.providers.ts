import { Connection } from 'mongoose';
import { MessageSchema } from '../schemas/message.schemas';

export const messagesProviders = [
  {
    provide: 'MessageModel', 
    useFactory: (connection: Connection) =>
      connection.model('Message', MessageSchema), 
    inject: ['DATABASE_CONNECTION'], 
  },
];
