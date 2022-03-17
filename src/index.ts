import App from './app';
import Log from './utils/utils-log';

async function bootstrap() {
  const app = await App.create();

  // do app specific cleaning before exiting
  process.on('exit', async () => {
    Log.error('Exit');
    await app.cleanUp();
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', () => {
    Log.info('SIGINT - Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (e) => {
    Log.error('Uncaught Exception...');
    Log.error('Stack: ' + e.stack);
    process.exit(99);
  });

  await app.listen();
}

bootstrap();
