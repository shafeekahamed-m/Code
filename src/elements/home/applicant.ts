// export class App {
//   public message = 'Hello World!';
// }
import { inject,NewInstance } from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import { ValidationController,ValidationControllerFactory, ValidationRules,validateTrigger } from 'aurelia-validation';
import { Console } from 'console';
import {BootstrapFormRenderer} from '../../renderers/bootstrap-form-renderer';
//import {HttpClient} from 'aurelia-http-client';
import {I18N} from 'aurelia-i18n';
import {RouterConfiguration, Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import {ErrorPrompt} from '../dialog/errordialog';
import {ErrorMessage} from '../dialog/errormsgdialog';

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
const baseUrl='https://localhost:44348/ApplicantInfo/';
@inject(ValidationControllerFactory,I18N,Router,DialogService)
export class Applicant {
  
  heading = "Todos";
  todos: Todo[] = [];
  Id=0;
  todoDescription = '';
  NameInput = '';
  FamilyNameInput = '';
  AddressInput = '';
  CountryOfOriginInput = '';
  EMailAddressInput  = '';
  AgeInput = '';    
  HiredInput = false;
  controller;
  edited=false;
  i18n;
  router: Router;
  paramId;
  dialogService;
  DisableSubmit=true;
activate(params){
    this.paramId=params.new;
    console.log(this.paramId);
    if(this.paramId!="new"){
      httpClient.fetch(this.paramId)
      .then(response => response.json())
      .then(data => 
        {
          this.Id=data[0].id?data[0].id:0;
          this.NameInput = data[0].name;
          this.FamilyNameInput = data[0].familyName;
          this.AddressInput = data[0].address;
          this.CountryOfOriginInput = data[0].countryOfOrigin;
          this.EMailAddressInput = data[0].eMailAddress;
          this.AgeInput = data[0].age;
          this.HiredInput = data[0].hired;
          this.DisableSubmit=false;
      }).catch(error => {
        if(this.paramId!="new"){
            console.log('Error saving comment!');
        }
      });
    }
}

  constructor(controllerFactory,i18n,router,dialogService) {
    this.i18n = i18n;
    console.log("check locale"+this.i18n.getLocale());
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.change;
    this.controller.addRenderer(new BootstrapFormRenderer());
    ValidationRules
  .ensure('NameInput').required().minLength(5)
  .ensure('FamilyNameInput').required().minLength(5)
  .ensure('AddressInput').required().minLength(10)
  .ensure('CountryOfOriginInput').required()
  .ensure('EMailAddressInput').required().email()
  .ensure('AgeInput').required().between(20,60)
  .on(this);
  this.router=router;
  this.dialogService = dialogService;
  }
  enableSend(){
    console.log(this.controller.errors);
    return !this.edited;
  }
  addApplicant(){
      if(this.Id>0){
        let applicantPostData = { 
            Id:this.Id,
            Name : this.NameInput,
            FamilyName : this.FamilyNameInput,
            Address : this.AddressInput,
            CountryOfOrigin : this.CountryOfOriginInput,
            EMailAddress  : this.EMailAddressInput,
            Age : this.AgeInput,
            Hired : this.HiredInput,
         }
          httpClient.fetch(baseUrl+'save', {
            method: "PUT",
            body: JSON.stringify(applicantPostData)
         })
         .then(response => response.json())
         .then(data => {
            console.log(data);
            this.router.navigate("home/success");
         }) .catch(error => 
          error.json()
       ).then(data=>{
          let msg="";
          data.forEach(function (check) {
        console.log(check);
        msg=msg+" "+check;
    });
         console.log(data);
         this.dialogService.open({viewModel: ErrorMessage, model: msg }).then(openDialogResult => {
           return openDialogResult.closeResult;
         }).then((response) => {
           if (!response.wasCancelled) {
             console.log('good');
           } else {
             console.log('bad');
           }
           console.log(response);
         });
       });

      }else{
        let applicantPostData = { 
            Name : this.NameInput,
            FamilyName : this.FamilyNameInput,
            Address : this.AddressInput,
            CountryOfOrigin : this.CountryOfOriginInput,
            EMailAddress  : this.EMailAddressInput,
            Age : this.AgeInput,
            Hired : this.HiredInput,
         }
          httpClient.fetch(baseUrl+'save', {
            method: "POST",
            body: JSON.stringify(applicantPostData)
         })
         .then(response => response.json())
         .then(data => {
            console.log(data);
            this.router.navigate("home/success");
         }).catch(error => 
          error.json()
       ).then(data=>{
          let msg="";
          data.forEach(function (check) {
        console.log(check);
        msg=msg+" "+check;
    });
         console.log(data);
         this.dialogService.open({viewModel: ErrorMessage, model: msg }).then(openDialogResult => {
           return openDialogResult.closeResult;
         }).then((response) => {
           if (!response.wasCancelled) {
             console.log('good');
           } else {
             console.log('bad');
           }
           console.log(response);
         });
       });
      }
    
  }
 selectedValueInViewChanged(){
    console.log("age "+this.AgeInput);
    if(this.NameInput != '' && this.FamilyNameInput != '' 
    && this.AddressInput != '' && this.CountryOfOriginInput != ''
     && this.EMailAddressInput  != '' && this.AgeInput != '' 
    && this.controller.errors.length==0){
        this.DisableSubmit=false;
    }else{
        this.DisableSubmit=true;
    }
  }
  resetFields(){
    this.dialogService.open({viewModel: ErrorPrompt, model: 'Are you sure you want to reset?' }).then(openDialogResult => {
        return openDialogResult.closeResult;
      }).then((response) => {
        if (!response.wasCancelled) {
            this.NameInput = '';
    this.FamilyNameInput = '';
    this.AddressInput = '';
    this.CountryOfOriginInput = '';
    this.EMailAddressInput  = '';
    this.AgeInput = ''; 
    this.HiredInput = false;
          console.log('good');
        } else {
          console.log('bad');
        }
        console.log(response);
      });
    
  }
}



