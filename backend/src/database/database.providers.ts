import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://zakariaelkoh10:bwEKNW8yU6AhTYpi@cluster0.iofaj.mongodb.net/AlloMedia',
      ),
  },
];
