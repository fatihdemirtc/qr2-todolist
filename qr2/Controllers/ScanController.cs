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
                return Redirect("https://www.youtube.com/shorts/LWSNgcvlEYQ");
            }

            Console.WriteLine($"Scanned Product: {GetOS()}, Location: {GetBrowser()}, ip: { Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP" }");

            Scan scan = new Scan
            {
                ProductId = a.RecId,
                Location = "unknown",
                ScannedAt = DateTime.UtcNow,
                ScannedDevice = GetOS(),
                Browser = GetBrowser(),
                Notes = "",
                IpAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP"
            };
            _context.Scan.Add(scan);
            await _context.SaveChangesAsync();

            return Redirect(a.QrContext);
        }

        public int GetOS()
        {
            string userAgent = Request.Headers["User-Agent"];
            var ua = userAgent.ToLower();

            int os = 0;
            if (ua.Contains("windows")) os = 1;
            else if (ua.Contains("mac")) os = 2;
            else if (ua.Contains("linux")) os = 3;
            else if (ua.Contains("android")) os = 4;
            else if (ua.Contains("iphone")) os = 5;
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
    }
}