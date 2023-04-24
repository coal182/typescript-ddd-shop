import { Criteria } from '@shared/domain/criteria/criteria';
import { Filter } from '@shared/domain/criteria/filter';
import { FilterField } from '@shared/domain/criteria/filter-field';
import { FilterOperator, Operator } from '@shared/domain/criteria/filter-operator';
import { FilterValue } from '@shared/domain/criteria/filter-value';
import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';
import { UserRepository } from '@storeback/user/domain/user-repository';

export class UserByEmailFinder {
  constructor(private userRepository: UserRepository) {}

  async run(email: string) {
    const filters: Filters = {
      filters: [new Filter(new FilterField('email'), new FilterOperator(Operator.EQUAL), new FilterValue(email))],
    };
    const order: Order = Order.fromValues('id', 'asc');
    const criteria = new Criteria(filters, order);
    const users = await this.userRepository.matching(criteria);

    return users;
  }
}
