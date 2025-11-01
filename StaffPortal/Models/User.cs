using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StaffPortal.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("email")] public string Email { get; set; } = string.Empty;

    [BsonElement("passwordHash")] public string PasswordHash { get; set; } = string.Empty;

    [BsonElement("role")] public string Role { get; set; } = "User"; // "Admin" | "User"

    [BsonElement("employeeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? EmployeeId { get; set; }

    [BsonElement("companyId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CompanyId { get; set; } = string.Empty;
}