using MongoDB.Driver;
using StaffPortal.Models;

namespace StaffPortal.Data;

public class MongoContext
{
    private readonly IMongoDatabase _db;

    public MongoContext(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        _db = client.GetDatabase(config["MongoDB:DatabaseName"]);
        
        // Inicializace indexů
        CreateIndexes();
    }

    public IMongoCollection<Employee> Employees => _db.GetCollection<Employee>("Employees");
    public IMongoCollection<Department> Departments => _db.GetCollection<Department>("Departments");
    public IMongoCollection<User> Users => _db.GetCollection<User>("Users");
    public IMongoCollection<Company> Companies => _db.GetCollection<Company>("Companies");
    public IMongoCollection<ContactRequest> ContactRequests => _db.GetCollection<ContactRequest>("ContactRequests");

    private void CreateIndexes()
    {
        // Unikátní email pro uživatele
        var emailIndex = Builders<User>.IndexKeys.Ascending(u => u.Email);
        Users.Indexes.CreateOne(new CreateIndexModel<User>(emailIndex, new CreateIndexOptions { Unique = true }));

        // Unikátní slug pro firmy
        var slugIndex = Builders<Company>.IndexKeys.Ascending(c => c.Slug);
        Companies.Indexes.CreateOne(new CreateIndexModel<Company>(slugIndex, new CreateIndexOptions { Unique = true }));
    }
}