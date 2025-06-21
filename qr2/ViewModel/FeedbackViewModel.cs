using System.ComponentModel.DataAnnotations;

namespace qr2.ViewModel
{
    public class FeedbackViewModel
    {
        [Required]
        [StringLength(1000)]
        public string Message { get; set; }
    }
}
