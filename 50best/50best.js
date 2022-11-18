document.getElementById('title').addEventListener("click",function(){
	document.querySelectorAll('.fade').forEach(function(li){ li.classList.remove('fade'); });
});
document.querySelectorAll('.country').forEach(function(c){
	var cc = c.classList[1];
	c.parentNode.classList.add(cc);
	c.addEventListener("click",function(){
		document.querySelectorAll('li').forEach(function(li){ li.classList.add('fade'); });
		document.querySelectorAll('li.'+cc).forEach(function(li){ li.classList.remove('fade'); });
	});
});