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
    }

    public IMongoCollection<Employee> Employees => _db.GetCollection<Employee>("Employees");
    public IMongoCollection<Department> Departments => _db.GetCollection<Department>("Departments");
}