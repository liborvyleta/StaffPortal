using Microsoft.AspNetCore.Mvc;
using StaffPortal.Data;
using StaffPortal.Models;

namespace StaffPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly MongoContext _context;

    public ContactController(MongoContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SendRequest([FromBody] ContactRequest request)
    {
        request.SubmittedAt = DateTime.UtcNow;
        await _context.ContactRequests.InsertOneAsync(request);
        return Ok(new { message = "Request submitted successfully!" });
    }
}