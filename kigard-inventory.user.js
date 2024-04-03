// ==UserScript==
// @name		 Kigard Inventory
// @version	  1.1.0
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

var members = [];
var mypos = parsePositionPerso( $(".margin_position").text() );
var myname = $(".inline span[class!='margin_pa'] strong").text().split(" ")[0]


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

getNotifOnMobile();
changeMenu();

//dfdfldkfdjfldfjdlkjflk

if (page == "vue") {
	addMonsterIDs();
	addHideButton();
    parseMonsterLogs();
    //addGrid();
}

if (page == "empathie") {
	findMules();
	duplicateButtonEmpathie();
}

if (page == "profil"){
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
	var id = urlParams.get('id_monstre');
	saveMulet(id);
	addCopyButton( $("#bloc table:first"),"inventory");
	renameMuletPage(id);
}

if (page == "arene") {
	renameArenas();
	addMonsterIDs();
    parseMonsterLogs();
}

if (page == "clan" && subp == "membres") {
	var listNames = getNames();
	getPositions();
	localStorage.setItem("members",members);
	localStorage.setItem("fetched",1);
}


//---------------------------------------------------------------------------------------
// INVENTORY
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
		let html = "<span class='item_name'>" + content[0] + "</span><br><span class='item_descr'>";
		for (var i=1; i<content.length; i++) {
			html += content[i];
			if ( i<content.length-1 ) html += "<br/>";
		}
		html += "</span>";
		$(this).find("td").html(html);
		let name = $(this).find("strong:first");
		let serti = $(name).find(".sertissage");
		$(serti).text( " "+$(serti).text().trim() );
		let enchant = $(name).find(".enchantement");
		$(enchant).text( $(enchant).text().trim()+" " );
		let conso = $(name).find(".conso");
		$(conso).text( " "+$(conso).text().trim() );
		$(this).find("span.item_descr").attr("weight", $(this).find("td").html().split(" <i class=\"fa")[0].split(/[|(]+/).slice(-1)[0] );
		
		let textem = $(this).find("em");
		let title = "";
		if( $(textem).length>0 && $(textem).find("img").length==0 ) { // ignore statuts
			title = " "+$(textem).text().trim();
			$(textem).remove();
		}
		
		$(name).find(".sertissage").remove();
		$(name).find(".enchantement").remove();
		$(name).find(".conso").remove();
		let item = $(name).text().trim();
		let quali = (inv=="Equipement" || inv=="Tenue") ? $("<i/>").append(" ordinaire") : "";
		if(item.includes("de maître")) {
			item = item.split("de maître")[0].trim();
			quali = " de maître ";
		}
		else if (item.includes("de qualité")) {
			item = item.split("de qualité")[0].trim();
			quali = " de qualité ";
		}
		$(name).text("")
			.append( $(enchant).text()!="" ? enchant : null)
			.append( $("<span></span>").addClass("name").text(item) )
			.append( (quali!="") ? $("<span></span>").addClass("qualite").attr("style","color:#B18A17").append(quali) : null )
			.append( $(serti).text()!="" ? serti : null)
			.append( $(conso).text()!="" ? conso : null)
			.after( (title!="") ? $("<span></span>").addClass("title").attr("style","font-style:italic").append(title) : null );
	}
	
	var lines, extra_line;
	if ( $("table tbody td").length == 1 ) { //if table is empty there's only one cell
		lines = null; 
	}
	else {
		lines = $("table:first tr").not(":contains('Capacité à équiper')").clone()
					.each(processInventoryLine)
					.attr("data-inv", (inv=="Tenue") ? "Equipement" : inv )
					.attr("data-place", (inv=="Tenue") ? "Tenue" : "Inventaire" )
					.append( $("<td></td>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
					// .append( $("<td></td>").attr("style","text-align:center;").text( (inv=="Tenue") ? "Equipement" : inv ) )
					.append( $("<td></td>").attr("style","text-align:center;").append( $("<img>").attr("src", (inv=="Tenue") ? myskin : "images/items/169.gif") 
																									.attr("title", (inv=="Tenue") ? "Tenue" : "Inventaire")));
		extra_lines = null;
		if ( $("table:last")[0] != $("table:first")[0] ) {
			extra_lines = $("table:last tr").clone()
					.each(processInventoryLine)
					.attr("data-inv", "Equipement")
					.attr("data-place", "Ceinture")
					.append( $("<td></td>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
					// .append( $("<td></td>").attr("style","text-align:center;").text("Equipement") )
					.append( $("<td></td>").attr("style","opacity:0.4; text-align:center;").append( $("<img>").attr("src", myskin).attr("title","Ceinture") ) );
		}
	}
	$("<table ></table>")
		.append( $("<tbody id='temp'></tbody>").append(lines).append(extra_lines) )
		.insertAfter( $("table:last")[0] )
		.hide();
	$("#temp tr").each( function() {
		$(this).find("td:nth-child(2)").text($(this).find("td:first span.item_descr").attr("weight"));
	});
	localStorage.setItem(inv, $("#temp").html());
	localStorage.setItem(inv+'_ts', (new Date()).getTime());
}

function saveMulet(mule) {

	function processMuleLine() {
		
		let icon = $(this).find("img:first").attr("src").split('items/')[1].split('.gif')[0];
		let inv = undefined
		if (id_equip.includes(~~icon)) inv = "Equipement";
		if (id_conso.includes(~~icon)) inv = "Consommable";
		if (id_resso.includes(~~icon)) inv = "Ressource";
		
		// remove last cell
		$(this).find("td:last").remove();
		// reformat content
		let content = $(this).find("td").html().split("<br>");
		let html = "<span class='item_name'>" + content[0] + "</span><br><span class='item_descr'>";
		for (var i=1; i<content.length; i++) {
			html += content[i];
			if ( i<content.length-1 ) html += "<br/>";
		}
		html += "</span>";
		$(this).find("td").html(html);
		let name = $(this).find("strong:first");
		let serti = $(name).find(".sertissage");
		let enchant = $(name).find(".enchantement");
		$(enchant).text( $(enchant).text()+" " );
		let conso = $(name).find(".conso");
		$(this).find("span.item_descr").attr("weight", $(this).find("td").html().split(" <i class=\"fa")[0].split(/[|(]+/).slice(-1)[0] );
		
		let textem = $(this).find("em");
		let title = "";
		if( $(textem).length>0 && $(textem).find("img").length==0 ) { // ignore statuts
			title = " "+$(textem).text().trim();
			$(textem).remove();
		}		
		
		$(name).find(".sertissage").remove();
		$(name).find(".enchantement").remove();
		$(name).find(".conso").remove();
		let item = $(name).text().trim();
		let quali = (inv=="Equipement") ? $("<i/>").append(" ordinaire") : "";
		if(item.includes("de maître")) {
			item = item.split("de maître")[0].trim();
			quali = " de maître ";
		}
		else if (item.includes("de qualité")) {
			item = item.split("de qualité")[0].trim();
			quali = " de qualité ";
		}
		$(name).text("")
			.append( $(enchant).text()!="" ? enchant : null)
			.append( $("<span></span>").addClass("name").text(item) )
			.append( (quali!="") ? $("<span></span>").addClass("qualite").attr("style","color:#B18A17").append(quali) : null )
			.append( $(serti).text()!="" ? serti : null)
			.append( $(conso).text()!="" ? conso : null)
			.after( (title!="") ? $("<span></span>").addClass("title").attr("style","font-style:italic").append(title) : null );

		$(this).attr("data-inv", inv);
		$(this).append( $("<td/>").attr("style","text-align:center;").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
		// $(this).append( $("<td/>").attr("style","text-align:center;").text( inv ) );
		$(this).append( $("<td/>").attr("style","text-align:center;").append( $("<img/>").attr("src","images/vue/monstre/37.gif").attr("title", mules_name[mules_id.indexOf(mule)]) ) );
	}

	var lines;
	if ( $("table tbody td").length == 1 ) { //if table is empty there's only one cell
		lines = null; 
	}
	else {
		lines = $("table tbody tr td:first-child").parent().clone()
						.each(processMuleLine)
						.attr("data-place", mule);
	}
	$("<table></table>")
		.append( $("<tbody id='temp'></tbody>").append(lines) )
		.insertAfter( $("table")[0] )
		.hide();
	$("#temp tr").each( function() {
		$(this).find("td:nth-child(2)").text($(this).find("td:first span.item_descr").attr("weight"));
	});
	localStorage.setItem(mule, $("#temp").html());
	localStorage.setItem(mule+'_ts', (new Date()).getTime());
}


function renameMuletPage(id) {
	var name = mules_name[mules_id.indexOf(id)];
	if(name=="Mulet") name = id;
	$("h3").append(" "+name);
	
}

function createInventoryPage() {

	//---------------------------------------------
	// LOCAL FUNCTIONS
	function formatTime(time) {
		if(typeof(time)!="number") return "Jamais!";
		time /= 1000; // time in sec
		let list_divid = [60,60,24];
		let list_units = ['s','m','h','j'];
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
		return $("<a/>").attr('href','#').attr('data-inv',parseName(string)).attr("class","select").text(string);
	}

	function linkPlace(string) {
		return $("<a/>").attr('href','#').attr('data-place', (i=mules_name.indexOf(string))>-1 ? mules_id[i] : parseName(string)).attr("class","select").text(string);
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
	$('a[data-inv]').on("click",selectInventoryCategory);
	$('a[data-place]').on("click",selectInventoryPlace);

	//---------------------------------------------
	// CREATE TABLE AND MERGE ENTRIES SAVED FROM OTHER PAGES
	$("<table/>").attr("id","inventory_table").attr("width","100%").append( $("<tbody/>") )
			.appendTo( $("#bloc") );
	$("#inventory_table > tbody").append( 
		$("<tr/>").attr("data-inv","fixe")
			.append( $("<td/>").attr("class","fonce").attr("width","700").text("tbd") )
			.append( $("<td/>").attr("class","fonce").attr("style","text-align:center;").text("").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
			// .append( $("<td/>").attr("class","fonce").attr("style","text-align:center;").text("Catégorie") )
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
	$("#inventory_table span.qualite:contains(ordinaire)").hide();

	// Add table to the page
	$("#inventory_table").appendTo( $("#bloc") );
	// Apply filters and update table title line
	applyInventoryFilters();
	// sortInventory();

	//---------------------------------------------
	// ADD BUTTONS TO THE PAGE
	// copy list button
	$("<br/>").insertBefore( $("#inventory_table") );
	$("<div/>").attr("id","button_area").insertBefore( $("#inventory_table") )
		.append( $("<span/>").append( $("<input/>").attr("id","copy_list").attr("type","button").val("Copier la liste") ) , "&nbsp;")
		.append( $("<span/>").append( $("<input/>").attr("id","group_entries").attr("type","button").val("Grouper les entrées similaires") ) , "&nbsp;")
		.append( $("<span/>").append( $("<input/>").attr("id","show_details").attr("type","button").val("Montrer les détails").hide() ) , "&nbsp;");
	$("#copy_list").on("click", function () {
		navigator.clipboard.writeText($("tr:visible span.item_name").clone().each(function(){$(this).text($(this).text().trim()+'\n')}).text());
	});
	$("#group_entries").on("click", toggleInventoryGrouping);
	$("#show_details").on("click", toggleDetails);
}


function sortTableByName() {
	
	let c = $(this).find("span.sortByName").attr("type");
	
	$("span.sortByWeight").attr("type","none");
	$("span.sortByWeight i").attr("class","");
	$("span.sortByPlace").attr("type","none");
	$("span.sortByPlace i").attr("class","");
	
	if( c=="none" ) {
		$(this).find("span.sortByName").attr("type","asc");
		$(this).find("span.sortByName i").attr("class","fa fa-caret-up");
	}
	else if( c=="asc" ) {
		$(this).find("span.sortByName").attr("type","desc");
		$(this).find("span.sortByName i").attr("class","fa fa-caret-down");
	}
	else if( c=="desc" ) {
		$(this).find("span.sortByName").attr("type","none");
		$(this).find("span.sortByName i").attr("class","");
	}
	
	c = $(this).find("span.sortByName").attr("type");
	
	let rows = $("table:visible tr[data-inv!=fixe]:visible").detach().get();
	
	if( c=="none" ) {
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
	}
	else {
		rows.sort(function (a, b) {
			let $a = $(a).find(".name").text().trim();
			let $b = $(b).find(".name").text().trim();
			return $a > $b;
		});
		if( c=="desc" ) rows.reverse();
	}

	$("table:visible tr[data-inv=fixe]").after(rows);

	return false;
}

function sortTableByWeight() {
	
	let c = $(this).find("span.sortByWeight").attr("type");
	
	$("span.sortByName").attr("type","none");
	$("span.sortByName i").attr("class","");
	$("span.sortByPlace").attr("type","none");
	$("span.sortByPlace i").attr("class","");
	
	if( c=="none" ) {
		$(this).find("span.sortByWeight").attr("type","desc");
		$(this).find("span.sortByWeight i").attr("class","fa fa-caret-down");
	}
	else if( c=="desc" ) {
		$(this).find("span.sortByWeight").attr("type","asc");
		$(this).find("span.sortByWeight i").attr("class","fa fa-caret-up");
	}
	else if( c=="asc" ) {
		$(this).find("span.sortByWeight").attr("type","none");
		$(this).find("span.sortByWeight i").attr("class","");
	}
	
	c = $(this).find("span.sortByWeight").attr("type");
	
	let rows = $("table:visible tr[data-inv!=fixe]:visible").detach().get();
	
	if( c=="none" ) {
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
	}
	else {
		rows.sort(function (a, b) {
			let $a = $(a).find("td").eq(1).text().trim();
			let $b = $(b).find("td").eq(1).text().trim();
			return $a > $b;
		});
		if( c=="desc" ) rows.reverse();
	}

	$("table:visible tr[data-inv=fixe]").after(rows);

	return false;
}

function sortTableByPlace() {
	
	let c = $(this).find("span.sortByPlace").attr("type");

	$("span.sortByWeight").attr("type","none");
	$("span.sortByWeight i").attr("class","");
	$("span.sortByName").attr("type","none");
	$("span.sortByName i").attr("class","");

	if( c=="none" ) {
		$(this).find("span.sortByPlace").attr("type","asc");
		$(this).find("span.sortByPlace i").attr("class","fa fa-caret-up");
	}
	else if( c=="asc" ) {
		$(this).find("span.sortByPlace").attr("type","desc");
		$(this).find("span.sortByPlace i").attr("class","fa fa-caret-down");
	}
	else if( c=="desc" ) {
		$(this).find("span.sortByPlace").attr("type","none");
		$(this).find("span.sortByPlace i").attr("class","");
	}
	
	c = $(this).find("span.sortByPlace").attr("type");
	
	let rows = $("table:visible tr[data-inv!=fixe]:visible").detach().get();
	
	if( c=="none" ) {
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
	}
	else {
		rows.sort(function (a, b) {
			let $a = $(a).find("td:nth-child(3) img").attr("title");
			let $b = $(b).find("td:nth-child(3) img").attr("title");
			return $a > $b;
		});
		if( c=="desc" ) rows.reverse();
	}

	$("table:visible tr[data-inv=fixe]").after(rows);
	
	return false;
}



function selectInventoryCategory() {

	if($(this).data('inv')=='Tous'){
		if($(this).text()=='Toutes') {
			$('a[data-inv]').attr('class','select');
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
		if($(this).attr('class')=='select'){
			$(this).removeAttr('class');
			$(this).attr("style","opacity:0.4");
		}
		else {
			$(this).attr('class', 'select');
			$(this).attr("style","");
		}
	}

	$('a[data-inv="Tous"]').removeAttr('class');
	$('a[data-inv="Tous"]').attr('style',"font-weight: lighter; font-style: italic");

	if($("a[data-inv][class=select]").length>$("a[data-inv]").length/2) {
		$('a[data-inv="Tous"]').text("Aucune");
	}
	else {
		$('a[data-inv="Tous"]').text("Toutes");
	}

	console.log($(this).attr('class'));

	applyInventoryFilters();
	
	return false;
}


function selectInventoryPlace() {

	if($(this).data('place')=='Tous'){
		if($(this).text()=='Tous') {
			$('a[data-place]').attr('class','select');
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
		if($(this).attr('class')=='select'){
			$(this).removeAttr('class');
			$(this).attr("style","opacity:0.4");
		}
		else {
			$(this).attr('class', 'select');
			$(this).attr("style","");
		}
	}

	$('a[data-place="Tous"]').removeAttr('class');
	$('a[data-place="Tous"]').attr('style',"font-weight: lighter; font-style: italic");

	if($("a[data-place][class=select]").length>=$("a[data-place]").length/2) {
		$('a[data-place="Tous"]').text("Aucun");
	}
	else {
		$('a[data-place="Tous"]').text("Tous");
	}

	console.log($(this).attr('class'));

	applyInventoryFilters();
	
	return false;
}


function applyInventoryFilters() {

	ungroupInventoryEntries();

	let selected_places = [];
	$("a[data-place][class=select]").each(function () {  selected_places.push($(this).data('place')) });
	if( $.inArray("Tenue", selected_places) != -1 ) selected_places.push("Ceinture");
	// selected_places.push('Inventaire');
	let selected_inv = [];
	$("a[data-inv][class=select]").each(function () {  selected_inv.push($(this).data('inv')) });

	// console.log(selected_inv);
	// console.log(selected_places);

	$("#inventory_table tr[data-inv!=fixe][data-place!=fixe]").hide();
	// $("table:last").find("tr[data-inv=" + selected_inv + "][data-place=" + selected_places + "]").show();

	$("#inventory_table tr[data-inv!=fixe][data-place!=fixe]").each( function () {
		if( ($.inArray($(this).data('inv'), selected_inv) != -1) && ($.inArray($(this).data('place'), selected_places) != -1) ) {
			$(this).show();
		}
	});
	
	
	//------------------------------------------------------------------------------------------
	// UPDATE TABLE FIRST LINE WITH NUMBER AND WEIGHT OF VISIBLE ITEMS
	// $("span.weight").remove();
	let nombre = $("tr[data-place]:visible").length;
	let s = (nombre<2) ? "" : "s";
	let weight = 0;
	$("#inventory_table tr[data-place]:visible td:nth-child(2)").each( function() {
			weight += ~~$(this).text();
	});
	$("#inventory_table tr[data-inv=fixe] > td").eq(0)
		.text( (nombre==0) ? "Aucun item" : nombre + " item" + s + ", " + weight + " ")
		.append( (nombre==0) ? null : $("<span/>").attr("class","weight").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
		.append( "&nbsp;", $("<span/>").attr("class","sortByName").attr("type","none").append( $("<i/>") ) )
		.on("click", sortTableByName);
	$("#inventory_table tr[data-inv=fixe] > td").eq(1).text("")
		.append( $("<span/>").attr("class","weight").append( $("<i/>").addClass("fa-solid fa-weight-hanging") ) )
		.append( "&nbsp;", $("<span/>").attr("class","sortByWeight").attr("type","none").append( $("<i/>") ) )
		.on("click", sortTableByWeight);
	$("#inventory_table tr[data-inv=fixe] > td").eq(2).text("Emplacement")
		.append( "&nbsp;", $("<span/>").attr("class","sortByPlace").attr("type","none").append( $("<i/>") ) )
		.on("click", sortTableByPlace);
	$("#inventory_table tr[data-inv!=fixe] td").removeAttr("class");
	$("#inventory_table tr[data-inv!=fixe]:visible:odd > td").attr("class","info_objet");
	$("#inventory_table tr[data-inv!=fixe]:visible:even > td").attr("class","info_objet clair");
	
	// //------------------------------------------------------------------------------------------
	// // UPDATE FILTER NAMES WITH WEIGHT OF ITEMS
	// $("a[data-inv] span.weight").remove();
	// let invs = ["Tenue","Equipement","Consommable","Ressource"];
	// for (var i=0; i<invs.length; i++) {
		// let weight = 0;
		// $("#inventory_table tr[data-inv=" + invs[i] + "]:visible td:nth-child(2)").each( function() {
			// weight += ~~$(this).text();
		// });
		// $("a[data-inv="+invs[i]+"]").append( 
			// $("<span/>").attr("class","weight")
				// .append(" (", weight, " ", $("<i/>").addClass("fa-solid fa-weight-hanging"), ")" ) );
	// }
	
	// $("a[data-place] span.weight").remove();
	// let places = ["Inventaire","Tenue"]; 
	// mules_id.forEach( function(item) { places.push(item)})
	// for (var i=0; i<places.length; i++) {
		// let weight = 0;
		// $("#inventory_table tr[data-place=" + places[i] + "]:visible td:nth-child(2)").each( function() {
			// weight += ~~$(this).text();
		// });
		// $("a[data-place="+places[i]+"]").append( 
			// $("<span/>").attr("class","weight")
				// .append(" (", weight, " ", $("<i/>").addClass("fa-solid fa-weight-hanging"), ")" ) );
	// }
	
	

	// sortInventory();

	// $("#inventory_table td").removeClass("clair");
	// $("#inventory_table tr[data-inv!=fixe]:visible:even > td").addClass("clair");
}

function toggleDetails() {
	
	if( $(this).val() == "Montrer les détails" ) {
		
		$("span.item_list").show();
		$("span.place_list").show();
		$("span.extra_list").show();
		$("span.place_count").hide();
		$("span.expand_list").children("*").remove();
		$("span.expand_list").text("");
		$("span.expand_list").append( "&nbsp;", "&nbsp;", $("<i/>").attr("class","fa fa-chevron-down"), "&nbsp;", "&nbsp;" );
		$("span.expand_list").on("click",hideList);
		$(this).val("Cacher les détails")
	}
	else {
		$("span.item_list").hide();
		$("span.place_list").hide();
		$("span.extra_list").hide();
		$("span.place_count").show();
		$("span.expand_list").children("*").remove();
		$("span.expand_list").text("");
		$("span.expand_list").append( "&nbsp;", "&nbsp;", $("<i/>").attr("class","fa fa-chevron-right"), "&nbsp;", "&nbsp;" );
		$("span.expand_list").on("click",expandList);
		$(this).val("Montrer les détails")
	}
}
	
	

function toggleInventoryGrouping() {
	if ($("#group_entries").val() == "Grouper les entrées similaires") {
		groupInventoryEntries();
	}
	else {
		ungroupInventoryEntries();
	}
}


function expandList() {
	
	$(this).parent().parent().parent().find("span.item_list").show();
	$(this).parent().parent().parent().find("span.place_list").show();
	$(this).parent().parent().parent().find("span.extra_list").show();
	$(this).parent().parent().parent().find("span.place_count").hide();
	$(this).children("*").remove();
	$(this).text("");
	$(this).append( "&nbsp;", "&nbsp;", $("<i/>").attr("class","fa fa-chevron-down"), "&nbsp;", "&nbsp;" );
	$(this).on("click",hideList);
}

function hideList() {
	
	$(this).parent().parent().parent().find("span.item_list").hide();
	$(this).parent().parent().parent().find("span.place_list").hide();
	$(this).parent().parent().parent().find("span.extra_list").hide();
	$(this).parent().parent().parent().find("span.place_count").show();
	$(this).children("*").remove();
	$(this).text("");
	$(this).append( "&nbsp;", "&nbsp;", $("<i/>").attr("class","fa fa-chevron-right"), "&nbsp;", "&nbsp;" );
	$(this).on("click",expandList);
}


function groupInventoryEntries() {
	let list_entries = [];
	var i, item_name, item_count, item_line;
	let places = ["Inventaire","Tenue","Ceinture"]; 
	mules_id.forEach( function(item) { places.push(item)})
		
	var grouped_table = $("<table/>").attr("id","grouped_inventory_table").attr("width","100%")
					.append( $("<tbody/>").append( $("#inventory_table tr:first").clone() ) )
					.insertAfter( $("#inventory_table") );
					
	$("#grouped_inventory_table tr:first > td").eq(0).on("click", sortTableByName);
	$("#grouped_inventory_table tr:first > td").eq(1).on("click", sortTableByWeight);
	$("#grouped_inventory_table tr:first > td").eq(2).on("click", sortTableByPlace);
	
	$("#inventory_table tr:visible:has(.name)").each( function() {
		item_name = $(this).find(".name").text().trim();
		item_line = $("#grouped_inventory_table tr").filter(function() {
			return $(this).find("span.name").text() === item_name;
		});
		item_weight = ~~$(this).find("i.fa-solid").parent().html().split(' <i').slice(-2)[0].split(/[|(]+/).slice(-1)[0];
		item_place = $(this).attr("data-place");
		// item_place = 
		
		if ( item_line.length==0 ) {
			// console.log(item_name + " added");
			$("#grouped_inventory_table > tbody")
				.append( $("<tr/>")
							.attr("data-inv",$(this).attr("data-inv"))
							.attr("data-place",$(this).attr("data-place"))
							.append( $(this).children("*").clone() ) );

			if( $("#grouped_inventory_table tr:last span.item_name").find("span").length>1 ) {
				$("#grouped_inventory_table tr:last td:first")
					.append( $("<span/>").attr("class","item_list").attr("style","font-size: 0.9em;") // font-weight: bold; color: red"
								.append( "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;- ",
											$("#grouped_inventory_table tr:last").find(".enchantement").detach(),
											$("#grouped_inventory_table tr:last").find(".qualite").detach().show(),
											$("#grouped_inventory_table tr:last").find(".sertissage").detach(),
											$("#grouped_inventory_table tr:last").find(".conso").detach(),
											$("#grouped_inventory_table tr:last").find(".title").detach(),
											$("<br/>") ) );
				$("#grouped_inventory_table tr:last").find(".item_descr").remove();
				$("#grouped_inventory_table tr:last").find("strong:nth-child(2)").after( $("<span/>").attr("class","item_count").text(" x1") );
				$("#grouped_inventory_table tr:last span.item_count").after( $("<span/>").attr("class","expand_list").append( "&nbsp;", "&nbsp;", $("<i/>").attr("class","fa fa-chevron-right"), "&nbsp;", "&nbsp;" ) );
				$("#grouped_inventory_table tr:last td:nth-child(2)").text("")
				$("#grouped_inventory_table tr:last td:nth-child(2)").append( $("<span/>").attr("class","weight").text(item_weight), $("<span/>").attr("class","extra_list").attr("style","font-size: 0.9em;").append( $("<br/>"), "&nbsp;" ) );
				$("#grouped_inventory_table tr:last td:nth-child(3)").append( $("<span/>").attr("class","extra_list").attr("style","font-size: 0.9em;").append( $("<br/>"), "&nbsp;" ) );
				$("#grouped_inventory_table tr:last td:last").text( item_place );
				$("span.expand_list").on("click", expandList);				
			}
			else {
				$("#grouped_inventory_table tr:last").find(".item_descr").remove();
				$("#grouped_inventory_table tr:last").find("strong:nth-child(2)").after( $("<span/>").attr("class","item_count").text(" x1") );
				$("#grouped_inventory_table tr:last td:nth-child(2)").text("");
				$("#grouped_inventory_table tr:last td:nth-child(2)").append( $("<span/>").attr("class","weight").text(item_weight) );
				$("#grouped_inventory_table tr:last td:last").text( item_place );
			}
		}
		else if ( item_line.length==1 ) {
			
			// .remove();
			// .remove();
			// $("#grouped_inventory_table tr:last").find(".qualite").remove();
			// $("#grouped_inventory_table tr:last").find(".conso").remove();
			
			// console.log(item_name + " already in list");
			let count = ~~$(item_line).find("span.item_count").text().split("x")[1] + 1;
			$(item_line).find("span.item_count").text(" x" + count);
			$(item_line).find("td span.weight").text(count*item_weight);
			$(item_line).find("td span.extra_list").append( $("<br/>"), "&nbsp;" );
			$(item_line).find("td:last").text( $(item_line).find("td:last").text() + ", " + item_place );
			
			if( $(item_line).find("span.item_name").find("span").length>2 ) {
				$(item_line).find("td:first")
					.append( $("<span/>").attr("class","item_list").attr("style","font-size: 0.9em;") // font-weight: bold; color: red"
								.append( "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;", "&nbsp;- ",
											$(this).find(".enchantement").clone(), $(this).find(".qualite").clone().show(),
											$(this).find(".sertissage").clone(), $(this).find(".conso").clone(), $(this).find(".title").clone(), $("<br/>") ) );
				
			}
			
			// $(item_line).find("span.extra_list").append( $("<br/>") );
			
			// if( $(this).find(".enchantement").length>0 || $(this).find(".qualite").length>0 || 
					// $(this).find(".sertissage").length>0 || $(this).find(".conso").length>0 ) {
				// $(item_line).find("td:first").append( 	$(this).find(".enchantement").detach(),
													// $(this).find(".qualite").show().detach(),
													// $(this).find(".sertissage").detach(),
													// $(this).find(".conso").detach(),
													// $("<br/>") );
			// }
			
		}
		// else if ( item_line.length==0 ) {
			// // console.log(item_name + " added");
			// $("#grouped_inventory_table > tbody")
				// .append( $("<tr/>")
							// .attr("data-inv",$(this).attr("data-inv"))
							// .attr("data-place",$(this).attr("data-place"))
							// .append( $(this).children("*").clone() ) );
							
			
			// $("#grouped_inventory_table tr:last").find(".enchantement").remove();
			// $("#grouped_inventory_table tr:last").find(".qualite").remove();
			// $("#grouped_inventory_table tr:last").find(".sertissage").remove();
			// $("#grouped_inventory_table tr:last").find(".conso").remove();
			// $("#grouped_inventory_table tr:last").find(".item_descr").remove();
			// $("#grouped_inventory_table tr:last").find("strong:nth-child(2)").after( $("<span/>").attr("class","item_count").text(" x1") )
			
			// $("#grouped_inventory_table tr:last td:last").text( item_place );
		// }
		else {
			console.log("Ohohohohooooooo");
		}
		
		$("#inventory_table").after( $("#grouped_inventory_table") );
		$("#inventory_table").hide();
		
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
	
	// process last cell 
	$("#grouped_inventory_table tr[data-inv!=fixe] td:last-child").each( function() {
		let countPlaces = {};
		let arrayPlaces = $(this).text().split(", ");
		// console.log(arrayPlaces)
		$(this).text("");
		$(this).children("*").remove();
		arrayPlaces.forEach(function (x) { countPlaces[x] = (countPlaces[x] || 0) + 1; });
		// console.log(countPlaces)
		$(this).append( $("<span/>").attr("class","place_count") );
		for( var i=0;i<places.length;i++) {
			if( countPlaces[places[i]]!=undefined ) {
				$(this).find("span.place_count")
					.append( $("a[data-place="+ ((places[i]=="Ceinture") ? "Tenue" : places[i]) +"]")
								.parent().find("img.item").clone()
									.attr("title", (~~places[i]!=0) ? mules_name[mules_id.indexOf(places[i])] : places[i])
									.attr("style", (places[i]=="Ceinture") ? "opacity:0.4;" : ""),
							 "x"+countPlaces[places[i]], "&nbsp;" );
			}
		}
		if( $(this).parent().find("span.item_name").find("span").length>2 ) {
			$(this).append( $("<span/>").attr("class","place_list") );
			for( var i=0;i<arrayPlaces.length;i++) {
				$(this).find("span.place_list")
					.append( $("<br/>"), $("a[data-place="+((arrayPlaces[i]=="Ceinture") ? "Tenue" : arrayPlaces[i]) +"]")
											.parent().find("img.item").clone()
												// .attr("height","12px") 
												.attr("title", (~~arrayPlaces[i]!=0) ? mules_name[mules_id.indexOf(arrayPlaces[i])] : arrayPlaces[i])
												.attr("style", (arrayPlaces[i]=="Ceinture") ? "opacity:0.4;" : "") );
			}
		}
		else {
			$(this).find("span.place_count").removeClass().attr("class","place_count_nohide");
		}
			
	});
	
	$("span.item_list").hide();
	$("span.place_list").hide();
	$("span.extra_list").hide();
	$("#group_entries").val("Dégrouper les entrées similaires");
	
	$("#show_details").show();
	
	// $("#grouped_inventory_table span.sortByWeight").attr("type","none");
	// $("#grouped_inventory_table span.sortByWeight i").attr("class","");
	// $("#grouped_inventory_table span.sortByPlace").attr("type","none");
	// $("#grouped_inventory_table span.sortByPlace i").attr("class","");
	// $("#grouped_inventory_table span.sortByName").attr("type","none");
	// $("#grouped_inventory_table span.sortByName i").attr("class","");
	
	
	// $(".item_descr").hide();
	// $(".qualite").hide();
	// $(".sertissage").hide();
	// $(".enchantement").hide();
	// $(".aide_popin").hide();
	
}

function ungroupInventoryEntries() {
	if ($("#group_entries").val() == "Dégrouper les entrées similaires")  {
		
		// // $(".item_descr").show();
		// // $(".qualite").show();
		// // $(".sertissage").show();
		// // $(".enchantement").show();
		
		// $("tr[grouped=true] > td > strong").each( function() {
			// $(this).text( $(this).text().trim().split(' x')[0]);
		// });
		// $("tr[grouped=true]").removeAttr('grouped');
		// $("tr[grouped_hidden=true]").show();
		// $("tr[grouped_hidden=true]").removeAttr('grouped_hidden');
		$("#group_entries").val("Grouper les entrées similaires");
		$("#grouped_inventory_table").remove();
		$("#inventory_table").show();
		$("#show_details").val("Montrer les détails");
		$("#show_details").hide();
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
	// one direct link to every mule
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
	navigator.clipboard.writeText($("tr:visible span.item_name").clone().each(function(){$(this).text($(this).text().trim()+'\n')}).text());
}

//---------------------------------------------------------------------------------------
// PART OF SCRIPT RUNNING SOME EXTRAS
//---------------------------------------------------------------------------------------


function parseMonsterLogs() {

    let time_array = [];
    let tour_array = [];

    let id = $("div.description>i").first().text()

    if ( id.includes("Animal") || id.includes("Monstre") )
    {
        let name = $("div.description>a").first().text().split(' (')[0];
        $("table[id=historique]>tbody>tr").each( function() {
            let date = $(this).find("td").eq(0).text()
            let time = convertDate(date);
            let log = $(this).find("td").eq(1).text()
            if( log.split(' (')[0] == name ) {
                if ( time_array[time_array.length - 1] != date ) {
                    time_array.push(time);
                    if ( time_array.length> 1 ) {
                        let time1 = time_array[time_array.length-2];
                        let time0 = time_array[time_array.length-1];
                        if ( time1 < time0 ) time1 += 24*60;
                        tour_array.push(time1-time0);
                    }
                }
            }
        })

        console.log(name)
        for (let i=0;i<tour_array.length;i++){
            console.log(tour_array[tour_array.length-1-i])
        }
    }


}



function convertDate(date) {
    let parse = date.split(' ');
    let time = parse[parse.length-1];
    let h = Number(time.split('h')[0]);
    let m = Number(time.split('h')[1]);

    if(parse[0]=="Aujourd'hui") {
        let date = new Date();
    }
    else {

    }

    return h*60+m;

}



function addGrid() {
    $("td.vue>a.bulle").append($("<img/>").attr("src","https://raw.githubusercontent.com/syltou/kigard-inventory/main/grid.png" ).attr("class","cellule grid"));
}

function addHideButton() {
	if ( $("blockquote").eq(0).text().includes("Choisissez") ) {
		var table = $("table")[0];
		$("<br/>").insertBefore(table);
		$("<div/>").attr("class","filtres").attr("style","text-align:center;")
					.append( $("<a/>").attr("id","hide-craft").attr("state","hide").attr('href','#').text("Cacher les recettes indisponibles") )
					.insertBefore(table);
		$("#hide-craft").on("click",hideUnavailableCraft);
	}
}

function hideUnavailableCraft() {
	if( $("#hide-craft").attr("state")=="hide" ) {
		$("span.rouge").each( function() {
			$(this).parent().parent().attr("state","hidden").hide();
		});
		$("#hide-craft").attr("state","show")
		$("#hide-craft").text("Afficher les recettes indisponibles");
	}
	else {
		$("[state=hidden]").each( function() {
			$(this).removeAttr("state").show();
		});
		$("#hide-craft").attr("state","hide");
		$("#hide-craft").text("Cacher les recettes indisponibles");
	}
}


function getNotifOnMobile() {
	var count=0;
	$("#menu > ul > li > a").each( function() {
		let t = $(this).text();
		if(t.slice(t.length-1)==')') count+=~~t.split('(')[1].split(')')[0];
	});
	if (count>0) $("#menu a.toggleMenu").text("Menu("+count+")");
}

function addMonsterIDs() {
	$("a.profil_popin").each( function() {
		let link = $(this).attr("href");
		if(link.includes("monstre")) {
			$(this).text( $(this).text() + " (" + link.split("id=")[1].split("&type")[0] +")");
		}
	});
}

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
			$("#copy_list").click( function () {
				navigator.clipboard.writeText("*" + $("h3").text().trim() + "*:\n" + $("tbody tr:visible td[class!=fonce] strong:nth-child(2)").clone().each(function(){$(this).text($(this).text().trim()+'\n')}).text());
			});
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
		localStorage.setItem('myskin', $("div.infoline:contains(Race)").find("img").attr("src")); //.replace("_cheval",""));
	});
}



function renameArenas() {
	$("span.ddTitleText").each( function(i,val) {
		let parse = $(this).text().split(":");
		let x = parse[1].split(' ')[0].trim();
		let y = parse[2].split(']')[0].trim();
		// let arenapos = Array(~~x,~~y);
		let arenapos = parsePositionArena( $(this).text().split('[')[1] );
		let arenaname = getArenaName( arenapos );
		let postext = $(this).text().split("rène")[1];
		$(this).text( arenaname + postext ); //+ " (" + distance(arenapos,mypos) + " " + direction(angle(arenapos,mypos),1) + ")");
	});
}


// get members name from page clan->membres
function getNames() {
	// in the 1th column
	let xpath = '//tbody/tr[*]/td[2]';
	let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	let listNames = Array();
	for (var i=0;i < lines.snapshotLength;i++) {
		let line = lines.snapshotItem(i);
		listNames[i] = line.textContent.trim();
	}
	return listNames;
}


function getPositions() {
  // in the 8th column
  let xpath = '//tbody/tr[*]/td[8]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i=0;i < lines.snapshotLength;i++) {
	  let line = lines.snapshotItem(i);
	  let pos = parsePositionPerso(line.textContent.trim());
	  let dis = distance(pos,mypos);
	  let ang = angle(pos,mypos);
	  let dir = direction(ang);
	  //console.log(ang);
	  let prevHTML = line.innerHTML;
	  if(listNames[i] != myname) {
		  line.innerHTML = "<div class='grille-membres'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						 + "<img src='https://raw.githubusercontent.com/syltou/kigard-inventory/main/compass2.png' style='transform:rotate(" + (-1*ang) + "deg);'></div><div>"
						 + prevHTML + "</div><div>&nbsp;[" + dis + " cases " + dir + "]&nbsp;</div></div>";//.format(distance(pos,mypos));
	  }
	  else {
		  line.innerHTML = "<div class='grille-membres'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						 + "<img src='https://raw.githubusercontent.com/syltou/kigard-inventory/main/compass2.gif'></div><div>"
						 + prevHTML + "</div><div>&nbsp;[Vous êtes ici]&nbsp;</div></div>";
	  }
	  members.push([listNames[i],pos]);
  }
}

function parsePositionArena(str){
	let x = ~~str.split(':')[1].split(' ')[0].trim();
	let y = ~~str.split(':')[2].split(']')[0].trim();
	return Array(x,y);
}

function getArenaName( arenapos ) {
	let dic = { "-13,-13":"Sud-Ouest", "13,13":"Nord-Est", "-44,44":"des Marais", "-41,-41":"des Plaines", "41,-41":"des Neiges", "41,42":"de la Nécrose", "-13,13":"Nord-Ouest", "0,0":"du Centre", "13,-13":"Sud-Est"};
	let positions = Object.keys(dic);
	let arenaname = "Arène inconnue";
	positions.forEach( (pos) => {
		if( pos==arenapos.toString() ) {
			arenaname = "Arène "+dic[pos];
		}
	});
	return arenaname;
}

function parsePositionPerso(str){
	let x = ~~str.split(':')[1].split('|')[0].trim();
	let y = ~~str.split(':')[2].split(' ')[0].trim();
	return Array(x,y);
}

function distance(vec1, vec2){
	let dx = Math.abs(vec1[0]-vec2[0]);
	let dy = Math.abs(vec1[1]-vec2[1]);
	return Math.max(dx,dy);
}

function angle(vec1, vec2){
	let dx = (vec1[0]-vec2[0]);
	let dy = (vec1[1]-vec2[1]);
	return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function direction(angle,short=0){
	if (angle<=22.5 && angle>-22.5){
		if(short) return "E";
		else return "à l'Est";
	} else if (angle<=67.5 && angle>22.5){
		if(short) return "NE";
		else return "au Nord-Est";
	} else if (angle<=112.5 && angle>67.5){
		if(short) return "N";
		else return "au Nord";
	} else if (angle<=157.5 && angle>112.5){
		if(short) return "NO";
		else return "au Nord-Ouest";
	} else if (angle<=-157.5 || angle>157.5){
		if(short) return "O";
		else return "à l'Ouest";
	} else if (angle<=-112.5 && angle>-157.5){
		if(short) return "SO";
		else return "au Sud-Ouest";
	} else if (angle<=-67.5 && angle>-112.5){
		if(short) return "S";
		else return "au Sud";
	} else if (angle<=-22.5 && angle>-67.5){
		if(short) return "SE";
		else return "au Sud-Est";
	}
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
	$("#formulas_table tr[data-metier!=fixe]:visible:odd > td").attr("class","info_objet");
	$("#formulas_table tr[data-metier!=fixe]:visible:even > td").attr("class","info_objet clair");
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