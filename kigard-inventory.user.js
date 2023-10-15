// ==UserScript==
// @name		 Kigard Inventory
// @version	  0.1
// @description  Permet un meilleur usage de l'inventaire et des formules d'artisanat
// @author	   Fergal <ffeerrggaall@gmail.com>
// @match		https://tournoi.kigard.fr/*
// @icon		 https://tournoi.kigard.fr/images/items/37.gif
// @grant		none
// ==/UserScript==

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p');
const subp = urlParams.get('g');
const inv = urlParams.get('genre');

// variables saved locally
var v, t;
let mules_id = (v=localStorage.getItem("mules_id")) ? JSON.parse(v) : [];
let mules_name = (v=localStorage.getItem("mules_name")) ? JSON.parse(v) : [];
let myskin = (v=localStorage.getItem("myskin")) ? v : "images/vue/pj/HumainF.gif";

let ts_te = (t=localStorage.getItem("Tenue_ts")) ? (new Date()).getTime() - t : null;
let ts_eq = (t=localStorage.getItem("Equipement_ts")) ? (new Date()).getTime() - t : null;
let ts_co = (t=localStorage.getItem("Consommable_ts")) ? (new Date()).getTime() - t : null;
let ts_re = (t=localStorage.getItem("Ressource_ts")) ? (new Date()).getTime() - t : null;




var id_equip = [1,2,7,8,9,10,11,14,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,32,33,
				34,39,47,48,49,51,52,53,54,55,56,57,58,59,60,62,64,74,75,76,77,78,
				79,80,81,82,83,84,85,86,87,91,92,93,95,98,100,101,102,103,104,105,
				106,107,108,109,110,111,114,115,116,117,118,119,121,122,123,124,
				125,126,127,129,136,137,138,140,141,146,147,148,149,150,151,
				152,155,156,157,160,161,162,163,166,167,168,177,181,182,183,184,
				185,186,188,189,190,191,192,193,194,195,196,197,198,199,200,
				203,204,205,206,207,212,216,224,225,226,227,228,229,230,231,232,233,
				236,237,239,241,242,243,244,245,246,249,250,252,256,257,260,261,267,
				268,269,270,271,275,284,285,286,287,289,290,291,292,294,296,297,
				306,307,308,309,311,312,313,316,317,318,319,326,327,328,329,331,333,
				334,335,336,337,344,350];

var id_conso = [3,4,15,26,36,38,40,41,42,43,44,45,46,61,63,96,97,113,131,153,154,159,
				164,165,178,179,180,208,211,213,214,215,217,218,219,221,222,253,258,259,
				272,273,277,278,279,280,281,282,303,304,305,330,339,340];

var id_resso = [5,6,12,13,35,65,66,67,68,69,70,71,72,73,89,90,112,
				142,143,144,145,171,172,173,174,175,176,187,209,210,220,223,254,255,262,
				274,276,283,293,295,298,299,300,301,302,310,314,315,338,341,342,343];

var id_left = [37,50,88,94,99,120,128,130,132,133,134,135,139,158,169,170,201,202,
				234,235,238,240,247,248,251,263,264,265,266,288,320,321,322,323,324,
				325,332,345,346,347,348,349,351,352,353,354,355,356,357,358,359,360,
				361,362,363,364,365,366,367,368,369,370];


changeMenu();

if (page == "empathie") {
	findMules();
	duplicateButtonEmpathie();
}

if (page == "vue"){
	saveSkin();
}

if(page == "formules") {
	improveFormulasPage();
}

if (page == 'InventaireComplet') {
	createInventoryPage();
}

if (page == "inventaire") {
	saveInventory(inv);
	addCopyButton( $("#bloc table:first"),"inventory");
}

if (page == "gestion_stock") {
	saveMulet(urlParams.get('id_monstre'));
	addCopyButton( $("#bloc table:first"),"inventory");
}



//---------------------------------------------------------------------------------------
// PART OF SCRIPT RUNNING FOR INVENTORY
//---------------------------------------------------------------------------------------

