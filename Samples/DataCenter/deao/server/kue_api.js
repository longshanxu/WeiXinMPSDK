var kue = require('kue');

var kueconfig = require('./kueconfig');

var queue = kue.createQueue(kueconfig);

module.exports.doQueue = function doQueue(newQueue, data) {
    var job = queue
        .create(newQueue, data)
        .priority('normal')
        .attempts(5)
        .save(function (error) {
            if (!error) 
                console.log(queue.id);
               // callback(job.id);
            }
        );
        
}

module.exports.delayReQueue = function delayReQueue(newQueue, delay, data,callback) {
    var job = queue
        .create(newQueue, data)
        .delay(delay)
        .save(function (error) {
            if (!error) 
                console.log(queue.id);
                callback(job.id);
            }
        );
    //job.promote();
    

}

module.exports.countJobsInQueue = function countJobsInQueue(kue, type, state, callback) {
    kue
        .Job
        .rangeByType(type, state, 0, -1, "asc", function (err, jobs) {
            if (err) 
                throw err;
            callback(jobs.length);
        });
}

module.exports.clearQueue = function clearQueue(kue, type, state) {
    kue
        .Job
        .rangeByType(type, state, 0, -1, "asc", function (err, jobs) {
            if (err) 
                throw err;
            jobs
                .forEach(function (job) {
                    job
                        .remove(function (err) {
                            if (err) 
                                console.dir(err);
                            else 
                                console.log("REMOVED: " + job.id);
                            }
                        );
                });
        });
}

//根据job的id，在队列中删除
module.exports.deleteQueueById = function deleteQueueById(id,type) {
    
    kue.Job.get(id,type,(err,job)=>{
        if (err) return;
        job.remove(function(err){
          if (err) throw err;
          console.log('removed completed job #%d', job.id);
        });
    })

}

//根据job的id，在队列中更新
module.exports.updateQueueById = function updateQueueById(id,type,data){
    kue.Job.get(id,type,(err,job)=>{
        console.log('xxxxxxxx',job);
        if(err) return ;
        //job.progress(id,1,data);
    });
}