import {ImporterApp} from './importer-app';

try {
    new ImporterApp().start();
} catch (e) {
    console.log(e);
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    console.log('uncaughtException', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled Rejection', err);
});
