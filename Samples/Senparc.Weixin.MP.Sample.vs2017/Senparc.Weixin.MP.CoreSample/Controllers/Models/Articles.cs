using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Senparc.Weixin.MP.CoreSample.Controllers.Models
{
    public class Articles
    {
        public string ID { set; get; }
        public string UpdateTime { set; get; }
        public string CreateTime { set; get; }

        public string Image { set; get; }

        public string CommentCount { set; get; }
        public string Content { set; get; }
        public string LikeCount { set; get; }
        public string ShareCount { set; get; }
        public string Title { set; get; }
    }
}
