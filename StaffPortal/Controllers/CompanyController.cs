using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly MongoContext _context;

    public CompaniesController(MongoContext context)
    {
        _context = context;
    }

    // Odstraněna veřejná metoda RegisterCompany. 
    // Firmy vznikají POUZE schválením přes SuperAdminController.

    [HttpGet("{id}")]
    [Authorize] // Nyní chráněno
    public async Task<IActionResult> GetCompany(string id)
    {
        var company = await _context.Companies.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (company == null)
            return NotFound();
        return Ok(company);
    }
    
    // Endpoint pro získání firmy podle Slugu (pro frontend check)
    [HttpGet("by-slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var company = await _context.Companies.Find(c => c.Slug == slug).FirstOrDefaultAsync();
        if (company == null) return NotFound();
        return Ok(new { company.Name, company.Domain });
    }
}