function saveInventory(inv) {
	
	if( inv==null ) inv = "Tenue";

	//---------------------------------------------
	// PROCESS LINE FROM ORIGINAL INVENTORY TABLES
	function processInventoryLine() {
		// if( $(this).find("td:contains('Capacité à équiper')").length>0 ) return;
		// remove first and last cells
		$(this).find("td:first").remove();
		if( $(this).find("td").length>1 ) $(this).find("td:last").remove();
		// reformat content
		let content = $(this).find("td").html().split("<br>");
		let html = "<span class='item_name'>";
		for (var i=0; i<content.length-1; i++) {
			html +=  content[i] + "<br>";
		}
		html += "</span><span class='item_descr'>" + content[content.length-1] + "</span>";
		$(this).find("td").html(html);
		let name = $(this).find("strong:first");
		let serti = $(name).find(".sertissage");
		let enchant = $(name).find(".enchantement");
		$(this).find("span.item_descr").attr("weight", $(this).find("td").html().split(" <i class=\"fa")[0].split(/[|(]+/).slice(-1)[0] );
		
		$(name).find(".sertissage").remove();
		$(name).find(".enchantement").remove();
		let item = $(name).text();
		let quali = "";
		if(item.includes("de maître")) {
			item = item.split("de maître")[0];
			quali = "de maître ";
		}
		else if (item.includes("de qualité")) {
			item = item.split("de qualité")[0];
			quali = "de qualité ";
		}
		$(name).text("")
			.append(enchant)
			.append( $("<span></span>").addClass("name").text(item) )
			.append( (quali!="") ? $("<span></span>").addClass("qualite").attr("style","color:#B18A17").text(quali) : null )
			.append(serti);
	}

	let lines = $("table:first tr").not(":contains('Capacité à équiper')").clone()
				.each(processInventoryLine)
				.attr("data-inv", (inv=="Tenue") ? "Equipement" : inv )
				.attr("data-place", (inv=="Tenue") ? "Tenue" : "Inventaire" )
				.append( $("<td></td>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
				.append( $("<td></td>").attr("style","text-align:center;").text( (inv=="Tenue") ? "Equipement" : inv ) )
				.append( $("<td></td>").attr("style","text-align:center;").append( $("<img>").attr("src", (inv=="Tenue") ? myskin : "images/items/169.gif") ));
	let extra_lines = null;
	if ( $("table:last")[0] != $("table:first")[0] ) {
		extra_lines = $("table:last tr").clone()
				.each(processInventoryLine)
				.attr("data-inv", "Equipement")
				.attr("data-place", "Tenue")
				.append( $("<td></td>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
				.append( $("<td></td>").attr("style","text-align:center;").text("Equipement") )
				.append( $("<td></td>").attr("style","opacity:0.4; text-align:center;").append( $("<img>").attr("src", myskin) ) );
	}

	$("<table ></table>")
		.append( $("<tbody id='temp'></tbody>").append(lines).append(extra_lines) )
		.insertAfter( $("table:last")[0] )
		// .hide();
	$("#temp tr").each( function() {
		$(this).find("td:nth-child(2)").text($(this).find("td:first span.item_descr").attr("weight"));
	});
	localStorage.setItem(inv, $("#temp").html());
	localStorage.setItem(inv+'_ts', (new Date()).getTime());
}

function saveMulet(mule) {

	function processMuleLine() {
		// remove first cell
		$(this).find("td:last").remove();
		// reformat content
		let content = $(this).find("td").html().split("<br>");
		let html = "<span class='item_name'>";
		for (var i=0; i<content.length-1; i++) {
			html +=  content[i] + "<br>";
		}
		html += "</span><span class='item_descr'>" + content[content.length-1] + "</span>";
		$(this).find("td").html(html);
		let name = $(this).find("strong:first");
		let serti = $(name).find(".sertissage");
		let enchant = $(name).find(".enchantement");
		$(this).find("span.item_descr").attr("weight", $(this).find("td").html().split(" <i class=\"fa")[0].split(/[|(]+/).slice(-1)[0] );
		
		$(name).find(".sertissage").remove();
		$(name).find(".enchantement").remove();
		let item = $(name).text();
		let quali = "";
		if(item.includes("de maître")) {
			item = item.split("de maître")[0];
			quali = "de maître ";
		}
		else if (item.includes("de qualité")) {
			item = item.split("de qualité")[0];
			quali = "de qualité ";
		}
		$(name).text("");
		$(name).append(enchant);
		$(name).append( $("<span></span>").addClass("name") );
		$(name).append( $("<span></span>").addClass("qualite").attr("style","color:#B18A17") );
		$(name).append(serti);
		$(this).find(".name").text(item);
		$(this).find(".qualite").text(quali);

		let icon = $(this).find("img:first").attr("src").split('items/')[1].split('.gif')[0];
		let inv = undefined
		if (id_equip.includes(~~icon)) inv = "Equipement";
		if (id_conso.includes(~~icon)) inv = "Consommable";
		if (id_resso.includes(~~icon)) inv = "Ressource";

		$(this).attr("data-inv", inv);
		$(this).append( $("<td></td>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
		$(this).append( $("<td></td>").attr("style","text-align:center;").text( inv ) );
		$(this).append( $("<td></td>").attr("style","text-align:center;").append( $("<img>").attr("src","images/vue/monstre/37.gif") ) );
	}

	let lines = $("table tbody tr td:first-child").parent().clone()
				.each(processMuleLine)
				.attr("data-place", mule);
	$("<table></table>")
		.append( $("<tbody id='temp'></tbody>").append(lines) )
		.insertAfter( $("table")[0] )
		// .hide();
	$("#temp tr").each( function() {
		$(this).find("td:nth-child(2)").text($(this).find("td:first span.item_descr").attr("weight"));
	});
	localStorage.setItem(mule, $("#temp").html());
	localStorage.setItem(mule+'_ts', (new Date()).getTime());
}

function createInventoryPage() {

	//---------------------------------------------
	// LOCAL FUNCTIONS
	function formatTime(time) {
		if(typeof(time)!="number") return -1;
		time /= 1000; // time in sec
		let list_divid = [60,60,24,7];
		let list_units = ['s','m','h','d','w'];
		var i = 0;
		while(i<list_divid.length){
			if(time/list_divid[i]<1) break;
			time = time/list_divid[i];
			i += 1;
		}
		return ""+Math.floor(time)+list_units[i];
	}

	function parseName(string) {
		switch(string) {
			case 'Équipements':
				return 'Equipement';
			case 'Consommables':
				return 'Consommable';
			case 'Ressources':
				return 'Ressource';
			case 'Tenue/Ceinture':
				return 'Tenue';
			default:
				return string;
		}
	}

	function linkCategory(string) {
		return $("<a/>").attr('href','#').attr('data-inv',parseName(string)).attr("class","sel").text(string);
	}

	function linkPlace(string) {
		return $("<a/>").attr('href','#').attr('data-place', (i=mules_name.indexOf(string))>-1 ? mules_id[i] : parseName(string)).attr("class","sel").text(string);
	}

	function imageItem(id) {
		return $("<img/>").attr("src","images/items/"+id+".gif").attr("class","item");
	}

	function imageMonstre(id) {
		return $("<img/>").attr("src","images/vue/monstre/"+id+".gif").attr("class","item");
	}

	var i;

	// remove everything on the page and add title
	$("#bloc").children("*").remove();
	$("#bloc").append( $("<h3/>").text("Inventaire complet") );
	$("#bloc").append( $("<p/>").attr("id","last_update").attr("style","font-style: italic; font-size: 0.8em")
		.text("Dernière visite - Tenue : " + formatTime(ts_te) + ", Equipements : " + formatTime(ts_eq) 
					+ ", Consommables : " + formatTime(ts_co) + ", Ressources : " + formatTime(ts_re) ) );
	for(i=0; i<mules_id.length; i++) {
		$("#last_update").text( $("#last_update").text() + ", " + mules_name[i] + " : " + formatTime((new Date()).getTime() - localStorage.getItem(mules_id[i]+"_ts")) )
	}
	//---------------------------------------------
	// ADD FILTER BLOCS
	$("<div/>").attr("class","filtres").attr("style","text-align:center;").attr("id","categories")
			.append( $("<blockquote/>").attr("class","bloc").append( $("<strong/>").text("Catégories") ).append( $("<br/>") ) )
			.appendTo( $("#bloc") );
	$("<div/>").attr("class","filtres").attr("style","text-align:center;").attr("id","places")
			.append( $("<blockquote/>").attr("class","bloc").append( $("<strong/>").text("Emplacements") ).append( $("<br/>") ) )
			.appendTo( $("#bloc") );

	//---------------------------------------------
	// DEFINE FILTERS
	// category filter
	let puce = $("<img/>").attr("src","images/interface/puce_small.gif")
	$("#categories > blockquote.bloc")
			.append( $("<a/>").attr("href","#").attr("data-inv","Tous").attr("style","font-weight: lighter; font-style: italic").append( $("<emph/>").text("Aucune") ) )
			.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageItem(74), linkCategory("Équipements")) )
			.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageItem(178), linkCategory("Consommables")) )
			.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageItem(5), linkCategory("Ressources")) );
	// place filter
	$("#places > blockquote.bloc")
			.append( $("<a/>").attr("href","#").attr("data-place","Tous").attr("style","font-weight: lighter; font-style: italic").append( $("<emph/>").text("Aucun") ) )
			.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageItem(169), linkPlace("Inventaire")) );
	for(i=0; i<mules_id.length; i++) {
		$("#places > blockquote.bloc")
			.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageMonstre(37), "&nbsp;", linkPlace(mules_name[i])) );
	}
	$("#places > blockquote.bloc").append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", $("<img>").attr("src", myskin).attr("class","item"), linkPlace("Tenue/Ceinture")) );

	// add click events to the filters entries
	$('a[data-inv]').click(selectInventoryCategory);
	$('a[data-place]').click(selectInventoryPlace);

	//---------------------------------------------
	// CREATE TABLE AND MERGE ENTRIES SAVED FROM OTHER PAGES
	$("<table/>").attr("id","inventory_table").attr("width","100%").append( $("<tbody/>") )
			.appendTo( $("#bloc") );
	$("#inventory_table > tbody").append( 
		$("<tr/>").attr("data-inv","fixe")
			.append( $("<td/>").attr("class","fonce").attr("width","700").text("tbd") )
			.append( $("<td/>").attr("class","fonce").attr("style","text-align:center;").text("Poids") )
			.append( $("<td/>").attr("class","fonce").attr("style","text-align:center;").text("Catégorie") )
			.append( $("<td/>").attr("class","fonce").attr("style","text-align:center;").text("Emplacement") ) );
	let page_to_show = ["Tenue","Equipement","Consommable","Ressource"];
	for(i=0; i<page_to_show.length; i++){
		let table = localStorage.getItem(page_to_show[i]);
		$("#inventory_table > tbody").append( table );
	}
	for(i=0; i<mules_id.length; i++){
		let table = localStorage.getItem(mules_id[i]);
		$("#inventory_table > tbody").append( table );
	}

	//---------------------------------------------
	// ADD BUTTONS TO THE PAGE
	// copy list button
	$("<br/>").appendTo( $("#bloc") );
	$("<div/>").attr("id","button_area").appendTo( $("#bloc") )
		.append( $("<span/>").append( $("<input/>").attr("id","copy_list").attr("type","button").val("Copier la liste") ) )
		.append( $("<span/>").append( $("<input/>").attr("id","group_entries").attr("type","button").val("Grouper les entrées similaires") ) );
	$("#copy_list").click(copyListInventory);
	$("#group_entries").click(toggleInventoryGrouping);
	
	//---------------------------------------------
	// ADD TABLE TO THE PAGE
	$("#inventory_table").appendTo( $("#bloc") );
	// apply filters and update table title line
	applyInventoryFilters();
	updateInventoryTableTitle();
	sortInventory();
}


