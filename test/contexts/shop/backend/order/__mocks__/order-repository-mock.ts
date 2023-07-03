import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { Criteria } from '@shared/domain/criteria/criteria';
import { Order } from '@storeback/order/domain/order';
import { OrderRepository } from '@storeback/order/domain/order-repository';

export class OrderRepositoryMock implements OrderRepository {
  private saveMock: SinonStub;
  private searchMock: SinonStub;
  private searchAllMock: SinonStub;
  private matchingMock: SinonStub;
  private orders: Array<Order> = [];

  constructor() {
    this.saveMock = stub();
    this.searchMock = stub();
    this.searchAllMock = stub();
    this.matchingMock = stub();
  }

  returnOnSearch(orders: Array<Order>) {
    this.orders = orders;
  }

  returnOnSearchAll(orders: Array<Order>) {
    this.orders = orders;
  }

  returnMatching(orders: Array<Order>) {
    this.orders = orders;
  }

  async save(order: Order): Promise<void> {
    this.saveMock(order);
  }

  assertSaveHaveBeenCalledWith(expected: Order): void {
    expect(this.saveMock).to.have.been.calledWith(expected);
  }

  async search(): Promise<Order> {
    this.searchMock();
    return this.orders[0];
  }

  assertSearch() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async searchAll(): Promise<Order[]> {
    this.searchAllMock();
    return this.orders;
  }

  assertSearchAll() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async matching(criteria: Criteria): Promise<Order[]> {
    this.matchingMock(criteria);
    return this.orders;
  }

  assertMatchingHasBeenCalledWith(criteria: Criteria) {
    expect(this.matchingMock).to.have.been.calledWith(criteria);
  }
}
