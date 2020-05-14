using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SportsStore.Domain.Concrete;
using SportsStore.Domain.Entities;
using SportsStore.Domain.Abstract;

namespace SportsStore.WebUI.Controllers.API
{
    public class ProductsController : ApiController
    {
        private IProductRepository repository;

        public ProductsController(IProductRepository repo)
        {
            repository = repo;
        }

        [HttpGet]
        public IEnumerable<Product> GetAll()
        {
            return repository.Products;
        }

        [HttpPut]
        [HttpPost]
        public IHttpActionResult Save(Product product)
        {                       
            if (ModelState.IsValid)
            {
                repository.SaveProduct(product);
                return Ok(product);
            }
            return BadRequest(ModelState);
        }

        [HttpDelete]
        public IHttpActionResult Remove(Product product)
        {
            if (product.Id == 0)
                return BadRequest();

            repository.DeleteProduct(product.Id);
            return Ok();
        }
    }
}