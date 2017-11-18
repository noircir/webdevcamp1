

function echo (str, num) {
    // for (var i=0; i<num; i++) {
        
    // }
    var arr = str.split('');
    arr.forEach(function(el) {
        console.log(el);
    });
}

echo("Echo!!!!", 10);
echo("Tater Tots", 3);