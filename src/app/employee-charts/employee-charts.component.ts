import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// ngx-charts Imports
import { NgxChartsModule } from '@swimlane/ngx-charts';
// --- REMOVED problematic imports for ColorScheme and Color ---
// import { ColorScheme, Color } from '@swimlane/ngx-charts'; // This line is REMOVED

// Your existing service and Employee interface
import { Employee, EmployeeserviceService } from '../service/EmployeeService/employeeservice.service';

@Component({
  selector: 'app-employee-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './employee-charts.component.html',
  styleUrls: ['./employee-charts.component.css']
})
export class EmployeeChartsComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string = '';

  // --- ngx-charts: Employees per Department (Vertical Bar Chart) ---
  ngxDeptBarChartData: any[] = [];
  ngxDeptBarView: [number, number] = [700, 400];
  // Cast to 'any' to bypass strict TypeScript checking for 'scheme' input
  ngxDeptBarColorScheme: any = { // Changed type to 'any'
    name: 'customDeptScheme',
    selectable: true,
    group: 'default',
    domain: ['#007bff'] // Single color for bars
  };
  ngxDeptBarChartOptions = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    xAxisLabel: 'Department',
    showYAxisLabel: true,
    yAxisLabel: 'Number of Employees',
    roundDomains: true,
    trimXAxisTicks: true,
    trimYAxisTicks: true,
    tooltipDisabled: false,
    animations: true,
  };

  // --- ngx-charts: Employees by Position (Pie Chart) ---
  ngxPositionPieChartData: any[] = [];
  ngxPositionPieView: [number, number] = [700, 400];
  // Cast to 'any' to bypass strict TypeScript checking for 'scheme' input
  ngxPositionPieColorScheme: any = { // Changed type to 'any'
    name: 'customPositionScheme',
    selectable: true,
    group: 'default',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#007bff', '#28a745', '#17a2b8', '#fd7e14', '#6f42c1'] // Variety of colors
  };
  ngxPositionPieChartOptions = {
    gradient: true,
    showLegend: true,
    showLabels: true,
    isDoughnut: false,
    arcWidth: 0.25,
    tooltipDisabled: false,
    animations: true,
  };

  constructor(private employeeService: EmployeeserviceService) { }

  ngOnInit(): void {
    this.loadEmployeesAndGenerateCharts();
  }

  loadEmployeesAndGenerateCharts(): void {
    this.errorMessage = '';
    this.employeeService.getallEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        console.log('Employees loaded for charts:', this.employees);
        if (this.employees.length > 0) {
            this.generateNgxDepartmentBarChartData();
            this.generateNgxPositionPieChartData();
        } else {
            this.errorMessage = 'No employee data available to generate charts.';
            this.ngxDeptBarChartData = [];
            this.ngxPositionPieChartData = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading employees for charts:', error);
        this.errorMessage = 'Failed to load employee data for charts.';
      }
    });
  }

  private generateNgxDepartmentBarChartData(): void {
    const departmentCounts: { [key: string]: number } = {};
    this.employees.forEach(emp => {
      const department = emp.department || 'Unknown';
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });

    this.ngxDeptBarChartData = Object.keys(departmentCounts).map(dept => ({
      name: dept,
      value: departmentCounts[dept]
    }));
    console.log('ngx-charts Department Bar Data:', this.ngxDeptBarChartData);
  }

  private generateNgxPositionPieChartData(): void {
    const positionCounts: { [key: string]: number } = {};
    this.employees.forEach(emp => {
      const position = emp.position || 'Unknown';
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });

    this.ngxPositionPieChartData = Object.keys(positionCounts).map(pos => ({
      name: pos,
      value: positionCounts[pos]
    }));
    console.log('ngx-charts Position Pie Data:', this.ngxPositionPieChartData);
  }

  onSelect(event: any): void {
    console.log('ngx-charts: Item selected', event);
  }
}
