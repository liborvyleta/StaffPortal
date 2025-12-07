using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;

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

    // GET all global departments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // ZMĚNA: Vracíme všechna oddělení bez ohledu na firmu
        var departments = await _context.Departments.Find(_ => true).ToListAsync();
        return Ok(departments);
    }

    // POST create new department (Global)
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Department department)
    {
        if (string.IsNullOrWhiteSpace(department.Name))
            return BadRequest(new { message = "Název oddělení je povinný." });

        department.CompanyId = null; 

        await _context.Departments.InsertOneAsync(department);
        return Ok(department);
    }

    // DELETE department
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        // Poznámka: Mazání by měl dělat ideálně jen SuperAdmin, 
        // protože smazáním globálního oddělení ho smažete všem firmám.
        // Pro teď to necháme přístupné přihlášeným uživatelům.
        
        var result = await _context.Departments.DeleteOneAsync(d => d.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "Oddělení smazáno" });
    }
}