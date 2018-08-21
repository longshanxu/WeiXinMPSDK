using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Parse;

namespace Senparc.Weixin.MP.CoreSample
{
    public class Program
    {
        public static void Main(string[] args)
        {

            ParseClient.Initialize(new ParseClient.Configuration
            {
                ApplicationId = "myAppId",
                WindowsKey = "mydotNetKey",

                // the serverURL of your hosted Parse Server
                Server = "http://www.jizuilv.cn:4666/parse/"
            });
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
