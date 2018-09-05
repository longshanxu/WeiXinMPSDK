using Parse;
using System;
using System.Collections.Generic;

namespace ParseTools
{
    class Program
    {
        static void Main(string[] args)
        {

            ParseClient.Initialize(new ParseClient.Configuration
            {
                ApplicationId = "myAppId",
                WindowsKey = "mydotNetKey",

                // the serverURL of your hosted Parse Server
                Server = "http://www.jizuilv.cn:4666/parse/"
            });

            #region Banner

            string[] barnerurl = { "https://photo.tuchong.com/1076705/f/16093968.jpg", "http://oz126ti4w.bkt.clouddn.com/image/400083845.jpg", "http://xpic.588ku.com/figure/00/00/00/05/72/6955a1375fac1ac.jpg!/fw/800", "http://oz126ti4w.bkt.clouddn.com/image/149688_banner.jpg" };

            for (int i = 0; i < barnerurl.Length; i++)
            {

                ParseObject Banner = new ParseObject("Banner");

                Banner["image"] = barnerurl[i];

                Banner.SaveAsync();

            }
            #endregion

            #region 文章
            int commentCount = 0;
            string content = "<H1>测试内容</H1>";
            string image = "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-12-21_5a3b66c4e3c92.jpg";
            int likeCount = 104;
            int shareCount = 0;
            string title = "2018年第一批蜂蜜空降上海";

            ParseObject Articles = new ParseObject("Articles");
            Articles["commentCount"] = commentCount;
            Articles["content"] = content;
            Articles["image"] = image;
            Articles["likeCount"] = likeCount;
            Articles["shareCount"] = shareCount;
            Articles["title"] = title;
            Articles.SaveAsync();
            #endregion

            Console.ReadLine();

        }
    }
}
