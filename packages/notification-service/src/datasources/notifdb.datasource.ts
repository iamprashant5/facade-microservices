import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'notifdb',
  connector: 'postgresql',
  url: 'postgres://prashants:123@localhost/notifdb',
  host: 'localhost',
  port: 5432,
  user: 'prashants',
  password: '123',
  database: 'notifdb',
  schema: 'main',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotifdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'notifdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notifdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
