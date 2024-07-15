import { Cat } from './entity/cat.entity';

export const catProviders = [
  {
    provide: 'CAT_REPOSITORY',
    useValue: Cat,
  },
];
