var express = require("express"),
    app     = express();
    
    
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
   res.render("home"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("all seeds turn green"); 
});