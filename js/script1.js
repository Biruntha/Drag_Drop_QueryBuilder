/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define init and show methods
var redipsInit = {},
	showContent,
	deleteItem,
	getContent;



// redips initialization
redipsInit = function () {
	var num = 0,			// number of successfully placed elements
		rd = REDIPS.drag;	// reference to the REDIPS.drag lib
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	//rd.dropMode = 'single';
	rd.only.div.tablename = 'from';
	rd.only.div.Column = 's';
	rd.only.div.Column = 's';
	rd.only.div.Column = 's';
	rd.only.div.AND = 's';
	rd.only.div.OR = 's';
	//rd.only.other = 'deny';
	
	rd.event.cloned = function () {
		// define variables
		var clonedId = rd.obj.id; // cloned id
		// if cloned begins with 'a' or 'b' define dropping rule 'only' for last row
		if (clonedId.substr(0,9) === 'tablename') {   
			rd.only.div[clonedId] = 'from';
		}
		if (clonedId.substr(0,6) === 'Column') {   
			rd.only.div[clonedId] = 's';
		}
		if (clonedId.substr(0,3) === 'AND' || clonedId.substr(0,2) === 'OR') {   
			rd.only.div[clonedId] = 's';
		}
	};
	
	// call initially showContent
	showContent();
	
	// on each drop refresh content
	// call showContent() after DIV element is deleted
	rd.event.deleted = function () {
		showContent();
	};
	
	rd.event.dropped = function () {
		if(rd.td.target.id==="WHERE"){	
			if(rd.obj.id.indexOf("Column")!=-1){
				 var tr=document.getElementById(rd.obj.id).childNodes.length;
				if(tr===1){
					rd.obj.innerHTML=rd.obj.innerHTML+"<input id='txt' onchange='onChangeTest(this);' type='text' size=6 style='height:15px;'>";
				}
			}
		}if(rd.td.source.id==="WHERE" && (rd.td.target.id==="SELECT" || rd.td.target.id==="GROUPBY")){			
				var ii = document.getElementById(rd.obj.id);
				ii.removeChild(document.getElementById("txt"));				
		}if(rd.td.source.id==="SELECT"){
			rd.dropMode='Move';
			if((rd.td.target.id!="WHERE" && rd.td.target.id!="GROUPBY")){
				rd.obj.parentNode.removeChild(rd.obj);
			}
		}else if(rd.td.source.id==="WHERE"){
			rd.dropMode='Move';
			if(rd.td.target.id!="SELECT" && rd.td.target.id!="GROUPBY"){
				rd.obj.parentNode.removeChild(rd.obj);
			}
			/*else if(rd.td.target.id!="WHERE"){
				var ii1 = document.getElementById(rd.obj.id);
				ii1.removeChild(document.getElementById("txt"));	
				rd.obj.parentNode.removeChild(rd.obj);
			}*/
			
		}else if(rd.td.source.id==="GROUPBY"){
			rd.dropMode='Move';
			if((rd.td.target.id!="SELECT" && rd.td.target.id!="WHERE")){
				rd.obj.parentNode.removeChild(rd.obj);
			}
		}
				
		rd.obj.style.width='auto';
		rd.obj.style.display='inline-block';
		rd.obj.style.height='33px';
		showContent();
	};
};

function onChangeTest(changeVal) {
	showContent();
}

// show TD content
showContent = function () {

	// get content of TD cells in right table
	var td1 = getContent('SELECT'),
		td2 = getContent('FROM'),
		td3 = getContent('WHERE'),
		td4 = getContent('GROUPBY'),
		// set reference to the message DIV (below tables)
		message = document.getElementById('message');
	// show block content
	message.innerHTML = 'SELECT  ' + td1 + '<br>' +
						'FROM  ' + td2 + '<br>' +
						'WHERE  ' + td3 + '<br>' +
						'GROUPBY  ' + td4;
};

// get content (DIV elements in TD)
getContent = function (id) {
	var td = document.getElementById(id),
		content = '',
		cn, i,textcon,len;
	
	for (i = 0; i < td.childNodes.length; i++) {
		// set reference to the child node
		cn = td.childNodes[i];
		// childNode should be DIV with containing "drag" class name
		if (cn.nodeName === 'DIV' && cn.className.indexOf('drag') > -1) { // and yes, it should be uppercase				
			// append DIV id to the result string
			if(id==='SELECT'){
				content += cn.innerHTML;
				//content = content.substring(0, content.length - 5);
				content+=',';
			}
			if(id==='FROM'){
				content += cn.innerHTML;
				content+=',';
			}
			if(id==='WHERE'){
			textcon=document.getElementById(cn.id);
				if(cn.id.indexOf('AND')>-1 || cn.id.indexOf('OR')>-1)
				{
					content += cn.innerHTML;					
				}else{
					len=textcon.textContent.length;
					content += textcon.textContent.substring(0,len);
					content+='=';
					if(textcon.childNodes[1].value==="")content += "null";
					else content+=textcon.childNodes[1].value;
					content+=',';
					//content = content.substring(0, content.length - 2);
				}
			}
			if(id==='GROUPBY'){
				content += cn.innerHTML;
				content+=',';
			}
			//document.getElementById(cn.id).appendChild('<input type="text"></input>');
			//$('#'.).append('<input type="text"></input>');
		
		}
	}
	if(id==='SELECT' || id==='FROM' || id==='WHERE'){
		content = content.substring(0, content.length - 1);
	}
	// cut last '_' from string
	//content = content.substring(0, content.length - 1);
	// return result
	return content;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}
