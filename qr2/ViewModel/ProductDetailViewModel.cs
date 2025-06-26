using qr2.Enum;

namespace qr2.ViewModel
{
    public class ProductDetailViewModel
    {
        public string ProductName{ get; set; }
        public long ProductNo { get; set; }
        public PlatformType Platform { get; set; }
        public string QrContext { get; set; }

        public int TotalScans { get; set; }

        public int UniqueScans { get; set; }

        public List<DailyScanDto> DailyScans { get; set; }
    }
    public class DailyScanDto
    {
        public DateTime Date { get; set; }
        public int ScanCount { get; set; }
    }
}
