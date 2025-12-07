using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using StaffPortal.Services;
using StaffPortal.DTOs;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(MongoContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials." });

        var token = _tokenService.GenerateToken(user);

        // Získání slugu firmy
        string companySlug = "";
        if (!string.IsNullOrEmpty(user.CompanyId))
        {
            var company = await _context.Companies.Find(c => c.Id == user.CompanyId).FirstOrDefaultAsync();
            companySlug = company?.Slug ?? "";
        }

        return Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                role = user.Role,
                companySlug
            }
        });
    }
}