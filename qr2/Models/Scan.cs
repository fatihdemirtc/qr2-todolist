using qr2.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qr2.Models
{
    public class Scan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }

        public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

        [StringLength(250)]
        public string? Location { get; set; }  // şehir vs. 

        [StringLength(250)]
        public string? IpAddress { get; set; }  // IP

        [StringLength(100)]
        [Required]
        public ScannedDeviceType? ScannedDevice { get; set; } //OS

        [StringLength(100)]
        public string? Browser { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        public string? Notes { get; set; } // Notlar (isteğe bağlı)
    }
}
