using System.ComponentModel.DataAnnotations;

namespace qr2.ViewModel
{
    public class AddProductViewModel
    {
        [Required]
        public string ProductNo { get; set; }

        [Required]
        public string ProductPassword { get; set; }

        [Required]
        public string ProductType { get; set; }

    }
}
