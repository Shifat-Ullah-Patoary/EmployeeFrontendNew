import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeEditModalComponent } from '../employee-edit-modal/employee-edit-modal.component'; // Import modal component
import { Employee, EmployeeserviceService } from '../service/EmployeeService/employeeservice.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports:[CommonModule, EmployeeEditModalComponent], 
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string = '';

  
  showEditModal: boolean = false;
  selectedEmployeeForEdit: Employee | null = null;

  constructor(private employeeService: EmployeeserviceService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

 
  loadEmployees(): void {
    this.errorMessage = ''; //clear previous error messages
    this.employeeService.getallEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        console.log('Employees loaded:', this.employees);
      },
      error: (error: any) => {
        console.error('Error loading employees:', error);
        this.errorMessage = 'Failed to load employee list.';
      }
    });
  }

  
  openEditModal(employee: Employee): void {
  
    this.selectedEmployeeForEdit = { ...employee };
    this.showEditModal = true;
  }

  /**
   * Handles the event emitted by the modal when an update is successful or cancelled.
   * @param updatedEmployee The employee data if successfully updated, or null if cancelled.
   */
  onModalClose(updatedEmployee: Employee | null): void {
    this.showEditModal = false; 
    this.selectedEmployeeForEdit = null; 

    if (updatedEmployee) {
      
      this.loadEmployees();
      
      console.log('Employee updated successfully from modal:', updatedEmployee);
      this.errorMessage = 'Employee updated successfully!'; 
      setTimeout(() => this.errorMessage = '', 3000); 
    } else {
      console.log('Employee update cancelled or failed.');
    }
  }

  
  deleteEmployee(id: number | undefined): void {
    if (id === undefined) {
      console.warn('Cannot delete employee: ID is undefined.');
      this.errorMessage = 'Cannot delete employee: ID missing.';
      return;
    }

    if (confirm('Are you sure you want to delete this employee?')) {
      this.errorMessage = ''; 
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log(`Employee with ID ${id} deleted successfully.`);
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.errorMessage = 'Employee deleted successfully!';
          setTimeout(() => this.errorMessage = '', 3000); 
        },
        error: (error: any) => {
          console.error(`Error deleting employee with ID ${id}:`, error);
          this.errorMessage = 'Failed to delete employee. Please try again.';
        }
      });
    }
  }
}
