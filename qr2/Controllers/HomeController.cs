using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using System.Diagnostics;

namespace qr2.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            int id = 0; 
            string idStr = Request.Query["productId"];
            int.TryParse(idStr, out id);
            string a = _context.TodoItems.FirstOrDefault(x => x.Id == id)?.Title ?? "";

            if(string.IsNullOrEmpty(a))
            {
                var todos = _context.TodoItems.ToList();
                return View(todos);
            }
            return Redirect(a);            
        }

        [HttpPost]
        public IActionResult Add(string title)
        {
            if (!string.IsNullOrEmpty(title))
            {
                _context.TodoItems.Add(new TodoItem { Title = title, IsCompleted = false });
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        public IActionResult Complete(int id)
        {
            var todo = _context.TodoItems.Find(id);
            if (todo != null)
            {
                todo.IsCompleted = true;
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
