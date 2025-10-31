namespace StaffPortal.Models;

public class EmployeeWithDepartment : Employee
{
    public List<Department> Departments { get; set; } = new();
}