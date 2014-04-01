
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.list2 = function(req, res){
  res.send("    <div style='margin-top:20px;'>    	<a href='/'>index</a>    	<a href='/users'>users</a>    </div>");
};