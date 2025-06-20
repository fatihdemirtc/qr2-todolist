using qr2.ViewModel;

namespace qr2.Models
{
    public class ProductViewModel
    {
        public AddProductViewModel? AddProduct { get; set; }
        public IEnumerable<Product>? Products { get; set; }
    }
}
