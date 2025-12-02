using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StaffPortal.Models;

public class Employee
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    // ZMĚNA: Rozdělení jména
    [BsonElement("firstName")] public string FirstName { get; set; } = string.Empty;
    [BsonElement("lastName")] public string LastName { get; set; } = string.Empty;

    [BsonElement("position")] public string Position { get; set; } = string.Empty;

    [BsonElement("salary")] public double Salary { get; set; }

    [BsonElement("companyId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CompanyId { get; set; }

    [BsonElement("departmentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? DepartmentId { get; set; }

    [BsonElement("email")] public string Email { get; set; } = string.Empty;
}