import type { Log } from '../types/Log';

const logs: Log[] = [
  {
    id: '1',
    timestamp: new Date(),
    level: 'info',
    message: 'User logged in',
  },
  {
    id: '2',
    timestamp: new Date(),
    level: 'warn',
    message: 'Disk space is running low',
  },
  {
    id: '3',
    timestamp: new Date(),
    level: 'error',
    message: 'Failed to connect to database',
  },
];

export const getLogs = (): Promise<Log[]> => {
  return Promise.resolve(logs);
};
