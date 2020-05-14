using System.Linq;
using System.Web.Mvc;
using SportsStore.Domain.Abstract;
using SportsStore.Domain.Entities;
using System.Web;

namespace SportsStore.WebUI.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        private IProductRepository repository;

        public AdminController(IProductRepository repo)
        {
            repository = repo;
        }

        public ViewResult Index()
        {
            return View();
        }

        public JsonResult GetCategories()
        {
            return Json(repository.Products.Select(s => s.Category).Distinct().OrderBy(o => o), JsonRequestBehavior.AllowGet);
        }
    }
}