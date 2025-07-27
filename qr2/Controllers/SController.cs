using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
    public class SController : Controller
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "c880a64ef2ef97b32bd154fc8810dea6";
        private readonly AppDbContext _context;

        public SController(AppDbContext context, HttpClient httpClient)

        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<IActionResult> I()
        {
            long id = 0;
            string idStr = Request.Query["no"];
            long.TryParse(idStr, out id);

            Product a = _context.Products.FirstOrDefault(x => x.ProductNo == id);
            if (a == null || string.IsNullOrEmpty(a.QrContext))
            {
                return Redirect("https://www.youtube.com/shorts/LWSNgcvlEYQ");
            }
            var ipAddress = HttpContext.Connection.RemoteIpAddress;
            string ipStr = ipAddress switch
            {
                { AddressFamily: System.Net.Sockets.AddressFamily.InterNetwork } => ipAddress.ToString(), // IPv4
                { AddressFamily: System.Net.Sockets.AddressFamily.InterNetworkV6 } => ipAddress.IsIPv4MappedToIPv6
                    ? ipAddress.MapToIPv4().ToString()
                    : ipAddress.ToString(), // gerçek IPv6
                _ => "Unknown"
            };

            Scan scan = new Scan()
            {
                ProductId = a.RecId,
                ScannedAt = DateTime.UtcNow,
                IpAddress = ipStr,
            };

            GetBrowserandOS(scan, Request);

            //ipden lokasyon bilgisi al
            var url = $"https://api.ipapi.com/api/{ipStr}?access_key={ApiKey}";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "ipapi servisi başarısız");

            var content = await response.Content.ReadAsStringAsync();
            Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(content);

            scan.Location = myDeserializedClass.city ?? "Unknown City"; //esenyurt
            scan.Country = myDeserializedClass.country_name ?? "Unknown Country";
            scan.City = myDeserializedClass.region_name ?? "Unknown City";

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

            if (os.Contains("Windows") || os.Contains("windows"))
            {
                scan.ScannedDevice = Enum.ScannedDeviceType.Windows;
            }
            else if (os.Contains("Mac") || os.Contains("mac"))
            {
                scan.ScannedDevice = Enum.ScannedDeviceType.Mac;
            }
            else if (os.Contains("Linux") || os.Contains("linux"))
            {
                scan.ScannedDevice = Enum.ScannedDeviceType.Linux;
            }
            else if (os.Contains("Android") || os.Contains("android"))
            {
                scan.ScannedDevice = Enum.ScannedDeviceType.Android;
            }
            else if (os.Contains("iOS") || os.Contains("ios"))
            {
                scan.ScannedDevice = Enum.ScannedDeviceType.iOS;
            }

            scan.Browser = browser;

            Console.WriteLine($"Browserx: {browser}, OSx: {os}");

        }


    }

   
    public class Language
    {
        public string code { get; set; }
        public string name { get; set; }
        public string native { get; set; }
    }

    public class Location
    {
        public int? geoname_id { get; set; }
        public string capital { get; set; }
        public List<Language> languages { get; set; }
        public string country_flag { get; set; }
        public string country_flag_emoji { get; set; }
        public string country_flag_emoji_unicode { get; set; }
        public string calling_code { get; set; }
        public bool? is_eu { get; set; }
    }

    public class Root
    {
        public string ip { get; set; }
        public string type { get; set; }
        public string continent_code { get; set; }
        public string continent_name { get; set; }
        public string country_code { get; set; }
        public string country_name { get; set; }
        public string region_code { get; set; }
        public string region_name { get; set; }
        public string city { get; set; }
        public string zip { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public object msa { get; set; }
        public object dma { get; set; }
        public string radius { get; set; }
        public string ip_routing_type { get; set; }
        public string connection_type { get; set; }
        public Location location { get; set; }
    }


}