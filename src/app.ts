// export class App {
//   public message = 'Hello World!';
// }
import { inject,NewInstance } from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import { ValidationController,ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { Console } from 'console';
import {BootstrapFormRenderer} from './renderers/bootstrap-form-renderer';
//import {HttpClient} from 'aurelia-http-client';
import {I18N} from 'aurelia-i18n';
import {RouterConfiguration, Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import 'bootstrap';
import 'font-awesome/css/font-awesome.css';
interface Todo {
  description: string;
  done: boolean;
}
let httpClient = new HttpClient();
const baseUrl='https://localhost:44348/ApplicantInfo/';
@inject(ValidationControllerFactory,I18N)
export class App {
  router: Router;
  i18n;
  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Hahn';
    config.options.root = '/';
    config.map([
      { route: ['', 'home'],            name: 'home',      moduleId: PLATFORM.moduleName('elements/home/home'), title:'Home' },
      { route:  'applicant/:new',       name: 'applicant', moduleId: PLATFORM.moduleName('elements/home/applicant'), title:'Applicant' },
      { route:  'home/:msg',       name: 'homeMsg', moduleId: PLATFORM.moduleName('elements/home/home'), title:'Home' }
    ]);
  }
  constructor(controllerFactory,i18n) {
    this.i18n = i18n;
  }
}



