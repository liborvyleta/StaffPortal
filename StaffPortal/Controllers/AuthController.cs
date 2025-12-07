using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using StaffPortal.Services;
using StaffPortal.DTOs;
using System.Security.Claims; 

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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username and password are required." });

        var exists = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
        if (exists != null)
            return Conflict(new { message = "User with this email already exists" });

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User" 
        };

        await _context.Users.InsertOneAsync(user);
        return Ok(new { message = "User registered successfully" });
    }
    
    [Authorize] // Pouze přihlášený uživatel
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        if (string.IsNullOrWhiteSpace(request.OldPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Musíte zadat staré i nové heslo." });

        // Získáme ID přihlášeného uživatele z tokenu
        var userId = User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub) 
                     ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) return NotFound(new { message = "Uživatel nenalezen." });

        // Ověření starého hesla
        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
        {
            return BadRequest(new { message = "Staré heslo není správné." });
        }

        // Zahashování a uložení nového hesla
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        
        await _context.Users.ReplaceOneAsync(u => u.Id == userId, user);

        return Ok(new { message = "Heslo bylo úspěšně změněno." });
    }
}