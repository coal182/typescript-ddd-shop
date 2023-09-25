import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { Criteria } from '@shared/domain/criteria/criteria';
import { User } from '@shop-backend/user/domain/user';
import { UserRepository } from '@shop-backend/user/domain/user-repository';

export class UserRepositoryMock implements UserRepository {
  private saveMock: SinonStub;
  private searchMock: SinonStub;
  private searchAllMock: SinonStub;
  private matchingMock: SinonStub;
  private users: Array<User> = [];

  constructor() {
    this.saveMock = stub();
    this.searchMock = stub();
    this.searchAllMock = stub();
    this.matchingMock = stub();
  }

  returnOnSearch(users: Array<User>) {
    this.users = users;
  }

  returnOnSearchAll(users: Array<User>) {
    this.users = users;
  }

  returnMatching(users: Array<User>) {
    this.users = users;
  }

  async save(user: User): Promise<void> {
    this.saveMock(user);
  }

  assertSaveHaveBeenCalledWith(expected: User): void {
    expect(this.saveMock).to.have.been.calledWith(expected);
  }

  async search(): Promise<User> {
    this.searchMock();
    return this.users[0];
  }

  assertSearch() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async searchAll(): Promise<User[]> {
    this.searchAllMock();
    return this.users;
  }

  assertSearchAll() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async matching(criteria: Criteria): Promise<User[]> {
    this.matchingMock(criteria);
    return this.users;
  }

  assertMatchingHasBeenCalledWith(criteria: Criteria) {
    expect(this.matchingMock).to.have.been.calledWith(criteria);
  }
}
