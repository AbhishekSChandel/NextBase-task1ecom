import * as functions from 'firebase-functions';

// Hello World function for testing
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase Functions! 🚀');
});
