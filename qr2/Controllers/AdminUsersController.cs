using Microsoft.AspNetCore.Authorization;
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

        public AdminUsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: AdminUsers
        public async Task<IActionResult> Index()
        {
            var appDbContext = _context.UserProduct.Include(u => u.Product).Include(u => u.User);
            return View(await appDbContext.ToListAsync());
        }

        // GET: AdminUsers/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userProduct = await _context.UserProduct
                .Include(u => u.Product)
                .Include(u => u.User)
                .FirstOrDefaultAsync(m => m.UserId == id);
            if (userProduct == null)
            {
                return NotFound();
            }

            return View(userProduct);
        }

        // GET: AdminUsers/Create
        public IActionResult Create()
        {
            ViewData["ProductId"] = new SelectList(_context.Products, "RecId", "ProductPassword");
            ViewData["UserId"] = new SelectList(_context.Set<ApplicationUser>(), "Id", "Id");
            return View();
        }

        // POST: AdminUsers/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("UserId,ProductId")] UserProduct userProduct)
        {
            if (ModelState.IsValid)
            {
                _context.Add(userProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ProductId"] = new SelectList(_context.Products, "RecId", "ProductPassword", userProduct.ProductId);
            ViewData["UserId"] = new SelectList(_context.Set<ApplicationUser>(), "Id", "Id", userProduct.UserId);
            return View(userProduct);
        }

        // GET: AdminUsers/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userProduct = await _context.UserProduct.FindAsync(id);
            if (userProduct == null)
            {
                return NotFound();
            }
            ViewData["ProductId"] = new SelectList(_context.Products, "RecId", "ProductPassword", userProduct.ProductId);
            ViewData["UserId"] = new SelectList(_context.Set<ApplicationUser>(), "Id", "Id", userProduct.UserId);
            return View(userProduct);
        }

        // POST: AdminUsers/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("UserId,ProductId")] UserProduct userProduct)
        {
            if (id != userProduct.UserId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(userProduct);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserProductExists(userProduct.UserId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["ProductId"] = new SelectList(_context.Products, "RecId", "ProductPassword", userProduct.ProductId);
            ViewData["UserId"] = new SelectList(_context.Set<ApplicationUser>(), "Id", "Id", userProduct.UserId);
            return View(userProduct);
        }

        // GET: AdminUsers/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userProduct = await _context.UserProduct
                .Include(u => u.Product)
                .Include(u => u.User)
                .FirstOrDefaultAsync(m => m.UserId == id);
            if (userProduct == null)
            {
                return NotFound();
            }

            return View(userProduct);
        }

        // POST: AdminUsers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var userProduct = await _context.UserProduct.FindAsync(id);
            if (userProduct != null)
            {
                _context.UserProduct.Remove(userProduct);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UserProductExists(string id)
        {
            return _context.UserProduct.Any(e => e.UserId == id);
        }
    }
}
