using qr2.Models;

namespace qr2.ViewModel
{
    public class ProductViewModel
    {
        public AddProductViewModel? AddProduct { get; set; }
        public IEnumerable<Product>? Products { get; set; }
    }
}
