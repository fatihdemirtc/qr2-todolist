using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using System.Text;

namespace qr2.Controllers
{
    public class ScanController : Controller
    {
        private readonly AppDbContext _context;

        public ScanController( AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            long id = 0;
            string idStr = Request.Query["productId"];
            long.TryParse(idStr, out id);

            Product a = _context.Products.FirstOrDefault(x => x.ProductNo == id);
            if(a == null)
            {
                return View("Error", new ErrorViewModel { RequestId = "Product not found" });
            }
            switch (a.QrType)
            {
                case 1:
                    var bytes = Encoding.UTF8.GetBytes(a.QrContext.ToString());
                    return File(bytes, "text/vcard", "contact.vcf");                   
                case 2:
                    if (a != null)
                    {
                        return RedirectToAction("Index", "Home", new { productId = a.ProductNo });
                    }
                    break;
                default:
                    break;
            }

            return View();
        }
    }
}
