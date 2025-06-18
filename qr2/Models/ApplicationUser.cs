using Microsoft.AspNetCore.Identity;

namespace qr2.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<UserProduct> UserProducts { get; set; }
    }
}
