using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using StaffPortal.DTOs;
using System.Security.Claims;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly MongoContext _context;

    public EmployeesController(MongoContext context)
    {
        _context = context;
    }

    // GET all (Bezpečný - platy jen pro admina)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companyId = User.FindFirst("companyId")?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Chybí identifikace firmy." });

        var result = await _context.Employees.Aggregate()
            .Match(e => e.CompanyId == companyId)
            .Lookup<Employee, Department, EmployeeWithDepartment>(
                _context.Departments,
                e => e.DepartmentId,
                d => d.Id,
                ewd => ewd.Departments
            )
            .ToListAsync();

        var response = result.Select(e => new
        {
            e.Id,
            e.FirstName,
            e.LastName,
            e.Position,
            // Plat pošleme JEN pokud je to Admin
            Salary = (userRole == "CompanyAdmin") ? e.Salary : 0, 
            e.Email,
            e.DepartmentId,
            DepartmentName = e.Departments.FirstOrDefault()?.Name ?? "—"
        });

        return Ok(response);
    }

    // GET Me (Můj profil - vidím svůj plat)
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null || string.IsNullOrEmpty(user.EmployeeId)) 
            return NotFound(new { message = "K tomuto účtu není přiřazen zaměstnanec." });

        // Najdeme zaměstnance podle ID z uživatele
        var employee = await _context.Employees.Aggregate()
            .Match(e => e.Id == user.EmployeeId)
            .Lookup<Employee, Department, EmployeeWithDepartment>(
                _context.Departments,
                e => e.DepartmentId,
                d => d.Id,
                ewd => ewd.Departments
            )
            .FirstOrDefaultAsync();

        if (employee == null) return NotFound();

        return Ok(new {
            employee.Id,
            employee.FirstName,
            employee.LastName,
            employee.Position,
            employee.Salary, // Zde plat vidím, je to můj profil
            employee.Email,
            DepartmentName = employee.Departments.FirstOrDefault()?.Name ?? "—"
        });
    }
    
    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        // ... (stejné jako předtím)
        var result = await _context.Employees.DeleteOneAsync(e => e.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return NoContent();
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateEmployeeDto request)
    {
         if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName) || 
            string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Jméno, příjmení, email a heslo jsou povinné." });

        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Chyba: Neznámá firma." });

        var existingUser = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
        if (existingUser != null) return Conflict(new { message = "Uživatel s tímto emailem již existuje." });

        var employee = new Employee
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Position = request.Position,
            Salary = request.Salary,
            Email = request.Email,
            CompanyId = companyId,
            DepartmentId = request.DepartmentId
        };
        await _context.Employees.InsertOneAsync(employee);

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User",
            CompanyId = companyId,
            EmployeeId = employee.Id
        };
        await _context.Users.InsertOneAsync(user);

        return Ok(new { message = "Zaměstnanec vytvořen.", employeeId = employee.Id });
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateEmployeeDto request)
    {
        // ... (stejné jako předtím)
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest();

        var existingEmployee = await _context.Employees
            .Find(e => e.Id == id && e.CompanyId == companyId)
            .FirstOrDefaultAsync();

        if (existingEmployee == null) return NotFound();

        existingEmployee.FirstName = request.FirstName;
        existingEmployee.LastName = request.LastName;
        existingEmployee.Position = request.Position;
        existingEmployee.Salary = request.Salary;
        existingEmployee.Email = request.Email;
        existingEmployee.DepartmentId = request.DepartmentId;
        
        await _context.Employees.ReplaceOneAsync(e => e.Id == id, existingEmployee);
        return Ok(existingEmployee);
    }
}