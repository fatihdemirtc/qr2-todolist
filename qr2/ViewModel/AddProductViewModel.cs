using System.ComponentModel.DataAnnotations;

namespace qr2.ViewModel
{
    public class AddProductViewModel
    {
        [Required]
        public int ProductNo { get; set; }

        [Required]
        public string ProductPassword { get; set; }

        [Required]
        public short ProductType { get; set; }

    }
}
