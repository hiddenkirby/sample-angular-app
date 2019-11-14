// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// These environment variables are not production urls.
export const environment = {
  production: false,
  auth0RedirectUri: 'http://localhost:4200/authCallback',
  auth0LogoutUrl: 'http://localhost:4200/logout',
  factchainUrl: 'https://api.factchain.com/api',
  auth0ClientId: '8y6tZ3QM3qXlx7oMfmFoEa7ZHphaLzsI',
  auth0Domain: 'factchain-pen.auth0.com',
  accessTokenName: 'accessToken',
  idTokenName: 'idToken'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
