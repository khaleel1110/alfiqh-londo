const useEmulator = false;

const functionsBaseUrl = 'https://europe-west2-gomart-apps.cloudfunctions.net';

export const environment = {
  production: true,
  useEmulator,

  firebaseApp: {
    apiKey: 'AIzaSyAZnz0p28jpl35BaWB_7f578WkNEg6NAyY',
    authDomain: 'gomart-apps.firebaseapp.com',
    projectId: 'gomart-apps',
    storageBucket: 'gomart-apps.appspot.com',
    messagingSenderId: '1066738259998',
    appId: 'YOUR_EXISTING_APP_ID',
    measurementId: 'G-XSQ0VXTJXY',
  },

  initializeDonationUrl: `${functionsBaseUrl}/initializeDonation`,

  verifyDonationUrl: `${functionsBaseUrl}/verifyDonation`,

  contactFunctionUrl: `${functionsBaseUrl}/sendContactMessage`,
};
