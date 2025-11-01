using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StaffPortal.Models;

public class ContactRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("companyName")] public string CompanyName { get; set; } = string.Empty;

    [BsonElement("email")] public string Email { get; set; } = string.Empty;

    [BsonElement("message")] public string Message { get; set; } = string.Empty;

    [BsonElement("submittedAt")] public DateTime SubmittedAt { get; set; }

    [BsonElement("status")] public string Status { get; set; } = "Pending";
}