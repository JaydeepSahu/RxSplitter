export interface EmailUserSetting {
    email?:boolean,
    notification?:boolean,
    userSettings:[{
    id:number,userId:string,emailPeriodId ?:number,emailTypeId ?: number,isActive ? : boolean,emailTypeName:string
}]
}
