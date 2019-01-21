using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Parse;
using Senparc.Weixin.MP.CoreSample.Controllers.Models;

namespace Senparc.Weixin.MP.CoreSample.Controllers
{
    public class ParseController : Controller
    {
        [HttpGet]
        [ActionName("Index")]
        public ActionResult Index()
        {
            return Content("OK!");
        }

        [HttpGet]
        [ActionName("GetBanner")]
        public async Task<ActionResult> GetBanner()
        {
            // or using LINQ
            var query = ParseObject.GetQuery("Banner");

            IEnumerable<ParseObject> results = await query.FindAsync();

            List<Banner> list = new List<Banner>();

            foreach (ParseObject item in results)
            {
                Banner banner = new Banner();
                banner.ID = item.ObjectId;
                banner.UpdateTime = item.UpdatedAt.ToString();
                banner.CreateTime = item.CreatedAt.ToString();
                banner.Image = item["image"].ToString(); ;

                list.Add(banner);
            }

            return Json(list);
        }


        [HttpGet]
        [ActionName("GetArticles")]
        public async Task<ActionResult> GetArticles()
        {
            // or using LINQ
            var query = ParseObject.GetQuery("Articles");

            IEnumerable<ParseObject> results = await query.FindAsync();

            List<Articles> list = new List<Articles>();

            foreach (ParseObject item in results)
            {
                Articles articles = new Articles();
                articles.ID = item.ObjectId;
                articles.UpdateTime = item.UpdatedAt.ToString();
                articles.CreateTime = item.CreatedAt.ToString();
                articles.Image = item["image"].ToString();
                articles.CommentCount = item["commentCount"].ToString();
                articles.Content = item["content"].ToString();
                articles.LikeCount = item["likeCount"].ToString();
                articles.ShareCount = item["shareCount"].ToString();
                articles.Title = item["title"].ToString();

                list.Add(articles);
            }

            return Json(list);
        }


        [HttpGet]
        [ActionName("GetArticlesByID")]
        public async Task<ActionResult> GetArticlesByID(string id)
        {
            // or using LINQ
            var query = ParseObject.GetQuery("Articles").WhereEqualTo("objectId", id);

            ParseObject results = await query.FirstOrDefaultAsync();

            Articles articles = new Articles();

            if (results != null) {

                articles.ID = results.ObjectId;
                articles.UpdateTime = results.UpdatedAt.ToString();
                articles.CreateTime = results.CreatedAt.ToString();
                articles.Image = results["image"].ToString();
                articles.CommentCount = results["commentCount"].ToString();
                articles.Content = results["content"].ToString();
                articles.LikeCount = results["likeCount"].ToString();
                articles.ShareCount = results["shareCount"].ToString();
                articles.Title = results["title"].ToString();
            }

            return Json(articles);
        }



        [HttpGet]
        [ActionName("Cpu")]
        public async Task<ActionResult> CpuResult(string id)
        {
            IDictionary<string, object> dictionary = new Dictionary<string, object>();
            dictionary.Add("id", "201809097001");
            var a= await ParseCloud.CallFunctionAsync<object>("cpu2", dictionary);
            return Json(a);

        }
    }
}