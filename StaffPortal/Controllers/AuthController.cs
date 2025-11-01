using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StaffPortal.Data;
using StaffPortal.Models;
using StaffPortal.Services;
using LoginRequest = StaffPortal.DTOs.LoginRequest;

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
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username and password are required." });

        var user = await _context.Users
            .Find(u => u.Email == request.Email)
            .FirstOrDefaultAsync();

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials." });

        var ok = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!ok)
            return Unauthorized(new { message = "Invalid credentials." });

        var token = _tokenService.GenerateToken(user);

        return Ok(new
        {
            token,
            user = new { user.Id, user.Email, user.Role }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username and password are required" });

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
}