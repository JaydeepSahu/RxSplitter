import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { FooterComponent } from './footer/footer.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupsComponent } from './groups/groups.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { UserComponent } from './user.component';
import { AllgroupMembersComponent } from './allgroup-members/allgroup-members.component';
import { AllGroupsForUserComponent } from './all-groups-for-user/all-groups-for-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowAllexpensesComponent } from './show-allexpenses/show-allexpenses.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ReportsComponent } from './reports/reports.component';


const routes: Routes = [{
    path:'',
      component:UserComponent,
      canActivate : [AuthGuardService],
      children:[
        {
          path:'',
          redirectTo:'',
          pathMatch:'full'
        },
        {
          path:'leftBar',
          component:LeftbarComponent
        },
        
        {
          path:'rightBar',
          component:RightbarComponent
        }
        ,
        {
          path:'footer',
          component:FooterComponent
        },
        {
          path:'groups',
          component:GroupsComponent
        },
        {
          path:'groupDetails/:GroupId',
          component:GroupDetailsComponent
        }
        ,
        {
          path:'groupMembersDetails/:GroupId',
          component:AllgroupMembersComponent
        }
        ,
        {
          path:'groupMembersDetails',
          component:AllgroupMembersComponent
        }
        ,
        {
          path:'groupUser',
          component:AllGroupsForUserComponent
        },
        {
          path:'Dashboard',
          component:DashboardComponent
        }
        ,
        {
          path:'showExpenses',
          component:ShowAllexpensesComponent
        },
        {
          path:'accountSetting',
          component:AccountSettingComponent
        },
        {
          path: 'reports',
          component : ReportsComponent
        }
      ]
    },
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
