import { Routes } from '@angular/router';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeChartsComponent } from './employee-charts/employee-charts.component';

export const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'add-employee', component: EmployeeFormComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'charts', component: EmployeeChartsComponent },
];
