import { describe, expect, test, beforeAll } from '@jest/globals';

import * as adminUserModule from '../lib/admin-users';
import { UserProfile } from '../lib/interfaces';
import { UserRole } from '../lib/utilities/AppEnums';

beforeAll(async () => {});

describe('admin-users apis test suite', () => {
    /*
    Note: The following apis have been tested through REST endpoints
    - getUser
    - setUserRole
    - removeUserRole
    */
    // test('test getAllUsers() : ', async () => {
    //     const result = await adminUserModule.getAllUsers();
    //     console.log('Number of users : ' + result.length);
    //     expect(result);
    // });
    // test('test getUsersByRole() : ', async () => {
    //     const result = await adminUserModule.getUsersByRole(UserRole.ADMIN);
    //     console.log(`Number of users (${UserRole.ADMIN}) : ` + result.length);
    //     expect(result);
    // });
    // test('test deleteUser() : ', async () => {
    //     const result = await adminUserModule.deleteUser('test-user@123.com');
    //     console.log(`User deleted ? : ` + result);
    //     expect(result);
    // });
});
