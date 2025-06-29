using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Enum;
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

        public async Task<IActionResult> Index()
        {
            var productList = await _context.Products
                .ToListAsync();

            return View(productList);
        }

        // GET: /Product/Edit/{id}
        public async Task<IActionResult> Edit(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return View(product);
        }

        // POST: /Product/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(ProductType ProductType)
        {
            Product newProduct = new Product();

            var random = new Random();
            int number1;
            do
            {
                number1 = new Random().Next(10000000, 100000000);
            } while (_context.Products.Any(x => x.ProductNo == number1));

            var random2 = new Random();
            int number2 = random.Next(10000000, 100000000);

            newProduct.ProductNo = number1;
            newProduct.ProductPassword = number2.ToString();
            newProduct.ProductType = ProductType;

            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();

            return Json(new
            {
                success = true,
                productNumber = number1,
                message = $"Product has been added successfully with product number: {number1}"
            });
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
