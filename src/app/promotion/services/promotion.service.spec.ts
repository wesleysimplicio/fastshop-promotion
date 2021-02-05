import { TestBed, ComponentFixture, getTestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { PromotionService } from './promotion.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TokenService } from 'src/app/shared/services/token.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

 describe('PromotionService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let service: PromotionService;

//     const envStub = { apiCheckoutV2: 'https://api.fastshop.com.br/v1/clickcollect/inventory/' };
//     const results = {
//       address: '12',
//       available: '12',
//       city: 'guarulhos',
//       clickCollect: true,
//       geoLocation: '11233',
//       isCD: true,
//       name: 'nome',
//       neighborhood: 'bairro',
//       pickupStore: true,
//       state: 'sp',
//       storeId: '12132',
//       zipCode: '1231331',
//     };
//     const coords = {
//       coords: {
//         latitude: 123,
//         longitude: 321
//       }
//     };
//     const addClickCollect = {
//       product: {
//         productID: '123',
//         quantity: '123',
//       },
//       pickupStore: {
//         name: 'nome',
//         document: '123',
//         branchId: '123',
//       }
//     };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserDynamicTestingModule,
          HttpClientModule,
        ],
        providers: [
        //   { provide: Environment, useValue: envStub },
        //   { provide: UtilStorage, useValue: {} },
          HttpClient,
          PromotionService
        ]
      });

      injector = getTestBed();
      service = injector.get(PromotionService);
      httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

//     describe('getGeoLocation method', () => {
//       it('getGeoLocation success', fakeAsync(() => {
//         service.getGeoLocation('123', coords).subscribe(_ => expect(results).toBe(_));

//         const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
//           expect(request.url).toEqual(envStub.apiCheckoutV2 + 'availabilityNearByGeo?sku=123&lat=123&lng=321');
//           expect(request.method).toBe('GET');
//           return true;
//         });
//         req.flush(results);
//         tick();
//       }));

//       it('getGeoLocation error', fakeAsync(() => {
//         service.getGeoLocation('123', coords).subscribe(null, (error) => error.status = 401);

//         const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
//           expect(request.url).toEqual(envStub.apiCheckoutV2 + 'availabilityNearByGeo?sku=123&lat=123&lng=321');
//           expect(request.method).toBe('GET');
//           return true;
//         });
//         req.flush(throwError({ error: 401 }));
//         tick();
//       }));
//     });

});
