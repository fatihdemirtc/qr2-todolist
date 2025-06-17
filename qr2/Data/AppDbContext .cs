using Microsoft.EntityFrameworkCore;
using qr2.Models;

namespace qr2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
