using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;
using qr2.Data;
using qr2.Models;
using System.Net;
using System.Text;
using System.Text.Json;

namespace qr2.Controllers
{
    public class ScanController : Controller
    {
        private readonly AppDbContext _context;

        public ScanController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            long id = 0;
            string idStr = Request.Query["productId"];
            long.TryParse(idStr, out id);

            Product a = _context.Products.FirstOrDefault(x => x.ProductNo == id);
            if (a == null)
            {
                return View("Error", new ErrorViewModel { RequestId = "Product not found" });
            }

            Console.WriteLine($"Scanned Product: {GetOS()}, Location: {GetBrowser()}, ip: { Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP" }");



            Scan scan = new Scan
            {
                ProductId = a.RecId,
                Location = await GetCountry(),
                ScannedAt = DateTime.UtcNow,
                ScannedDevice = 1,
                Notes = ""
            };
            _context.Scan.Add(scan);
            await _context.SaveChangesAsync();

           

            return View();
        }

        public string GetOS()
        {
            string userAgent = Request.Headers["User-Agent"];
            var ua = userAgent.ToLower();

            string os = "Unknown OS";
            if (ua.Contains("windows")) os = "Windows";
            else if (ua.Contains("mac")) os = "Mac";
            else if (ua.Contains("linux")) os = "Linux";
            else if (ua.Contains("android")) os = "Android";
            else if (ua.Contains("iphone")) os = "iPhone";
            return os;
        }

        public string GetBrowser()
        {
            string ua = Request.Headers["User-Agent"];
            string browser = "Unknown Browser";
            if (ua.Contains("chrome")) browser = "Chrome";
            else if (ua.Contains("firefox")) browser = "Firefox";
            else if (ua.Contains("safari") && !ua.Contains("chrome")) browser = "Safari";
            else if (ua.Contains("edge")) browser = "Edge";
            return browser;
        }

        public async Task<string> GetCountry()
        {
            // Bu örnekte IP adresi üzerinden ülke bilgisi alınıyor.
            // Gerçek uygulamada bir IP geolocation servisi kullanmanız gerekebilir.
            string ip = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP";
            
            using var client = new HttpClient();
            var response = await client.GetStringAsync($"https://ipapi.co/{ip}/json/");
            dynamic locationInfo = JsonSerializer.Deserialize<dynamic>(response);

            string city = locationInfo["city"];
            string country = locationInfo["country_name"];

            Console.WriteLine($"IP: {ip}, City: {city}, Country: {country}");

            return country ?? "Unknown Country";
        }
    }
    public class LoginLog
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string IPAddress { get; set; }
        public string OS { get; set; }
        public string Browser { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}