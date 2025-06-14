import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeserviceService } from '../service/EmployeeService/employeeservice.service';
// Adjust path

@Component({
  selector: 'app-employee-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit-modal.component.html',
  styleUrls: ['./employee-edit-modal.component.css']
})
export class EmployeeEditModalComponent implements OnInit {
  @Input() employee!: Employee; // The employee data passed from the parent list component
  @Output() closeModal = new EventEmitter<Employee | null>(); // Emits updated employee or null on cancel

  // Create a working copy of the employee data for the form
  // This prevents direct modification of the parent's data until saved
  employeeToEdit: Employee = {
    name: '',
    email: '',
    dob: '',
    joiningDate: '',
    department: '',
    position: ''
  };

  message: string = '';
  isSuccess: boolean = false;

  constructor(private employeeService: EmployeeserviceService) { }

  ngOnInit(): void {
    // Initialize employeeToEdit with the input employee's data
    // Use a deep copy if your object contains nested objects that could be modified
    this.employeeToEdit = { ...this.employee };
  }

  /**
   * Handles the form submission within the modal.
   * Calls the service to update the employee.
   */
  onSave(): void {
    this.message = ''; // Clear previous messages

    // Basic validation
    if (!this.employeeToEdit.name || !this.employeeToEdit.email || !this.employeeToEdit.department) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      return;
    }

    if (this.employeeToEdit.id === undefined) {
      this.message = 'Error: Employee ID is missing for update.';
      this.isSuccess = false;
      console.error('Attempted to update employee without an ID.');
      return;
    }

    this.employeeService.updateEmployee(this.employeeToEdit.id, this.employeeToEdit).subscribe({
      next: (responseEmployee: Employee) => {
        console.log('Employee updated successfully:', responseEmployee);
        this.message = `Employee "${responseEmployee.name}" updated successfully!`;
        this.isSuccess = true;
        // Emit the updated employee data back to the parent
        this.closeModal.emit(responseEmployee);
      },
      error: (error: any) => {
        console.error('Error updating employee:', error);
        this.message = 'Failed to update employee. Please try again.';
        this.isSuccess = false;
      }
    });
  }

  /**
   * Closes the modal without saving changes.
   */
  onCancel(): void {
    this.closeModal.emit(null); // Emit null to indicate cancellation
  }
}
