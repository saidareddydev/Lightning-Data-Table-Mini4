public with sharing class ContactDetailsHandler {
        @AuraEnabled(cacheable=true)
        Public Static List<Contact> getContactForDataTable(){
            List<Contact> conList =  [
                                        SELECT 
                                            Id,
                                            Name,
                                            FirstName,
                                            LastName,
                                            Title,
                                            Phone,
                                            Email,
                                            Image__C,
                                            Rank__C,
                                            AccountId,
                                            Account.Name 
                                        FROM Contact
                                        WHERE AccountId != NULL
                                        WITH USER_MODE
                                        LIMIT 15
                                     ];
                                     return conList;
        }
        @AuraEnabled(cacheable=true)
        Public Static List<Contact> getContactBasedOnAccount(String accountId){
            List<Contact> conList =  [
                                        SELECT 
                                            Id,
                                            Name,
                                            FirstName,
                                            LastName,
                                            Title,
                                            Phone,
                                            Email,
                                            Image__C,
                                            Rank__C,
                                            AccountId,
                                            Account.Name, 
                                            LeadSource
                                        FROM Contact
                                        WHERE AccountId= :accountId
                                        WITH USER_MODE
                                        LIMIT 15
                                     ];
                                     return conList;
        }
}