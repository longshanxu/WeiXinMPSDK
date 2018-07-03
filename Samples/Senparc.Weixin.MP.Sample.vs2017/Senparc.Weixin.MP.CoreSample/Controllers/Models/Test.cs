using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Senparc.Weixin.MP.CoreSample.Controllers.Models
{
    public class TestGame
    {
        public string ID { set; get; }
        public string UpdateTime { set; get; }
        public string CreateTime { set; get; }

        public string Score { set; get; }
        public string Playername { set; get; }
    }
}
