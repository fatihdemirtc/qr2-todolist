using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;

namespace qr2.Controllers
{
    [Authorize(Roles = "admin")]
    public class AdminUsersController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminUsersController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IList<ApplicationUser> UsersInRole { get; set; }

        // GET: AdminUsers
        public async Task<IActionResult> Index()
        {
            UsersInRole = await _userManager.GetUsersInRoleAsync("User");
            return View(UsersInRole);
        }

    }
}
