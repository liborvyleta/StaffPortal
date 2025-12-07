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

    // ==========================================
    // ČÁST 1: ŽÁDOSTI O REGISTRACI (Requests)
    // ==========================================

    // GET: /api/superadmin/requests
    [HttpGet("requests")]
    public async Task<IActionResult> GetPendingRequests()
    {
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
        // ZDE JE TA DŮLEŽITÁ FIXACE: EmployeeId = "superadmin001"
        var adminUser = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "CompanyAdmin",
            CompanyId = company.Id,
            EmployeeId = "superadmin001"
        };
        await _context.Users.InsertOneAsync(adminUser);

        // Označení žádosti jako schválené
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
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "Request rejected and deleted." });
    }


    // ==========================================
    // ČÁST 2: SPRÁVA FIREM A UŽIVATELŮ
    // ==========================================

    // GET: /api/superadmin/companies
    // Získá seznam všech schválených firem
    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies()
    {
        var companies = await _context.Companies
            .Find(_ => true)
            .SortByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(companies);
    }

    // GET: /api/superadmin/company/{companyId}/users
    // Získá uživatele konkrétní firmy
    [HttpGet("company/{companyId}/users")]
    public async Task<IActionResult> GetCompanyUsers(string companyId)
    {
        // Vracíme jen základní data, ne hesla
        var users = await _context.Users
            .Find(u => u.CompanyId == companyId)
            .Project(u => new
            {
                u.Id,
                u.Email,
                u.Role,
                u.EmployeeId
            })
            .ToListAsync();
        return Ok(users);
    }

    // POST: /api/superadmin/users/create
    // Přidá nového uživatele do existující firmy
    [HttpPost("users/create")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        // 1. Ověření, zda email již neexistuje
        var existing = await _context.Users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
        if (existing != null)
            return BadRequest(new { message = "Email již existuje." });

        // 2. Nastavení EmployeeId
        // Pokud je to Admin, dáme mu superadmin001, aby aplikace nepadala.
        // Pokud je to Employee, necháme null (bude si muset vytvořit profil, nebo ho vytvoříte později)
        string? employeeIdToSave = null;
        if (dto.Role == "CompanyAdmin")
        {
            employeeIdToSave = "superadmin001";
        }

        var newUser = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            CompanyId = dto.CompanyId,
            EmployeeId = employeeIdToSave
        };

        await _context.Users.InsertOneAsync(newUser);
        return Ok(new { message = "Uživatel úspěšně vytvořen." });
    }

    // DELETE: /api/superadmin/users/{id}
    // Smaže uživatele
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var result = await _context.Users.DeleteOneAsync(u => u.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "Uživatel smazán." });
    }

    private string GenerateSlug(string phrase)
    {
        string str = phrase.ToLower();
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", " ").Trim();
        str = Regex.Replace(str, @"\s", "-");
        return str;
    }

    // DELETE: /api/superadmin/companies/{id}
    [HttpDelete("companies/{id}")]
    public async Task<IActionResult> DeleteCompany(string id)
    {
        // 1. Nejprve smažeme všechny uživatele, kteří patří k této firmě
        // To zajistí, že nám nezůstanou žádná "mrtvá" data
        await _context.Users.DeleteManyAsync(u => u.CompanyId == id);

        // 2. Poté smažeme samotnou firmu
        var result = await _context.Companies.DeleteOneAsync(c => c.Id == id);

        if (result.DeletedCount == 0)
            return NotFound(new { message = "Firma nenalezena." });

        return Ok(new { message = "Firma a všichni její uživatelé byli smazáni." });
    }
}