import { Criteria } from '@domain/criteria/criteria';
import { Filter } from '@domain/criteria/filter';
import { FilterField } from '@domain/criteria/filter-field';
import { FilterOperator, Operator } from '@domain/criteria/filter-operator';
import { FilterValue } from '@domain/criteria/filter-value';
import { Filters } from '@domain/criteria/filters';
import { Order } from '@domain/criteria/order';

export class BackofficeProductCriteriaMother {
  static whithoutFilter(): Criteria {
    return new Criteria(new Filters([]), Order.fromValues());
  }

  static nameAndDurationContainsSortAscById(name: string, duration: string): Criteria {
    const filterFieldName = new FilterField('name');
    const filterFieldDuration = new FilterField('duration');
    const filterOperator = new FilterOperator(Operator.CONTAINS);
    const valueName = new FilterValue(name);
    const valueDuration = new FilterValue(duration);

    const nameFilter = new Filter(filterFieldName, filterOperator, valueName);
    const durationFilter = new Filter(filterFieldDuration, filterOperator, valueDuration);

    return new Criteria(new Filters([nameFilter, durationFilter]), Order.asc('id'));
  }
}
