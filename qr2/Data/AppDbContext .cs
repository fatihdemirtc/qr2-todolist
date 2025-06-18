using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using qr2.Models;

namespace qr2.Data
{
    public class AppDbContext : IdentityDbContext
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProduct>()
                .HasKey(up => new { up.UserId, up.ProductId });

            builder.Entity<UserProduct>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserProducts)
                .HasForeignKey(up => up.UserId);

            builder.Entity<UserProduct>()
                .HasOne(up => up.Product)
                .WithMany(p => p.UserProducts)
                .HasForeignKey(up => up.ProductId);
        }
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<UserProduct> UserProduct { get; set; } = default!;
    }
}
