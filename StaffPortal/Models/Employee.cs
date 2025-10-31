using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StaffPortal.Models;

public class Employee
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("position")]
    public string Position { get; set; } = string.Empty;

    [BsonElement("salary")]
    public double Salary { get; set; }

    [BsonElement("departmentId")]
    [BsonRepresentation(BsonType.ObjectId)] 
    public string DepartmentId { get; set; } = string.Empty;
}