function sortInventory() {

	// let new_tbody = document.createElement("tbody");
	// new_tbody.id = "sorted_table";
	// new_tbody.innerHTML = "";

	// let lines = $("table[id=inventory_table] > tbody > tr:visible").sort(function (a, b) {
		// return a.getElementsByTagName("strong")[0].innerText > b.getElementsByTagName("strong")[0].innerText;
	// });

	// var tbody = $("#inventory_table").find("tbody")
	// var rows = tbody.children().detach().get();
	
	let rows = $("#inventory_table tr[data-inv!=fixe]").detach().get();

	rows.sort(function (a, b) {
		let inv_a = $(a).data("inv");
		let inv_b = $(b).data("inv");

		if ( inv_a == inv_b ) {
			let $a = $(a).find(".name").text().trim();
			let $b = $(b).find(".name").text().trim();
			return $a > $b;
		}
		else {
			if( inv_a == "Equipement" ) {
				return -1;
			}
			else if( inv_a == "Consommable" ) {
				if (inv_b == "Equipement") return 1;
				else return -1;
			}
			else {
				return 1;
			}
		}
	});

	// for( var i=0; i<lines.length; i++) {
		// new_tbody.innerHTML += lines[i].outerHTML;
	// }

	$("#inventory_table tr[data-inv=fixe]").after(rows);

	// let table = document.getElementById("inventory_table");
	// let tbody = table.getElementsByTagName("tbody")[0];
	// table.removeChild(tbody);
	// table.appendChild(new_tbody);
}




