using System.Collections.Generic;
using SportsStore.Domain.Entities;

namespace SportsStore.WebUI.Models
{
    public class ProductsListViewModel
    {
        public static IEnumerable<Product> products;

        public IEnumerable<Product> Products
        {
            get
            {
                return products;
            }
            set
            {
                products = value;
            }
        }
        public PagingInfo PagingInfo { get; set; }
        public string CurrentCategory { get; set; }
    }
}