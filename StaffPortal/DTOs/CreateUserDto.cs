public class CreateUserDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; } // "CompanyAdmin" nebo "Employee"
    public string CompanyId { get; set; }
}