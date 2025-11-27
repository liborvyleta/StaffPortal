using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuperAdminController : ControllerBase
{
    private readonly MongoContext _context;

    public SuperAdminController(MongoContext context)
    {
        _context = context;
    }

    // GET: /api/superadmin/requests
    [HttpGet("requests")]
    public async Task<IActionResult> GetPendingRequests()
    {
        // ZMĚNA: Filtrujeme pouze žádosti se statusem "Pending"
        var requests = await _context.ContactRequests
            .Find(r => r.Status == "Pending") 
            .SortByDescending(r => r.SubmittedAt)
            .ToListAsync();

        return Ok(requests);
    }

    // POST: /api/superadmin/approve/{id}
    [HttpPost("approve/{id}")]
    public async Task<IActionResult> ApproveRequest(string id)
    {
        var request = await _context.ContactRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
            return NotFound(new { message = "Request not found" });

        // Generování slugu
        string slug = GenerateSlug(request.CompanyName);

        // Zkusíme získat ID přihlášeného admina
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Vytvoření firmy
        var company = new Company
        {
            Name = request.CompanyName,
            Slug = slug, 
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = adminId 
        };
        await _context.Companies.InsertOneAsync(company);

        // Vytvoření CompanyAdmina
        var adminUser = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "CompanyAdmin", 
            CompanyId = company.Id
        };
        await _context.Users.InsertOneAsync(adminUser);

        // Označení žádosti jako schválené
        var update = Builders<ContactRequest>.Update.Set("Status", "Approved");
        await _context.ContactRequests.UpdateOneAsync(r => r.Id == id, update);

        return Ok(new
        {
            message = $"Company '{company.Name}' approved successfully. Portal: /portal/{company.Slug}",
            companyId = company.Id,
            companySlug = company.Slug,
            adminUsername = adminUser.Email,
            tempPassword = "admin123"
        });
    }

    // DELETE: /api/superadmin/reject/{id}
    [HttpDelete("reject/{id}")]
    public async Task<IActionResult> RejectRequest(string id)
    {
        var result = await _context.ContactRequests.DeleteOneAsync(r => r.Id == id);
        if (result.DeletedCount == 0)
            return NotFound();

        return Ok(new { message = "Request rejected and deleted." });
    }

    private string GenerateSlug(string phrase)
    {
        string str = phrase.ToLower();
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", " ").Trim();
        str = Regex.Replace(str, @"\s", "-");
        return str;
    }
}