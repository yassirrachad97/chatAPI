export interface Channel {
    name: string;
    type: 'public' | 'private';
    members: string[];
    createdBy: string;
  }
  