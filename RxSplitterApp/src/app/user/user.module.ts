import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { GroupsComponent } from './groups/groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllGroupsForUserComponent } from './all-groups-for-user/all-groups-for-user.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { AllgroupMembersComponent } from './allgroup-members/allgroup-members.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TotalGExpenseComponent } from './total-gexpense/total-gexpense.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowAllexpensesComponent } from './show-allexpenses/show-allexpenses.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { SettleUpComponent } from './settle-up/settle-up.component';
import { SettleupModalComponent } from './settleup-modal/settleup-modal.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ToPositiveAmountPipe } from '../Pipes/to-positive-amount.pipe';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ReportsComponent } from './reports/reports.component';
import { AllExpenseChartsComponent } from './Charts/all-expense-charts/all-expense-charts.component';
import { GroupExpensesChartsComponent } from './Charts/group-expenses-charts/group-expenses-charts.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { MonthwiseExpensesComponent } from './Charts/monthwise-expenses/monthwise-expenses.component';

import {CdkAccordionModule} from '@angular/cdk/accordion';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 20
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    // autoHide: 1000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftbarComponent,
    RightbarComponent,
    UserComponent,
    GroupsComponent,
    AllGroupsForUserComponent,
    GroupDetailsComponent,
    AllgroupMembersComponent,
    TotalGExpenseComponent,
    DashboardComponent,
    ShowAllexpensesComponent,
    AddExpenseComponent,
    SettleUpComponent,
    SettleupModalComponent,
    AccountSettingComponent,
    ToPositiveAmountPipe,
    ReportsComponent,
    AllExpenseChartsComponent,
    GroupExpensesChartsComponent,
    MonthwiseExpensesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatCardModule,
    HttpClientModule,
   NotifierModule.withConfig(customNotifierOptions),
    NgxChartsModule,
    CdkAccordionModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class UserModule { }
