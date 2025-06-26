using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;
using qr2.Data;
using qr2.Models;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using UAParser;

namespace qr2.Controllers
{
    public class ScanController : Controller
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "c880a64ef2ef97b32bd154fc8810dea6";
        private readonly AppDbContext _context;

        public ScanController(AppDbContext context, HttpClient httpClient)

        {
            _context = context;
            _httpClient = httpClient;
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
            var ipaddress = Request.HttpContext.Connection.RemoteIpAddress;

            Scan scan = new Scan()
            {
                ProductId = a.RecId,
                ScannedAt = DateTime.UtcNow,
                IpAddress = ipaddress.MapToIPv4().ToString() ?? "Unknown IP",
            };

            GetBrowserandOS(scan, Request);


            //ipden lokasyon bilgisi al
            var url = $"https://api.ipapi.com/api/{ipaddress.MapToIPv4().ToString()}?access_key={ApiKey}";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "ipapi servisi başarısız");

            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine(content);



            _context.Scan.Add(scan);
            await _context.SaveChangesAsync();

            return Redirect(a.QrContext);
        }

        private void GetBrowserandOS(Scan scan, HttpRequest request)
        {
            var userAgent = request.Headers["User-Agent"].ToString();
            var parser = Parser.GetDefault();
            ClientInfo c = parser.Parse(userAgent);

            string browser = $"{c.UA.Family} {c.UA.Major}";
            string os = $"{c.OS.Family} {c.OS.Major}";
            string device = c.Device.Family;

            Console.WriteLine($"Browserx: {browser}, OSx: {os}, Device: {device}");

            scan.Browser = browser;
            //scan.ScannedDevice = os; // OS olarak kaydediyoruz, isterseniz device da ekleyebilirsiniz
            scan.Browser = device;
        }


    }
}