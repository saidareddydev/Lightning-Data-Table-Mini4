import  LightningDataTable  from 'lightning/datatable';
import CustomNameTemplate from "./CustomName.html";
import CustomRankTemplate from "./CustomRank.html";
import CustomImageTemplate from "./CustomImage.html";
import CustomPickListTemplate from "./customPicklist.html";
import CustomPickListEditTemplate from "./customPicklistEdit.html";
export default class CustomDataType extends LightningDataTable {
    static customTypes = {
        customNameType : {
            template : CustomNameTemplate,
            standardCellLayout : true,
            typeAttributes : ["ContactName"]
        },
        customRank : {
            template : CustomRankTemplate,
            standardCellLayout : false,
            typeAttributes : ["rankIcon"]
        },
        customImage : {
            template : CustomImageTemplate,
            standardCellLayout : true,
            typeAttributes : ["pictureUrl"]
        },
        customPicklist : {
            template : CustomPickListTemplate,
            editTemplate : CustomPickListEditTemplate,
            standardCellLayout : true,
            typeAttributes : ["options","value","context"]
        }

    };
}