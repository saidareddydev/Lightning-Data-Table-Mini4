import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CustomModelForDataTable extends LightningElement {
    @api isDisplayMode = false;
    @api isEditMode = false;
    @api recordInputId;

    get header(){
        
        if(this.isDisplayMode) return "Display Contact Details";
        else if(this.isEditMode) return "Edit Contact Details";
        else return "";

    }
    closeModalHander (){
        let myCustomEvent = new CustomEvent("closemodal");
        this.dispatchEvent(myCustomEvent);
    }

    successHandler(){
        this.showToast();
        this.closeModalHander();
    }
    showToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            message:'Record Saved Successfully....',
            variant  : 'success'
             
        });
        this.dispatchEvent(event);
    }

}