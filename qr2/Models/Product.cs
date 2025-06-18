using System.ComponentModel.DataAnnotations;

namespace qr2.Models
{
    public class Product
    {
        [Key]
        public int RecId { get; set; } // Primary Key
        public string ProductType { get; set; }
        public string ProductNo { get; set; }
        public string ProductPassword { get; set; }
        public string? QrType { get; set; }
        public string? QrContext { get; set; }

        public ICollection<UserProduct> UserProducts { get; set; }
    }
}
