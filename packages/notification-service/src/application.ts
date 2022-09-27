import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {
  NotificationServiceComponent,
  NotifServiceBindings,
} from '@sourceloop/notification-service';
// dotenv
import * as dotenv from 'dotenv';
import {
  NotificationBindings,
  // PubnubBindings,
  // PubNubProvider,
  // SESBindings,
  // SNSBindings,
} from 'loopback4-notifications';

export {ApplicationConfig};

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(NotificationServiceComponent);

    // this.bind(NotifServiceBindings.Config).to({
    //   useCustomEmailProvider: false,
    //   useCustomSMSProvider: false,
    //   useCustomPushProvider: true,
    //   useCustomSequence: false,
    // });


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
