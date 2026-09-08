import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling(scrollConfig)),

    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebaseApp)),
    // Authentication
    provideAuth(() => {
      const auth = getAuth();

      if (environment.useEmulator) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
      }

      return auth;
    }),
    // Firestore
    provideFirestore(() => {
      const firestore = getFirestore();

      if (environment.useEmulator) {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }

      return firestore;
    }),

    // Functions
    provideFunctions(() => {
      const functions = getFunctions(getApp());

      if (environment.useEmulator) {
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
      }

      return functions;
    }),

    // Storage
    provideStorage(() => {
      const storage = getStorage();

      if (environment.useEmulator) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }

      return storage;
    }),
  ],
};
