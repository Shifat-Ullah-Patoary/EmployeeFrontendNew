import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number; 
  name: string;
  email: string;
  dob: string;
  joiningDate: string;
  department: string;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeserviceService {

  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  createEmployee(employee:Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getallEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  updateEmployee(id:number, employee:Employee):Observable<Employee>
  {
    
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
      
}
