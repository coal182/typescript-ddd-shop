import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';

export async function containerFactory(): Promise<ContainerBuilder> {
    const container = new ContainerBuilder();
    const loader = new YamlFileLoader(container);
    const env = process.env.NODE_ENV || 'dev';

    await loader.load(`${__dirname}/application-${env}.yaml`);

    return container;
}
