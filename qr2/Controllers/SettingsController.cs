using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using qr2.Data;
using qr2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace qr2.Controllers
{
    [Authorize(Roles = "user")]
    public class SettingsController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public SettingsController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context; 
            _userManager = userManager;
        }

        // GET: Settings
        public async Task<IActionResult> Index()
        {
           return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(string OldPassword, string NewPassword, string ConfirmNewPassword)
        {
            if (string.IsNullOrWhiteSpace(OldPassword) || string.IsNullOrWhiteSpace(NewPassword))
            {
                ModelState.AddModelError("", "Please fill in all fields.");
                return View();
            }

            if (NewPassword != ConfirmNewPassword)
            {
                ModelState.AddModelError("confirmNewPassword", "New passwords do not match.");
                return View();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            var result = await _userManager.ChangePasswordAsync(user, OldPassword, NewPassword);

            if (result.Succeeded)
            {
                TempData["Success"] = "Your password was changed successfully.";
                return RedirectToAction("Index"); // veya Profile, Home, vs.
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return View();
        }

    }
}
