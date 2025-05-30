import {Criteria} from '@shared/domain/criteria/criteria';
import {Filter} from '@shared/domain/criteria/filter';
import {Operator} from '@shared/domain/criteria/filter-operator';
import {Filters} from '@shared/domain/criteria/filters';
import bodybuilder, {Bodybuilder} from 'bodybuilder';

export enum TypeQueryEnum {
    TERMS = 'terms',
    MATCH = 'match',
    MATCH_PHRASE = 'match_phrase',
    MATCH_ALL = 'match_all',
    RANGE = 'range',
    WILDCARD = 'wildcard',
}

type QueryObject = {type: TypeQueryEnum; field: string; value: string | object};

interface TransformerFunction<T, K> {
    (value: T): K;
}

export class ElasticCriteriaConverter {
    private queryTransformers: Map<Operator, TransformerFunction<Filter, QueryObject>>;

    constructor() {
        this.queryTransformers = new Map<Operator, TransformerFunction<Filter, QueryObject>>([
            [Operator.EQUAL, this.matchQuery],
            [Operator.NOT_EQUAL, this.matchQuery],
            [Operator.GT, this.greaterThanQuery],
            [Operator.LT, this.lowerThanQuery],
            [Operator.CONTAINS, this.wildcardQuery],
            [Operator.NOT_CONTAINS, this.wildcardQuery],
            [Operator.ONE_OF, this.matchPhraseQuery],
        ]);
    }

    public convert(criteria: Criteria): Bodybuilder {
        let body = bodybuilder();

        body.from(criteria.offset || 0);
        body.size(criteria.limit || 1000);

        if (criteria.order.hasOrder()) {
            body.sort(criteria.order.orderBy.value, criteria.order.orderType.value);
        }

        if (criteria.hasFilters()) {
            body = this.generateQuery(body, criteria.filters);
        }

        return body;
    }

    protected generateQuery(body: Bodybuilder, filters: Filters): Bodybuilder {
        filters.filters.map((filter) => {
            const {type, value, field} = this.queryForFilter(filter);

            if (filter.operator.value === Operator.ONE_OF) {
                if (typeof value === 'string') {
                    const chunks = value.split('|');
                    body.andQuery('bool', (b) => {
                        if (chunks.length === 1) {
                            return b.orQuery(type, field, value);
                        } else {
                            value.split('|').forEach((val) => {
                                b.orQuery(type, field, val);
                            });
                            return b;
                        }
                    });
                }
            } else if (filter.operator.isPositive()) {
                body.andQuery(type, field, value);
            } else {
                body.notQuery(type, field, value);
            }
        });

        return body;
    }

    private queryForFilter(filter: Filter): QueryObject {
        const functionToApply = this.queryTransformers.get(filter.operator.value);

        if (!functionToApply) {
            throw Error(`Unexpected operator value ${filter.operator.value}`);
        }

        return functionToApply(filter);
    }

    private termsQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.TERMS, field: filter.field.value, value: [filter.value.value]};
    }

    private matchQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.MATCH, field: filter.field.value, value: filter.value.value};
    }

    private matchPhraseQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.MATCH_PHRASE, field: filter.field.value, value: filter.value.value};
    }

    private greaterThanQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.RANGE, field: filter.field.value, value: {gt: filter.value.value}};
    }

    private lowerThanQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.RANGE, field: filter.field.value, value: {lt: filter.value.value}};
    }

    private wildcardQuery(filter: Filter): QueryObject {
        return {type: TypeQueryEnum.WILDCARD, field: filter.field.value, value: `*${filter.value.value}*`};
    }
}