function selectInventoryCategory() {

	if($(this).data('inv')=='Tous'){
		if($(this).text()=='Toutes') {
			$('a[data-inv]').attr('class','sel');
			$('a[data-inv]').removeAttr('style');
			$(this).text('Aucune');
		}
		else {
			$('a[data-inv]').removeAttr('class');
			$('a[data-inv]').attr("style","opacity:0.4");
			$(this).text('Toutes');
		}


	}
	else {
		if($(this).attr('class')=='sel'){
			$(this).removeAttr('class');
			$(this).attr("style","opacity:0.4");
		}
		else {
			$(this).attr('class', 'sel');
			$(this).attr("style","");
		}
	}

	$('a[data-inv="Tous"]').removeAttr('class');
	$('a[data-inv="Tous"]').attr('style',"font-weight: lighter; font-style: italic");

	if($("a[data-inv][class=sel]").length>$("a[data-inv]").length/2) {
		$('a[data-inv="Tous"]').text("Aucune");
	}
	else {
		$('a[data-inv="Tous"]').text("Toutes");
	}

	console.log($(this).attr('class'));

	applyInventoryFilters();
	updateInventoryTableTitle();
	
	return false;

}


function selectInventoryPlace() {

	if($(this).data('place')=='Tous'){
		if($(this).text()=='Tous') {
			$('a[data-place]').attr('class','sel');
			$('a[data-place]').removeAttr('style');
			$(this).text('Aucun');
		}
		else {
			$('a[data-place]').removeAttr('class');
			$('a[data-place]').attr("style","opacity:0.4");
			$(this).text('Tous');
		}


	}
	else {
		if($(this).attr('class')=='sel'){
			$(this).removeAttr('class');
			$(this).attr("style","opacity:0.4");
		}
		else {
			$(this).attr('class', 'sel');
			$(this).attr("style","");
		}
	}

	$('a[data-place="Tous"]').removeAttr('class');
	$('a[data-place="Tous"]').attr('style',"font-weight: lighter; font-style: italic");

	if($("a[data-place][class=sel]").length>=$("a[data-place]").length/2) {
		$('a[data-place="Tous"]').text("Aucun");
	}
	else {
		$('a[data-place="Tous"]').text("Tous");
	}

	console.log($(this).attr('class'));

	applyInventoryFilters();
	updateInventoryTableTitle();
	
	return false;
}

function updateInventoryTableTitle() {
	
	$("span.weight").remove();
	let nombre = $("tr[data-place]:visible").length;
	let s = (nombre<2) ? "" : "s";
	let weight = 0;
	$("#inventory_table tr[data-place]:visible td:nth-child(2)").each( function() {
			weight += ~~$(this).text();
	});
	$("#inventory_table tr[data-inv=fixe] > td:first").text( (nombre==0) ? "Aucun item" : nombre + " item" + s )
		.append( $("<span/>").attr("class","weight")
				.append(" (", weight, " ", $("<i/>").addClass("fa-solid fa-weight-hanging"), ")" ) );
	$("#inventory_table tr[data-inv!=fixe] td").removeAttr("class");
	$("#inventory_table tr:visible:odd > td").attr("class","info_objet");
	$("#inventory_table tr:visible:odd > td").attr("class","info_objet clair");
	
	let page_to_show = ["Tenue","Equipement","Consommable","Ressource"];
	for (var i=0; i<page_to_show.length; i++) {
		let weight = 0
		$("#inventory_table tr[data-inv=" + page_to_show[i] + "]:visible td:nth-child(2)").each( function() {
			weight += ~~$(this).text();
		});
		$("a[data-inv="+page_to_show[i]+"]").after( 
			$("<span/>").attr("class","weight")
				.append(" (", weight, " ", $("<i/>").addClass("fa-solid fa-weight-hanging"), ")" ) );
	}
}


