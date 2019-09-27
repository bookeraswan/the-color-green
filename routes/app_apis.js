 const express                 =  require("express"),
       router                  =  express.Router();

router.get("/isLoggedin", function(req, res){
    if(req.user) res.json(true)
    else return res.json(false)
})

module.exports = router;