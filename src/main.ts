import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute} from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import {App} from 'app';
// import 'bootstrap/dist/css/bootstrap.css';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));
  aurelia.use.plugin(PLATFORM.moduleName('bootstrap'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => { 
    let aliases = ['t', 'i18n']; 
    TCustomAttribute.configureAliases(aliases);
    instance.i18next.use(Backend); 
    return instance.setup({
      fallbackLng: 'de', 
      whitelist: ['en', 'de'],
      preload: ['en', 'de'], 
      ns: 'global', 
      defaultNS: 'global',
      fallbackNS: false,
      attributes: aliases, 
      lng: 'en', 
      debug: true, 
      backend: {                                  
        loadPath: './locales/{{lng}}/{{ns}}.json',  
      }
    });
  });
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
    config.useDefaults();
    config.settings.lock = true;
    config.settings.centerHorizontalOnly = false;
    config.settings.startingZIndex = 5;
    config.settings.keyboard = true;
  }); 
  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('App')));
}
