import { Client as ElasticClient, errors } from '@elastic/elasticsearch';
import bodybuilder, { Bodybuilder } from 'bodybuilder';
import httpStatus from 'http-status';

import { AggregateRoot } from '@shared/domain/aggregate-root';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';
import { Uuid } from '@shared/domain/value-objects/uuid';

import ElasticConfig from './elastic-config';
import { ElasticCriteriaConverter } from './elastic-criteria-converter';

export abstract class ElasticRepository<T extends AggregateRoot> {
  private criteriaConverter: ElasticCriteriaConverter;

  constructor(private _client: Promise<ElasticClient>, private config: ElasticConfig) {
    this.criteriaConverter = new ElasticCriteriaConverter();
  }

  protected indexName(): string {
    return this.config.indexName;
  }

  protected client(): Promise<ElasticClient> {
    return this._client;
  }

  protected async searchInElastic<D>(unserializer: (data: D) => T, id: Uuid): Promise<Nullable<T>> {
    const body = bodybuilder().query('match', 'id', id);

    const result = await this.searchInElasticWithBuilder(unserializer, body);

    return result.length ? result[0] : null;
  }

  protected async searchAllInElastic<D>(unserializer: (data: D) => T): Promise<T[]> {
    const body = bodybuilder().query('match_all');

    return this.searchInElasticWithBuilder(unserializer, body);
  }

  private async searchInElasticWithBuilder<D>(unserializer: (data: D) => T, body: Bodybuilder): Promise<T[]> {
    const client = await this.client();

    try {
      const response = await client.search<D>({
        index: this.indexName(),
        body: body.build(),
      });

      return response.hits.hits
        .map((hit) => hit._source)
        .filter((source): source is D => !!source)
        .map((source) => unserializer(source));
    } catch (e) {
      if (this.isNotFoundError(e)) {
        return [];
      }
      throw e;
    }
  }

  private isNotFoundError(e: unknown) {
    return this.isResponseError(e) && e.meta.statusCode === httpStatus.NOT_FOUND;
  }

  private isResponseError(e: unknown): e is errors.ResponseError {
    return e instanceof errors.ResponseError;
  }

  protected async searchByCriteria(criteria: Criteria, unserializer: (data: any) => T): Promise<T[]> {
    const body = this.criteriaConverter.convert(criteria);

    return this.searchInElasticWithBuilder(unserializer, body);
  }

  protected async persist(id: string, aggregateRoot: T): Promise<void> {
    const client = await this.client();
    const document = { ...aggregateRoot.toPrimitives() };
    await client.index({ index: this.indexName(), id, body: document, refresh: 'wait_for' }); // wait_for wait for a refresh to make this operation visible to search
  }

  protected async deleteById(id: string): Promise<void> {
    const client = await this.client();

    await client.delete({
      index: this.indexName(),
      id,
      refresh: 'wait_for', // Opcional: espera a que se refresque para que la eliminación sea visible
    });
  }

  protected async clearIndex(): Promise<void> {
    const client = await this.client();

    await client.deleteByQuery({
      index: this.indexName(),
      body: {
        query: {
          match_all: {}, // Eliminar todos los documentos en el índice
        },
      },
    });
  }

  protected async update(id: string, updateBody: any): Promise<void> {
    const client = await this.client();

    await client.update({
      index: this.indexName(),
      id,
      body: {
        doc: updateBody, // Cuerpo de actualización
      },
      refresh: 'wait_for', // Opcional: espera a que se refresque para que la actualización sea visible
    });
  }
}
