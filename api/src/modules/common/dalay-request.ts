import { config } from '../config';

export const delayRequest = (response: () => Promise<any>): Promise<any> =>
  new Promise<any>((done) => {
    const delay = Math.floor(Math.random() * config.delay.max);

    setTimeout(
      () => {
        done(response());
      },
      delay < config.delay.min ? config.delay.min : delay,
    );
  });
