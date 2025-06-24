using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using qr2.ViewModel;

namespace qr2.Controllers
{
    [Authorize(Roles = "admin")]    
    public class AdminProductController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminProductController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: /Product/Add
        public IActionResult Add()
        {
            return View();
        }

       

        public async Task<IActionResult> MyProducts()
        {
            var userId = _userManager.GetUserId(User);
            var userProducts = await _context.UserProduct
                .Include(up => up.Product)
                .Where(up => up.UserId == userId)
                .Select(up => up.Product)
                .ToListAsync();

            return View(userProducts);
        }

        // GET: /Product/Edit/{id}
        public async Task<IActionResult> Edit(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return View(product);
        }

        // POST: /Product/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, EditProductViewModel updated)
        {
            if (id != updated.RecId) return BadRequest();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (!ModelState.IsValid) return View(updated);

            product.QrType = updated.QrType;
            product.QrContext = updated.QrContext;

            await _context.SaveChangesAsync();
            return RedirectToAction("MyProducts");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            return View(product);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return RedirectToAction("MyProducts");
        }
    }

}
