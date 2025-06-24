using Microsoft.AspNetCore.Identity;
using qr2.Models;

namespace qr2.Services
{
    public class IdentitySeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // 1. Roller oluştur
            string[] roles = { "admin", "user" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // 2. Admin kullanıcı oluştur
            string adminEmail = "fatih@fatih.com";
            string adminPassword = "Fatih.516";

            var existingUser = await userManager.FindByEmailAsync(adminEmail);
            if (existingUser == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "admin");
                    Console.WriteLine("Admin kullanıcı oluşturuldu.");
                }
                else
                {
                    Console.WriteLine("Admin oluşturulamadı: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                Console.WriteLine("Admin zaten var.");
            }
        }

    }
}