function applyInventoryFilters() {

	ungroupInventoryEntries();

	let selected_mules = [];
	$("a[data-place][class=sel]").each(function () {  selected_mules.push($(this).data('place')) });
	// selected_mules.push('Inventaire');
	let selected_categ = [];
	$("a[data-inv][class=sel]").each(function () {  selected_categ.push($(this).data('inv')) });

	// console.log(selected_categ);
	// console.log(selected_mules);

	$("#inventory_table tr[data-inv!=fixe][data-place!=fixe]").hide();
	// $("table:last").find("tr[data-inv=" + selected_categ + "][data-place=" + selected_mules + "]").show();

	$("#inventory_table tr[data-inv!=fixe][data-place!=fixe]").each( function () {
		if( ($.inArray($(this).data('inv'), selected_categ) != -1) && ($.inArray($(this).data('place'), selected_mules) != -1) ) {
			$(this).show();
		}
	});

	// sortInventory();

	$("#inventory_table td").removeClass("clair");
	$("#inventory_table tr[data-inv!=fixe]:visible:even > td").addClass("clair");
}

function toggleInventoryGrouping() {
	if ($("#group_entries").val() == "Grouper les entrées similaires") {
		groupInventoryEntries();
	}
	else {
		ungroupInventoryEntries();
	}
}

