import { inject,NewInstance } from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import { ValidationController,ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { Console } from 'console';
import {BootstrapFormRenderer} from '../../renderers/bootstrap-form-renderer';
//import {HttpClient} from 'aurelia-http-client';
import {I18N} from 'aurelia-i18n';
import {RouterConfiguration, Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import { Applicant } from './applicant';
interface Todo {
  description: string;
  done: boolean;
}
let httpClient = new HttpClient();
httpClient.configure(config => {
  config
    .useStandardConfiguration()
    .withBaseUrl('https://localhost:44348/ApplicantInfo/');
});
@inject(I18N,Router)
export class Home{
    paramId;
    Id="";
    todos: Todo[] = [];
  todoDescription = '';
    NameInput = '';
    FamilyNameInput = '';
    AddressInput = '';
    CountryOfOriginInput = '';
    EMailAddressInput = '';
    AgeInput = '';
    HiredInput = true;
    controller;
    checkinglist;
    i18n;
  router: Router;
  DeleteSuccess=false;
  GenericError=false;
  AddSuccess=false;

    activate(params){
      if(params.msg!=null&&params.msg!=undefined&&params.msg=="success"){
        this.AddSuccess=true;
      }
    }
    constructor(i18n,router){
      this.i18n = i18n;
      this.router=router;
        let check;
        httpClient.fetch('')
      .then(response => response.json())
      .then(data => {
         this.checkinglist=data;
      }).catch(error => {
        this.GenericError=true;
      });
    }
    DeleteApplicant(check){
      this.AddSuccess=false;
      httpClient.fetch(check, {
        method: "DELETE"
     })
     .then(response => response.json())
     .then(data => {
        console.log(data);
        if(data==1){
          httpClient.fetch('')
          .then(response => response.json())
          .then(data => {
             this.checkinglist=data;
             this.DeleteSuccess=true;
          }).catch(error => {
            this.GenericError=true;
          });
        }else{
          this.GenericError=true;
        }
     }).catch(error => {
      this.GenericError=true;
    });
    }
    EditApplicant(Id){
      this.router.navigate("applicant/"+Id);
    }
}