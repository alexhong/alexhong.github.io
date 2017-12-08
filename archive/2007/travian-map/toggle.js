var isFull = 0;

function toggle() {
	if (isFull != 1) {
		var body = document.getElementsByTagName('body')[0];
		body.style.backgroundImage =  'url(\"grid-full.gif\")'; 
		document.getElementById('wrap').style.height = '200px';
		document.getElementById('wrap').style.left = '193px';
		document.getElementById('plot').style.marginLeft = '-195px';
		document.getElementById('y').style.height = '200px';
		document.getElementById('y').style.left = '-93px';
		var elements = new Array(); 
		elements = document.getElementsByTagName('li');
		for (i=0; i<elements.length; i++) {
			var left = (parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('left'))/5)+'px'
			elements[i].style.left = left;
			if (elements[i].parentNode.getAttribute('id') != 'x') elements[i].style.bottom = (parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('bottom'))/5)+'px';
			if ((elements[i].parentNode.getAttribute('id') == 'y') && ((parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('bottom'))%100) > 0) 
			 || (elements[i].parentNode.getAttribute('id') == 'x') && ((parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('left'))%100) > 0)
			 || (elements[i].parentNode.getAttribute('id') == 'x') && (parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('left')) < 0)) { 
				elements[i].style.display = 'none';
			}
		}
		var togglelink = document.getElementById('toggle').childNodes[0];
		togglelink.removeChild(togglelink.childNodes[0]);
		togglelink.appendChild(document.createTextNode('Zoom in'));
		isFull = 1;
	} else {
		var body = document.getElementsByTagName('body')[0];
		body.style.backgroundImage =  'url(\"grid.gif\")'; 
		document.getElementById('wrap').style.height = '2000px';
		document.getElementById('wrap').style.left = '293px';
		document.getElementById('plot').style.marginLeft = '-295px';
		document.getElementById('y').style.height = '2000px';
		document.getElementById('y').style.left = '-193px';
		var elements = new Array(); 
		elements = document.getElementsByTagName('li');
		for (i=0; i<elements.length; i++) {
			elements[i].style.display = 'block';
			elements[i].style.left = (parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('left'))*5)+'px';
			if (elements[i].parentNode.getAttribute('id') != 'x') elements[i].style.bottom = (parseInt(document.defaultView.getComputedStyle(elements[i],'').getPropertyValue('bottom'))*5)+'px';
		}
		var togglelink = document.getElementById('toggle').childNodes[0];
		togglelink.removeChild(togglelink.childNodes[0]);
		togglelink.appendChild(document.createTextNode('Zoom out'));
		isFull = 0;
	}
}