function groupInventoryEntries() {
	let list_entries = [];
	var i, item_name, item_count, item_line;
	var grouped_table = $("<table/>").attr("id","grouped_inventory_table").attr("width","100%")
							.append( $("<tbody/>").append( $("#inventory_table tr:first").clone() ) )
							.insertAfter( $("#inventory_table") );

	if ($("#group_entries").val() == "Grouper les entrées similaires") {
		
		$("#inventory_table tr:visible:has(.name)").each( function() {
			item_name = $(this).find(".name").text().trim();
			item_line = $("#grouped_inventory_table tr:contains("+item_name+")");
			if ( $(this).find("i.fa-solid").parent().html() ) {
				item_weight = ~~$(this).find("i.fa-solid").parent().html().split(' <i')[0].split(/[|(]+/).slice(-1)[0];
			}
			
			if ( item_line.length==1 ) {
				console.log(item_name + " already in list");
				let count = ~~$(item_line).find("span.item_count").text().split("x")[1] + 1;
				$(item_line).find("span.item_count").text(" x" + count);
			}
			else if ( item_line.length==0 ) {
				console.log(item_name + " added");
				$("#grouped_inventory_table > tbody")
					.append( $("<tr/>")
								.attr("data-inv",$(this).attr("data-inv"))
								.attr("data-place",$(this).attr("data-place"))
								.append( $(this).children("*").clone() ) );
				$("#grouped_inventory_table tr:last").find(".sertissage").remove();
				$("#grouped_inventory_table tr:last").find(".enchantement").remove();
				$("#grouped_inventory_table tr:last").find(".qualite").remove();
				$("#grouped_inventory_table tr:last").find(".item_descr").remove();
				$("#grouped_inventory_table tr:last").find("strong").append( $("<span/>").attr("class","item_count").text(" x1") )
				$("#grouped_inventory_table tr:last").find("strong").append( $("<span/>").attr("class","item_weight")
					.html( " (" + item_weight + " <i class='fa-solid fa-weight-hanging'></i>)" ) );
			}
			else {
				console.log("Ohohohohooooooo");
			}
			
			$("#inventory_table").after( $("#grouped_inventory_table") );
			
			// if( (i = list_entries.indexOf(item)) > -1 ) {
				// console.log(item + ' already in list in position ' + i);
				// // let name = $("tr:visible .name").eq(i).text().trim().split(' x')[0];
				// // let count = ~~$("tr:visible > td > strong:nth-child(2)").eq(i).text().trim().split(' x')[1];
				// if (count==0) count++;
				// $("tr:visible > td > strong:nth-child(2)").eq(i).text( name + ' x' + (count+1));
				// $("tr:visible > td > strong:nth-child(2)").eq(i).parent().parent().attr('grouped',true);
				// $(this).parent().parent().hide();
				// $(this).parent().parent().attr('grouped_hidden',true);

			// }
			// else {
				// list_entries.push(item_name);
				// console.log($(this).text().trim() + ' added');
				
			// }
		});
		$("#group_entries").val("Dégrouper les entrées similaires");
		
		// $(".item_descr").hide();
		// $(".qualite").hide();
		// $(".sertissage").hide();
		// $(".enchantement").hide();
		// $(".aide_popin").hide();
	}
}

function ungroupInventoryEntries() {
	if ($("#group_entries").val() == "Dégrouper les entrées similaires")  {
		
		// $(".item_descr").show();
		// $(".qualite").show();
		// $(".sertissage").show();
		// $(".enchantement").show();
		
		$("tr[grouped=true] > td > strong").each( function() {
			$(this).text( $(this).text().trim().split(' x')[0]);
		});
		$("tr[grouped=true]").removeAttr('grouped');
		$("tr[grouped_hidden=true]").show();
		$("tr[grouped_hidden=true]").removeAttr('grouped_hidden');
		$("#group_entries").val("Grouper les entrées similaires");
	}
}


function addGroupButton(table) {

	let parent = table.parentNode;
	let span = document.createElement("span");
	parent.insertBefore(span,table);

	// let button2 = '<input name="copy_list" type="button" value="Copier la liste">';
	let button = document.createElement("input");//, { name: "copy_list"; type: "button"; value: "Copier la liste" });
	button.id = "group_entries";
	button.type = "button";
	button.value = "Grouper les entrées similaires";
	
	$("<input/>").attr("id","group_entries").attr("type","button").val("Grouper les entrées similaires");

	span.appendChild(button);
	$("#group_entries").click(toggleInventoryGrouping);
}





// add some entries in the inventory menu
function changeMenu() {
	// one direct link till every mule
	for(j=0;j<mules_id.length;j++) {
		let name = mules_name[j];
		if(name=="Mulet") name += " " + mules_id[j];
		$("#menu a.parent:contains(Inventaire) ~ ul").append(
			$("<li/>").append(
				$("<a/>").attr("href","index.php?p=gestion_stock&id_monstre=" + mules_id[j])
					.append( $("<img/>").attr("src","images/vue/monstre/37.gif").attr("class","elements") )
					.append( " " + name  ) ) );
	}
	// one link to the complete inventory that will be built
	$("#menu a.parent:contains(Inventaire) ~ ul").append(
			$("<li/>").append(
				$("<a/>").attr("href","index.php?p=InventaireComplet")
					.append( $("<img/>").attr("src","images/items/37.gif").attr("class","elements") )
					.append( " Complet " ) ) );
}

// find all mules in the page empathie
function findMules() {
	mules_id = [];
	mules_name = [];

	$("img[title=Mulet]").parent().children("a").each( function() {
		mules_id.push( $(this).attr('href').split('id=')[1].split('&type')[0] );
		mules_name.push( $(this).text().trim() );
	});

	localStorage.setItem("mules_name",JSON.stringify(mules_name));
	localStorage.setItem("mules_id",JSON.stringify(mules_id));
}

// copy apply button directly after input fields
function duplicateButtonEmpathie() {
	$("input.pos:odd").after("&nbsp;&nbsp;",$("input[name=modif_suivant]:last").clone());
	$("img.po").after("&nbsp;&nbsp;",$("input[name=modif_suivant]:last").clone());
}

// copy list of items from inventory table
function copyListInventory() {
	navigator.clipboard.writeText($("tr:visible strong:nth-child(2)").clone().each(function(){$(this).text($(this).text()+'\n')}).text().trim());
}

//---------------------------------------------------------------------------------------
// PART OF SCRIPT RUNNING SOME EXTRAS
//---------------------------------------------------------------------------------------

function addCopyButton(table,type) {

	function createCheckbox(string) {
		return $("<span/>")
					.append("&nbsp;&nbsp;")
					.append( $("<input/>").attr("id","show_"+string).attr("type","checkbox") )
					.append("&nbsp;")
					.append( $("<label/>").attr("for","show_"+string).text(string) );
	}

	$("<br/>").insertBefore(table);
	$("<div/>").attr("id","copy_area")
				.append( $("<input/>").attr("id","copy_list").attr("type","button").val("Copier la liste") )
				.insertBefore(table);

	let list_boxes = ["Formule","Caracs","Difficulté","Métier","Bonus"];
	switch(type) {

		case 'inventory':
			$("#copy_list").click(copyListInventory);
			break;

		case 'formulas':
			for(var s=0; s<list_boxes.length; s++) {
				$("#copy_area").append( createCheckbox(list_boxes[s]) );
			}
			$("#copy_list").click(copyListFormulas);

		default:
	}
}

function saveSkin() {
	$(document).ready( function() {
		localStorage.setItem('myskin', $("div.description > img.vue").attr("src").replace("_cheval",""));
	});
}


//---------------------------------------------------------------------------------------
// PART OF SCRIPT RUNNING ON PAGE "FORMULES"
//---------------------------------------------------------------------------------------

function improveFormulasPage() {

	//---------------------------------------------
	// LOCAL FUNCTIONS
	function parseCategory(string) {
		switch(string) {
			case 'Tête':
				return 'tete';
			case 'Buste':
				return 'buste';
			case 'Pieds':
				return 'pieds';
			case 'Main droite':
				return 'main-droite';
			case 'Main gauche':
				return 'main-gauche';
			case 'Deux mains':
			case 'Deux mains d\'arc':
			case 'Deux mains de fusil':
				return 'deux-mains';
			case 'Toutes':
				return 'Tous';
			default:
				return 'autres';
		}
	}

	function linkCategory(string) {
		return $("<a/>").attr('href','#').attr('data-category',parseCategory(string)).text(string);
	}

	function linkDifficulty(percent) {
		if(percent=="Toutes") return $("<a/>").attr('href','#').attr('data-difficulty',"Tous").text("Toutes");
		else return $("<a/>").attr('href','#').attr('data-difficulty',String(percent)).text(percent+"%");
	}

	function imageCategory(id) {
		return $("<img/>").attr("src","images/items/"+id+".gif").attr("class","item");
	}


	//---------------------------------------------
	// ADD CATEGORY ATTRIBUTES TO EVERY LINE FOR FILTERING
	$("table:first").attr("id","formulas_table");
	$("#formulas_table small").each( function() {
		if( $(this).parent().prop("tagName")!='EM' ) {
			let value = $(this).text().split('-')[1].trim();
			$(this).parent().parent().attr('data-category', parseCategory(value));
		}
	});
	$("#formulas_table tr[data-metier!=fixe]").each( function() {
		if( $(this).attr('data-category') == null ) {
			$(this).attr('data-category','autres');
		}
	});

	//---------------------------------------------
	// UPDATE ORIGINAL FILTERS
	// split "formules" and "métiers" filters
	$("blockquote.bloc:first").clone().insertAfter($("blockquote.bloc:first"));
	let metiers = $("blockquote.bloc:first > a[data-formule=Realisables] ~ *").detach().get();
	$("blockquote.bloc:last > br:first ~ *").remove();
	$("blockquote.bloc:last > strong:first").text("Métiers");
	$("blockquote.bloc:last").append(metiers.slice(2));
	// remove existing click event for formule filter and add a new one, select Connues by default
	$("a[data-formule]").off("click").on("click", { filter: "formule"}, selectFormulaFilter);
	$('a[data-formule="Connues"]').attr("class", "sel");
	// remove existing click event for metier filter and add a new one, select Tous by default
	$("a[data-metier]").off("click").on("click", { filter: "metier"}, selectFormulaFilter);
	$('a[data-metier="Tous"]').attr("class", "sel");

	//---------------------------------------------
	// ADD CATEGORY FILTER
	// duplicate blockquote and change title
	$("blockquote.bloc:first").clone().insertAfter($("blockquote.bloc:last"));
	$("blockquote.bloc:last > br:first ~ *").remove();
	$("blockquote.bloc:last > strong:first").text("Catégories");
	// add puces, icons and filter links
	let puce = $("<img/>").attr("src","images/interface/puce_small.gif")
	$("blockquote.bloc:last")
		.append( linkCategory("Toutes") )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(7), linkCategory("Tête")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(48), linkCategory("Buste")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(8), linkCategory("Pieds")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(136), imageCategory(76), linkCategory("Main droite")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(2), imageCategory(24), linkCategory("Main gauche")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(122), imageCategory(17), linkCategory("Deux mains")) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", linkCategory("Autres")) );
	// add click event for category filter, select Tous by default
	$("a[data-category]").on("click", { filter: "category"}, selectFormulaFilter);
	$('a[data-category="Tous"]').attr("class", "sel");

	//---------------------------------------------
	// ADD DIFFICULTY FILTER
	// duplicate blockquote and change title
	$("blockquote.bloc:first").clone().insertAfter($("blockquote.bloc:last"));
	$("blockquote.bloc:last > br:first ~ *").remove();
	$("blockquote.bloc:last > strong:first").text("Difficulté");
	// add puces, icons and filter links
	$("blockquote.bloc:last")
		.append( linkDifficulty("Toutes") )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", linkDifficulty(0)) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", linkDifficulty(20)) )
		.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", linkDifficulty(40)) );
	// add click event for difficulty filter, select Tous by default
	$('a[data-difficulty]').on("click", { filter: "difficulty"}, selectFormulaFilter);
	$('a[data-difficulty="Tous"]').attr("class", "sel");

	//---------------------------------------------
	// ADD EXTRA FILTERS (COMPONENTS AND SEARCHBAR)
	// create new div and blockquote, append it to upper div
	$("div.filtres:first").after(
		$("<div/>").attr("style","text-align:center;").attr("class","filtres")
					.append( $("<blockquote/>").attr("id","extra-filters").attr("class","bloc") )
	);
	// Component filter
	$("blockquote.bloc:last").append( $("<strong/>").text("Filtrer par ingrédient") )
		.append( $("<div/>").attr("id","list-components").attr("class","filtres").attr("style","text-align:center;") );
	updateComponentFilter();

	// Searchbar
	$("blockquote.bloc:last").append( $("<strong/>").append( $("<span/>").attr("style","font-size: 1.2em; font-weight: bold; color: red").append("OU&nbsp;") )
													.append("par chaîne de caractères") )
		.append( $("<div/>").attr("id","search-bar").attr("style","text-align:center;").append( $("<input/>").attr("id","search").attr("type","text") ) );
	// add change event for searchbar
	$('#search').on("change", searchText);

	//---------------------------------------------
	// FINALIZE
	// update the title of the table with the number of selected formulas
	updateFormulasTableTitle();
	// add button and checkbox to copy the list with a choice of information
	addCopyButton($('#formulas_table'),"formulas");
}

