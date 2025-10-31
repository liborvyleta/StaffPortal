using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly MongoContext _context;

    public EmployeesController(MongoContext context)
    {
        _context = context;
    }

    //  GET all employees
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _context.Employees.Aggregate()
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
            e.Name,
            e.Position,
            e.Salary,
            e.DepartmentId,
            DepartmentName = e.Departments.FirstOrDefault()?.Name ?? "(Unknown)"
        });

        return Ok(response);
    }

    //  GET one employee by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _context.Employees.Aggregate()
            .Match(e => e.Id == id)
            .Lookup<Employee, Department, EmployeeWithDepartment>(
                _context.Departments, 
                e => e.DepartmentId, 
                d => d.Id, 
                ewd => ewd.Departments 
            )
            .FirstOrDefaultAsync();

        if (result == null)
            return NotFound(new { message = $"Employee with id {id} not found" });

        var response = new
        {
            result.Id,
            result.Name,
            result.Position,
            result.Salary,
            result.DepartmentId,
            DepartmentName = result.Departments.FirstOrDefault()?.Name ?? "(Unknown)"
        };

        return Ok(response);
    }

    //  POST create new employee
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Employee employee)
    {
        if (string.IsNullOrWhiteSpace(employee.Name))
            return BadRequest(new { message = "Employee name is required" });

        await _context.Employees.InsertOneAsync(employee);
        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    //  PUT update existing employee
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Employee updatedEmployee)
    {
        var result = await _context.Employees.ReplaceOneAsync(e => e.Id == id, updatedEmployee);
        if (result.MatchedCount == 0)
            return NotFound(new { message = $"Employee with id {id} not found" });

        return Ok(updatedEmployee);
    }

    // DELETE employee
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _context.Employees.DeleteOneAsync(e => e.Id == id);
        if (result.DeletedCount == 0)
            return NotFound(new { message = $"Employee with id {id} not found" });

        return NoContent();
    }

    // SEARCH employees by text (name or position)
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return BadRequest(new { message = "Search text cannot be empty" });

        // MongoDB text filter (case-insensitive)
        var filter = Builders<Employee>.Filter.Or(
            Builders<Employee>.Filter.Regex(e => e.Name, new MongoDB.Bson.BsonRegularExpression(text, "i")),
            Builders<Employee>.Filter.Regex(e => e.Position, new MongoDB.Bson.BsonRegularExpression(text, "i"))
        );

        var employees = await _context.Employees.Find(filter).ToListAsync();
        return Ok(employees);
    }
}