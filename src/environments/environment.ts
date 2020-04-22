// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiUrl: 'https://promotion-fast.herokuapp.com/promotion-management/api/',
  apiUrlPrice: 'https://price-management-develop.fastshopdev.com/price-management/api/',
  callBackFastChannel: 'http://localhost:4200/login',
  callLogout: 'http://localhost:4200/login',
  urlFastChannel: 'https://dev-auth.kaive.com.br',
  clientFastChannel: 'portal-multiplecar'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