function updateComponentFilter() {
	// get list of components used in displayed formulas
	let componentList = [];
	let componentListNames = [];
	$("tr[data-formule]:visible > td:last-child > img").each( function() {
		let ingr = $(this).attr("src").split("/items/")[1];
		let name = $(this).attr("alt");
		if ( !(componentList.includes(ingr)) ) {
			componentList.push(ingr);
			componentListNames.push(name);
		}
	});
	// update component filter accordingly
	$("#list-components > *").remove();
	$("#list-components").append( $("<a/>").attr("href","#").attr("data-comp","Tous").hide() );
	for(var i=0;i<componentList.length;i++) {
		$("#list-components")
			.append( $("<span/>")
						.append( $("<a/>").attr("href","#").attr("data-comp",componentList[i].split('.')[0])
									.append( $("<img/>").attr("src",'images/items/' + componentList[i]).attr("title",componentListNames[i]) ) ) );
	}
	// add click event for component filter, select Tous by default
	$("#list-components a[data-comp]").on("click", selectComponentFilter);
	$("#list-components a[data-comp=Tous]").attr("class", "sel");
}


// event when click on a filter
function selectFormulaFilter(event) {
	$('#search').val("");
	$("a[data-"+event.data.filter+"]").removeAttr("class");
	$(this).attr("class", "sel");
	$(document).ready( function() {
		applyFiltering()
		updateComponentFilter();
	});
	return false;
}

