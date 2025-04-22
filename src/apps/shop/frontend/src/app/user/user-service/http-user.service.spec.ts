import { HttpStatusCode, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {environment} from 'src/environments/environment';

import {HttpUserService} from './http-user.service';
import {PutUserParams} from './user.service';

describe(HttpUserService.name, () => {
    let service: HttpUserService;
    let httpTestingController: HttpTestingController;
    const userId = 'user-id';

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [HttpUserService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(HttpUserService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when asked to get an user', () => {
        it('should call api with correct params', () => {
            const mockUser = {id: userId, name: 'John Doe'};

            service.getUser({id: userId}).subscribe((user) => {
                expect(user).toEqual(mockUser);
            });

            const req = httpTestingController.expectOne(`${environment.apiUrl}user/${userId}`);
            expect(req.request.method).toBe('GET');

            req.flush(mockUser); // Simulate response

            httpTestingController.verify();
        });
    });

    describe('when asked to update an user', () => {
        it('should call api with correct params', () => {
            const params: PutUserParams = {
                id: userId,
                firstname: 'John',
                lastname: 'Doe',
                email: 'johndoe@gmail.com',
                dateOfBirth: '01-01-1990',
            };
            const expectedResponse = {status: HttpStatusCode.Ok};

            service.putUser(params).subscribe((response) => {
                expect(response).toEqual(expectedResponse);
            });

            const req = httpTestingController.expectOne(`${environment.apiUrl}user/${userId}/update`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toBe(params);

            req.flush(expectedResponse); // Simulate response

            httpTestingController.verify();
        });
    });
});
