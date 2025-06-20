using System;
using System.ComponentModel.DataAnnotations;

namespace qr2.Models
{
    public class Product
    {
        [Key]
        public long RecId { get; set; }

        [Required]
        public int ProductType { get; set; }

        [Required]
        [Range(10000000, 99999999, ErrorMessage = "ProductNo must be 8 digits.")]
        public long ProductNo { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "Password must be 8 characters.")]
        public string ProductPassword { get; set; }

        
        [StringLength(250)]
        public string? QrContext { get; set; }

       
        public int? QrType { get; set; }

        public ICollection<UserProduct> UserProducts { get; set; }

        public ICollection<Scan> Scans { get; set; } = new List<Scan>();
    }
}
