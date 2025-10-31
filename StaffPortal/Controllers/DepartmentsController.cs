using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly MongoContext _context;

    public DepartmentsController(MongoContext context)
    {
        _context = context;
    }

    // GET all departments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments.Find(_ => true).ToListAsync();
        return Ok(departments);
    }

    // GET department by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var department = await _context.Departments.Find(d => d.Id == id).FirstOrDefaultAsync();
        if (department == null)
            return NotFound(new { message = $"Department with id {id} not found" });
        return Ok(new { message = $"Department with id {id}" });
    }

    // POST create new department
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Department department)
    {
        if (string.IsNullOrWhiteSpace(department.Name))
            return BadRequest(new { message = "Department name is required" });

        await _context.Departments.InsertOneAsync(department);
        return CreatedAtAction(nameof(GetById), new { id = department.Id }, department);
    }

    // PUT update existing department
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Department updatedDepartment)
    {
        var result = await _context.Departments.ReplaceOneAsync(d => d.Id == id, updatedDepartment);
        if (result.MatchedCount == 0)
            return NotFound(new { message = $"Department with id {id} not found" });

        return Ok(new { message = $"Department with id {id} updated" });
    }

    // DELETE department
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _context.Departments.DeleteOneAsync(d => d.Id == id);
        if (result.DeletedCount == 0)
            return NotFound(new { message = $"Department with id {id} not found" });

        return Ok(new { message = $"Department with id {id} deleted successfully" });
    }
}