// event when click on Component filter
function selectComponentFilter() {
	$("#search").val("");
	let prev = $("a[data-comp][class=sel]").data("comp");
	let comp = $(this).data("comp");
	$("a[data-comp]").removeAttr("class");
	$("a[data-comp] > img").removeAttr("style");

	applyFiltering();
	if (comp==prev) {
		$("a[data-comp=Tous]").attr("class", "sel");
		return false;
	}
	else {
		$(this).attr("class", "sel");
		$("a[data-comp]").not("[class=sel]").children("img").attr("style","opacity:0.4");
		$("td:last-child").not(":has([src*='items/"+comp+".gif'])").parent("[data-formule]:visible").hide();
		updateFormulasTableTitle()
		return false;
	}
}


function searchText() {
	let tex = $("#search").val() ;
	$(document).ready( function() {
		applyFiltering();
		updateComponentFilter();
		$("tr[data-formule]:visible:not(:contains('"+tex+"'))").hide();
		updateFormulasTableTitle()
	});
	return false;
}


function applyFiltering() {//formule,metier,cat,diff,comp) {
	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff = $('a[data-difficulty][class="sel"]').data('difficulty');

	$('tr[data-formule]').show();
	if (formule != 'Connues') {
		$('tr[data-formule="Connues"]').hide();
	}
	if (metier != 'Tous') {
		$('tr:not([data-metier*=' + metier + '])').hide();
	}
	if (cat != 'Tous') {
		$('tr:not([data-category*=' + cat + '])').hide();
	}
	if (diff != 'Tous') {
		// $('td:nth-child(2):not(:contains("' + diff + '"))').parent().hide();
		$('td:nth-child(2)').filter(function() {
			return $(this).text() !== diff+'%';
		}).parent('[data-formule]').hide();
	}

	$('tr[data-metier=fixe]').show();
	updateFormulasTableTitle()
}

function updateFormulasTableTitle() {
	let nombre = $("tr[data-formule]:visible").length;
	let s = (nombre<2) ? "" : "s";

	$("#formulas_table tr[data-metier=fixe] > td:first").text( (nombre==0) ? "Aucune formule" : nombre + " formule" + s);
	$("#formulas_table tr[data-metier!=fixe] td").removeAttr("class");
	$("#formulas_table tr:visible:odd > td").attr("class","info_objet");
	$("#formulas_table tr:visible:odd > td").attr("class","info_objet clair");
}

function copyListFormulas() {

	var i, j, m, p;

	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	var comp = $('a[data-comp][class="sel"]').data('comp');
	var comp_name = $('a[data-comp][class="sel"]').children("img").attr("title");
	var search = $('#search')[0].value ;

	let show_formule = $("#show_Formule").prop("checked");
	let show_caracs = $("#show_Caracs").prop("checked");
	let show_diff = $("#show_Difficulté").prop("checked");
	let show_metier = $("#show_Métier").prop("checked");
	let show_bonus = $("#show_Bonus").prop("checked");

	let category = ''
	for ( i=0;i<cat.split('-').length;i++) {
		category += cat.split('-')[i][0].toUpperCase();
		for ( j=1;j<cat.split('-')[i].length;j++) {
			category += cat.split('-')[i][j];
		}
		category += ' ';
	}

	let buffer = "";
	buffer += "Formules ";
	if(metier != 'Tous') buffer += metier;
	if(diff != 'Tous') buffer += " de difficulté " + diff + "%";
	if(cat != 'Tous') buffer += " pour les éléments de type " + category.trim();
	if(comp != 'Tous') buffer += " contenant l'ingrédient " + comp_name.trim();
	if(search) buffer += ' dont la description contient "' + search + '"';
	buffer += " :\n";

	let liste = $("tr[data-formule]:visible");
	for (i=0;i<liste.length;i++) {
		buffer += "- " + liste[i].getElementsByTagName("strong")[0].innerText;
		if(show_diff || show_metier) {
			buffer += " (";
			if(show_diff) {
				buffer += liste[i].getElementsByTagName("td")[1].innerText;
				if(show_metier) buffer += ', ';
			}
			if(show_metier) {
				let metiers = liste[i].getElementsByTagName("td")[2].getElementsByTagName('img');
				for ( m=0; m<metiers.length; m++) {
					buffer += metiers[m].title;
					if(m<metiers.length-1) buffer += '/';
				}
			}
			buffer += ")";
		}

		// buffer += " (" + liste[i].getElementsByTagName("td")[1].innerText + "):";
		let components = liste[i].getElementsByTagName("td")[3].getElementsByTagName("img");
		let quantity = liste[i].getElementsByTagName("td")[3].innerText.split('x');
		if(show_formule) {
			buffer += " :";
			for (j=0;j<components.length;j++) {
				buffer += " " + quantity[j] + "x " + components[j].alt;
			}
		}
		buffer += "\n";
		if(show_caracs) {
			let line2 = liste[i].getElementsByTagName("td")[0].innerText.split('\n')[1];
			let caracs = line2.split(' )')[0];
			let place = line2.split(' )')[1];
			buffer += caracs.slice(0,-1)+"Poids "+caracs.slice(-1) +")";
			buffer += place;
		}
		let line3 = liste[i].getElementsByTagName("td")[0].innerText.split('\n')[2];
		if(show_bonus && line3 != undefined) {
			let parts = line3.split(" : ");
			buffer += " " + parts[0] + " : ";
			for (p=1;p<parts.length;p++) {
				buffer += parts[p] + " ";
			}
		}
		if( show_caracs || (show_bonus && line3 != undefined) ) buffer += "\n";
	}

	navigator.clipboard.writeText(buffer);
}