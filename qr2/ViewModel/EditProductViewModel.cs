using System.ComponentModel.DataAnnotations;

namespace qr2.ViewModel
{
    public class EditProductViewModel
    {
        [Required]
        public int RecId { get; set; } // Primary Key

        [Required]
        public short QrType { get; set; }

        [Required]
        public string QrContext { get; set; }

    }
}
