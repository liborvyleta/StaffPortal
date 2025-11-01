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

    [HttpPost("register")]
    public async Task<IActionResult> RegisterCompany([FromBody] Company company)
    {
        company.CreatedAt = DateTime.UtcNow;
        await _context.Companies.InsertOneAsync(company);
        return Ok(company);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompany(string id)
    {
        var company = await _context.Companies.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (company == null)
            return NotFound();
        return Ok(company);
    }
}