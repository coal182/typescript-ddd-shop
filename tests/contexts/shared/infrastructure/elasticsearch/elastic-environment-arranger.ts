import {Client as ElasticClient} from '@elastic/elasticsearch';
import ElasticConfig from '@infrastructure/persistence/elasticsearch/elastic-config';

import {EnvironmentArranger} from '../arranger/environment-arranger';

export class ElasticEnvironmentArranger extends EnvironmentArranger {
    constructor(
        private _client: Promise<ElasticClient>,
        private config: ElasticConfig,
    ) {
        super();
    }

    protected indexName(): string {
        return this.config.indexName;
    }

    public async arrange(): Promise<void> {
        await this.clearIndex();
    }

    protected async clearIndex(): Promise<void> {
        await this.wait(1000);

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

    protected async deleteIndex(): Promise<void> {
        const client = await this.client();

        try {
            // Utiliza el método `indices.delete` para eliminar el índice
            await client.indices.delete({
                index: this.config.indexName,
            });

            console.log(`Índice "${this.config.indexName}" eliminado con éxito.`);
        } catch (error) {
            console.error(`Error al eliminar el índice "${this.config.indexName}":`, error);
        }
    }

    protected client(): Promise<ElasticClient> {
        return this._client;
    }

    public async close(): Promise<void> {
        return (await this.client()).close();
    }

    private wait(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
}
