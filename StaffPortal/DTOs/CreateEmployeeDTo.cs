namespace StaffPortal.DTOs;

public class CreateEmployeeDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public double Salary { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    
    // NOVÉ
    public string? DepartmentId { get; set; }
}