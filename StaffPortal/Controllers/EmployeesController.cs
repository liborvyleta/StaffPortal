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

    // GET all (s názvem oddělení)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Chybí identifikace firmy." });

        // Agregace pro získání názvu oddělení (protože oddělení jsou v jiné kolekci)
        // Používáme $lookup pro propojení Employees s Departments
        var result = await _context.Employees.Aggregate()
            .Match(e => e.CompanyId == companyId)
            .Lookup("Departments", "departmentId", "_id", "Departments") // Propojení přes departmentId
            .As<EmployeeWithDepartment>() // Mapování do pomocné třídy (kterou už asi máte nebo si ji MongoDB Driver domyslí přes BsonExtraElements)
            .ToListAsync();

        // Mapování výsledku pro frontend do čistého JSONu
        var response = result.Select(e => new
        {
            e.Id,
            e.FirstName,
            e.LastName,
            e.Position,
            e.Salary,
            e.Email,
            e.DepartmentId,
            // Pokud má zaměstnanec přiřazené oddělení, vezmeme jeho název, jinak pomlčka
            DepartmentName = e.Departments.FirstOrDefault()?.Name ?? "—"
        });

        return Ok(response);
    }

    // GET by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var employee = await _context.Employees.Find(e => e.Id == id).FirstOrDefaultAsync();
        if (employee == null) return NotFound(new { message = $"Employee not found" });
        return Ok(employee);
    }

    // POST create (včetně user účtu a oddělení)
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

        // Vytvoření zaměstnance s DepartmentId
        var employee = new Employee
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Position = request.Position,
            Salary = request.Salary,
            Email = request.Email,
            CompanyId = companyId,
            DepartmentId = request.DepartmentId // Zde se ukládá ID oddělení vybrané ve formuláři
        };
        await _context.Employees.InsertOneAsync(employee);

        // Vytvoření uživatelského účtu pro přihlášení
        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User",
            CompanyId = companyId,
            EmployeeId = employee.Id
        };
        await _context.Users.InsertOneAsync(user);

        return Ok(new { message = "Zaměstnanec a účet vytvořen.", employeeId = employee.Id });
    }

    // PUT update (včetně změny oddělení)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateEmployeeDto request)
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Chybí identifikace firmy." });

        var existingEmployee = await _context.Employees
            .Find(e => e.Id == id && e.CompanyId == companyId)
            .FirstOrDefaultAsync();

        if (existingEmployee == null)
            return NotFound(new { message = "Zaměstnanec nenalezen." });

        // Aktualizace polí
        existingEmployee.FirstName = request.FirstName;
        existingEmployee.LastName = request.LastName;
        existingEmployee.Position = request.Position;
        existingEmployee.Salary = request.Salary;
        existingEmployee.Email = request.Email;
        existingEmployee.DepartmentId = request.DepartmentId; // Aktualizace oddělení
        
        await _context.Employees.ReplaceOneAsync(e => e.Id == id, existingEmployee);
        return Ok(existingEmployee);
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _context.Employees.DeleteOneAsync(e => e.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        
        // Smažeme i uživatelský účet, aby po smazání zaměstnance nezůstal "viset" login
        await _context.Users.DeleteOneAsync(u => u.EmployeeId == id);

        return NoContent();
    }

    // SEARCH
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return BadRequest();

        var companyId = User.FindFirst("companyId")?.Value;
        
        var filter = Builders<Employee>.Filter.And(
            Builders<Employee>.Filter.Eq(e => e.CompanyId, companyId),
            Builders<Employee>.Filter.Or(
                Builders<Employee>.Filter.Regex(e => e.FirstName, new BsonRegularExpression(text, "i")),
                Builders<Employee>.Filter.Regex(e => e.LastName, new BsonRegularExpression(text, "i")),
                Builders<Employee>.Filter.Regex(e => e.Position, new BsonRegularExpression(text, "i"))
            )
        );

        // I při hledání chceme vidět název oddělení
        var employees = await _context.Employees.Aggregate()
            .Match(filter)
            .Lookup("Departments", "departmentId", "_id", "Departments")
            .As<EmployeeWithDepartment>()
            .ToListAsync();

        var response = employees.Select(e => new
        {
            e.Id,
            e.FirstName,
            e.LastName,
            e.Position,
            e.Salary,
            e.Email,
            e.DepartmentId,
            DepartmentName = e.Departments.FirstOrDefault()?.Name ?? "—"
        });

        return Ok(response);
    }
}