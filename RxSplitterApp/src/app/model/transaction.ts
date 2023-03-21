import { ParticipantsShare } from "./participants-share";

export class Transaction {
    groupId?:number;
    categoryId?:number;
    description?:string;
    amount?:number;
    date?:string;
    filePath?:string;
    paidBy?:number;
    lstExpenseTransaction?:ParticipantsShare[];
    
}
