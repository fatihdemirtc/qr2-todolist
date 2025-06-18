using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using qr2.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace qr2.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: /Product/Add
        public IActionResult Add()
        {
            return View();
        }

        // POST: /Product/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(AddProductViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var userId = _userManager.GetUserId(User);

            // Ürün var mı?
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductNo == model.ProductNo && p.ProductPassword == model.ProductPassword);

            if (product == null)
            {
                // Yeni ürün ekleniyor
                product = new Product
                {
                    ProductNo = model.ProductNo,
                    ProductPassword = model.ProductPassword,
                    ProductType = model.ProductType
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }

            // Kullanıcı bu ürünü daha önce eklemiş mi?
            var exists = await _context.UserProduct
                .AnyAsync(up => up.UserId == userId && up.ProductId == product.RecId);

            if (!exists)
            {
                _context.UserProduct.Add(new UserProduct
                {
                    UserId = userId,
                    ProductId = product.RecId
                });
               var a = await _context.SaveChangesAsync();
            }

            return RedirectToAction("MyProducts");
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
        public async Task<IActionResult> Edit(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return View(product);
        }

        // POST: /Product/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, EditProductViewModel updated)
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
    }

}
