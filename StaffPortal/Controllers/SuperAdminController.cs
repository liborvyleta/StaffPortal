using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;

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
        var requests = await _context.ContactRequests
            .Find(r => true)
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

        // Create Company
        var company = new Company
        {
            Name = request.CompanyName,
            CreatedAt = DateTime.UtcNow
        };
        await _context.Companies.InsertOneAsync(company);

        //  Create Admin User for this company
        var adminUser = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "Admin",
            CompanyId = company.Id
        };
        await _context.Users.InsertOneAsync(adminUser);

        // Mark request as processed
        var update = Builders<ContactRequest>.Update.Set("Status", "Approved");
        await _context.ContactRequests.UpdateOneAsync(r => r.Id == id, update);

        return Ok(new
        {
            message = $"Company '{company.Name}' approved successfully.",
            companyId = company.Id,
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
}