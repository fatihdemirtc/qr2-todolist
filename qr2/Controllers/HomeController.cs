using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using qr2.ViewModel;
using System.Diagnostics;

namespace qr2.Controllers
{
    [Authorize(Roles = "user")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public HomeController(ILogger<HomeController> logger, AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            var userId = _userManager.GetUserId(User);
            var userProducts = await _context.UserProduct
                .Include(up => up.Product)
                .Where(up => up.UserId == userId)
                .Select(up => up.Product)
                .ToListAsync();

            return View(new ProductViewModel { Products = userProducts });
        }

        public async Task<IActionResult> Detail(int id)
        {
            var detail = await _context.Products
                .Include(p => p.Scans)
                .Include(p => p.UserProducts)
                .ThenInclude(up => up.User)
                .FirstOrDefaultAsync(p => p.ProductNo == id);

            return View(new ProductDetailViewModel {
                ProductNo = detail.ProductNo, 
                ProductName = detail.ProductName,
                Platform = detail.Platform.ToString(), // Assuming Platform is an enum or int, convert it to string as needed
                QrContext = detail.QrContext,
            });
        }

        // POST: /Product/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(AddProductViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var userId = _userManager.GetUserId(User);

            // Ürün var mý?
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductNo == model.ProductNo && p.ProductPassword == model.ProductPassword);
            if (product == null)
            {
                return Json(new { success = false, error = "ProductionNotFound" });
            }

            // Kullanýcý bu ürünü daha önce eklemiþ mi?
            var exists = await _context.UserProduct
                .AnyAsync(up => up.UserId == userId && up.ProductId == product.RecId);

            //eklememiþ ise bu ürünü bu kullanýcýya da ata
            //kendisi eklemiþ ise bu ürünü bir daha ekleme
            //ayný ürünü birden fazla kiþi kullanabilsin
            if (!exists)
            {
                _context.UserProduct.Add(new UserProduct
                {
                    UserId = userId,
                    ProductId = product.RecId
                });
                var a = await _context.SaveChangesAsync();
            }

            return Json(new { success = true, productNo = product.ProductNo });
        }

        // POST: /Product/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProduct(int ProductNo, string Platform, string QrContext)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, productNo = ProductNo });

            // Ürün var mý?
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductNo == ProductNo);

            if (product != null)
            {
                product.Platform = 1; //todo: gelen veriye göre güncellenecek
                product.QrType = 1; //URL TÝPÝ 1 
                product.QrContext = QrContext;
                await _context.SaveChangesAsync();
            }

            return Json(new { success = true, productNo = ProductNo });
        }

        //public IActionResult Complete(int id)
        //{
        //    var todo = _context.TodoItems.Find(id);
        //    if (todo != null)
        //    {
        //        todo.IsCompleted = true;
        //        _context.SaveChanges();
        //    }
        //    return RedirectToAction("Index");
        //}

        //[HttpPost]
        //public IActionResult NewProduct(string title)
        //{
        //    if (!string.IsNullOrEmpty(title))
        //    {
        //        _context.TodoItems.Add(new TodoItem { Title = title, IsCompleted = false });
        //        _context.SaveChanges();
        //    }
        //    return RedirectToAction("Index");
        //}


        //public IActionResult Privacy()
        //{
        //    return View();
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
