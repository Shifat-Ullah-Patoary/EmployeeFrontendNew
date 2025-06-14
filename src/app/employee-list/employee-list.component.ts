import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
 // Adjust path if needed
import { EmployeeEditModalComponent } from '../employee-edit-modal/employee-edit-modal.component'; // Import modal component
import { Employee, EmployeeserviceService } from '../service/EmployeeService/employeeservice.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports:[CommonModule, EmployeeEditModalComponent], // Add modal component here
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string = '';

  // State for the update modal
  showEditModal: boolean = false;
  selectedEmployeeForEdit: Employee | null = null;

  constructor(private employeeService: EmployeeserviceService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

 
  loadEmployees(): void {
    this.errorMessage = ''; // Clear previous errors
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

  /**
   * Opens the edit modal with the selected employee's data.
   * @param employee The employee to be edited.
   */
  openEditModal(employee: Employee): void {
    // Create a deep copy to avoid direct manipulation of the table data
    // before the update is confirmed. Use JSON.parse(JSON.stringify(obj)) for simple objects.
    this.selectedEmployeeForEdit = { ...employee };
    this.showEditModal = true;
  }

  /**
   * Handles the event emitted by the modal when an update is successful or cancelled.
   * @param updatedEmployee The employee data if successfully updated, or null if cancelled.
   */
  onModalClose(updatedEmployee: Employee | null): void {
    this.showEditModal = false; // Close the modal
    this.selectedEmployeeForEdit = null; // Clear selected employee

    if (updatedEmployee) {
      // If an employee was updated, reload the list to reflect changes
      this.loadEmployees();
      // Optional: Show a success message
      console.log('Employee updated successfully from modal:', updatedEmployee);
      this.errorMessage = 'Employee updated successfully!'; // Use errorMessage for general messages too
      setTimeout(() => this.errorMessage = '', 3000); // Clear message after 3 seconds
    } else {
      console.log('Employee update cancelled or failed.');
    }
  }

  /**
   * Handles the deletion of an employee.
   * @param id The ID of the employee to delete.
   */
  deleteEmployee(id: number | undefined): void {
    if (id === undefined) {
      console.warn('Cannot delete employee: ID is undefined.');
      this.errorMessage = 'Cannot delete employee: ID missing.';
      return;
    }

    if (confirm('Are you sure you want to delete this employee?')) {
      this.errorMessage = ''; // Clear previous errors
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log(`Employee with ID ${id} deleted successfully.`);
          // Remove the deleted employee from the local array to update the UI immediately
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.errorMessage = 'Employee deleted successfully!';
          setTimeout(() => this.errorMessage = '', 3000); // Clear message after 3 seconds
        },
        error: (error: any) => {
          console.error(`Error deleting employee with ID ${id}:`, error);
          this.errorMessage = 'Failed to delete employee. Please try again.';
        }
      });
    }
  }
}
