import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeserviceService } from '../service/EmployeeService/employeeservice.service';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {

  employeeData: Employee = {
    name: '',
    email: '',
    dob: '',
    joiningDate: '',
    department: '',
    position: ''
  };

  message: string = '';
  isSuccess: boolean = false;

  constructor(private employeeservice:EmployeeserviceService) {}

  onSubmit() {
    this.message = '';
    
    if (!this.employeeData.name || !this.employeeData.email || !this.employeeData.department) {
      this.message = 'Please fill in required fields.';
      this.isSuccess = false;
      return;
    }

    this.employeeservice.createEmployee(this.employeeData).subscribe({
      next: (response) => {
        this.message = 'Employee created successfully!';
        this.isSuccess = true;
        this.employeeData = {
          name: '',
          email: '',
          dob: '',
          joiningDate: '',
          department: '',
          position: ''
        };
      },
      error: (error) => {
        this.message = 'Error creating employee. Please try again.';
        this.isSuccess = false;
      }
    });




  }

 
}
