import { LightningElement,wire,api } from 'lwc';
import getContactBasedOnAccount from "@salesforce/apex/ContactDetailsHandler.getContactBasedOnAccount";
import { deleteRecord,updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LEAD_SOURCE from '@salesforce/schema/Contact.LeadSource';

const ACTIONS =[
    
    {label:"View", name:"view"},
    {label:"Edit", name:"edit"},
    {label:"Delete", name:"delete"}
];

const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable : true,hideDefaultActions:true },
    { label: 'Last Name', fieldName: 'LastName', editable : true,hideDefaultActions:true },
    { label: 'Title', fieldName: 'Title', editable : true,hideDefaultActions:true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable : true,hideDefaultActions:true  },
    { label: 'Email', fieldName: 'Email', type: 'email' , editable : true,hideDefaultActions:true },
    { label : "Lead Source",
    fieldName : "LeadSource" ,
    type : "customPicklist",
    editable : true ,
    typeAttributes : {
     options : {fieldName : "pickListOptions"},
     value : {fieldName : "LeadSource"},
     context : {fieldName : "Id"}        
    },
    hideDefaultActions:true,
    },
    {
        type : 'action',
        typeAttributes : {
        rowActions : ACTIONS
    }  
    }
    
];

export default class EditDataTableRows_PickList extends LightningElement {
    @api recordId;
    contactData = [];
    columns = columns;
    draftValues = [];
    contactRefrshProp;
    leadSourceOptions = [];
    viewMode = false;
    editMode = false;
    showModal = false;
    selectedRecordId;

    @wire(getContactBasedOnAccount,{
         accountId : "$recordId",
        pickList : "$leadSourceOptions"
        
    })
    
    getContactOutput(result){
        this.contactRefrshProp = result;
        if(result.data){
           // this.contactData = result.data;
           console.log("Lead Source Options Polulated..")
           this.contactData = result.data.map((currentItem)=>{
            let pickListOptions = this.leadSourceOptions;
            return {
                ...currentItem,
                pickListOptions : pickListOptions
            };
           });

        } else if(result.error){
            console.log("Error While Loading Records....");
        }
    }

    @wire(getObjectInfo,{
        objectApiName : CONTACT_OBJECT
    }) objectInfo;

    @wire(getPicklistValues,{
        recordTypeId : "$objectInfo.data.defaultRecordTypeId",
        fieldApiName : LEAD_SOURCE
    })wirePicklist({data,error}){
        if(data){
            this.leadSourceOptions = data.values;
            console.log("this.leadSourceOptions",this.leadSourceOptions);
        } else if(error){
            console.log("Error While Loading Data ",error);
        }
    }

    async saveHandler(event){

        let records =  event.detail.draftValues; // Array of Modifyied Records

        let updateRecordsArray = records.map((currentItem)=>{
            let fieldInput = {...currentItem};
            return {
                fields : fieldInput
            };
           });
           this.draftValues = [];
           let updateRecordsArrayPromise = updateRecordsArray.map((currItem)=>updateRecord(currItem));
           await Promise.all(updateRecordsArrayPromise);

           const evt = new ShowToastEvent({
            title: 'Success',
            message:'Records Updated Successfully....',
            variant : 'success'
        });
        this.dispatchEvent(evt);
        await refreshApex(this.contactRefrshProp);
        }

        rowActionHander(event){
            let action = event.detail.action;
            let row = event.detail.row;
            this.selectedRecordId = row.Id;
            this.viewMode = false;
            this.editMode = false;
            this.showModal = false;
            
            if(action.name === "view"){
                this.viewMode = true;
                this.showModal = true;
               
    
            }else if(action.name === "edit"){
                this.editMode = true;
                this.showModal = true;
               
            } else if(action.name === "delete"){
                this.deleteHandler();   
    
            }
    
        }
        async deleteHandler(){
            // delete Record Adapter or Apex Class
            try{
                await deleteRecord(this.selectedRecordId);
                const evt = new ShowToastEvent({
                 title: 'Success',
                 message:'Records Deleted Successfully....',
                 variant : 'success'
             });
             this.dispatchEvent(evt);
             await refreshApex(this.contactRefrshProp);
             
             } catch(error){
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant : 'error'
                });
                this.dispatchEvent(evt); 
             }
    
            }
    
        async closeModal(event){
            this.showModal = false;
            if(this.editMode){
                await refreshApex(this.contactRefrshProp);
            }
        }
}