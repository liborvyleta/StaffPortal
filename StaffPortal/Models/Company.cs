using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StaffPortal.Models;

public class Company
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")] 
    public string Name { get; set; } = string.Empty;

    [BsonElement("slug")] 
    public string Slug { get; set; } = string.Empty;

    [BsonElement("email")] 
    public string Email { get; set; } = string.Empty;

    [BsonElement("createdBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CreatedBy { get; set; } 

    [BsonElement("domain")] 
    public string Domain { get; set; } = string.Empty;

    [BsonElement("createdAt")] 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}