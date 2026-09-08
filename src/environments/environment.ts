
const useEmulator = true;

const functionsBaseUrl = useEmulator
  ? 'http://127.0.0.1:5001/gomart-apps/europe-west2'
  : 'https://europe-west2-gomart-apps.cloudfunctions.net';

export const environment = {
  production: false,

  // Controls whether Firebase Functions use the local emulator
  useEmulator,

  firebaseApp: {
    apiKey: 'AIzaSyAZnz0p28jpl35BaWB_7f578WkNEg6NAyY',
    authDomain: 'gomart-apps.firebaseapp.com',
    projectId: 'gomart-apps',
    storageBucket: 'gomart-apps.appspot.com',
    messagingSenderId: '1066738259998',
    appId: '1:1066738259998:web:2b2be5b0d76325c9a3760f',
    measurementId: 'G-XSQ0VXTJXY',
  },

  // Contact form
  contactFunctionUrl: `${functionsBaseUrl}/sendContactMessage`,

// Donations
initializeDonationUrl: `${functionsBaseUrl}/initializeDonation`,
  verifyDonationUrl: `${functionsBaseUrl}/verifyDonation`,
};
