using System.Linq;
using System.Web.Mvc;
using SportsStore.Domain.Abstract;
using SportsStore.Domain.Entities;
using SportsStore.WebUI.Models;

namespace SportsStore.WebUI.Controllers
{
    public class CartController : Controller
    {
        private IProductRepository repository;
        private IOrderProcessor orderProcessor;

        public CartController(IProductRepository repo, IOrderProcessor proc)
        {
            repository = repo;
            orderProcessor = proc;
        }

        public ViewResult Index(Cart cart, string returnUrl)
        {
            return View(new CartIndexViewModel
            {
                ReturnUrl = returnUrl,
                Cart = cart
            });
        }

        public JsonResult GetCartJson(Cart cart, string returnUrl)
        {
            return Json(cart.Lines, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddToCartJson(Cart cart, int Id, string returnUrl)
        {
            Product product = repository.Products
            .FirstOrDefault(p => p.Id == Id);
            if (product != null)
            {
                cart.AddItem(product, 1);
            }

            CartLine line = cart.Lines.FirstOrDefault(f => f.Product.Id == Id);

            return Json(line);
        }

        public JsonResult RemoveFromCartJson(Cart cart, int Id, string returnUrl)
        {
            Product product = repository.Products
            .FirstOrDefault(p => p.Id == Id);
            if (product != null)
            {
                cart.RemoveLine(product);
            }
            return Json(cart);
        }

        public PartialViewResult Summary(Cart cart)
        {
            return PartialView(cart);
        }

        public ViewResult Checkout()
        {
            return View(new ShippingDetails());
        }

        [HttpPost]
        public ViewResult Checkout(Cart cart, ShippingDetails shippingDetails)
        {
            if (cart.Lines.Count() == 0)
            {
                ModelState.AddModelError("", "Sorry, your cart is empty!");
            }
            if (ModelState.IsValid)
            {
                orderProcessor.ProcessOrder(cart, shippingDetails);
                cart.Clear();
                return View("Completed");
            }
            else
            {
                return View(shippingDetails);
            }
        }
    }
}