using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using System.Security.Claims;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly MongoContext _context;

    public DepartmentsController(MongoContext context)
    {
        _context = context;
    }

    // GET all departments for my company
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Chybí identifikace firmy." });

        var departments = await _context.Departments
            .Find(d => d.CompanyId == companyId)
            .ToListAsync();
        
        return Ok(departments);
    }

    // POST create new department
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Department department)
    {
        if (string.IsNullOrWhiteSpace(department.Name))
            return BadRequest(new { message = "Název oddělení je povinný." });

        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return BadRequest(new { message = "Neznámá firma." });

        department.CompanyId = companyId; // Přiřadíme firmu

        await _context.Departments.InsertOneAsync(department);
        return Ok(department);
    }

    // DELETE department
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _context.Departments.DeleteOneAsync(d => d.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "Oddělení smazáno" });
    }
}