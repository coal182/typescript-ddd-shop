import {of} from 'rxjs';

import {UserService} from '../user/user-service/user.service';

export class MockUserService implements UserService {
    getUser = jasmine.createSpy('getUser').and.returnValue(of({}));
    putUser = jasmine.createSpy('putUser').and.returnValue(of({}));
}
