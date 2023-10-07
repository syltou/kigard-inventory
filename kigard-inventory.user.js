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

let mules_id = localStorage.getItem("mules_id");
if (mules_id == null) mules_id = [];
else mules_id = JSON.parse(mules_id);
let mules_name = localStorage.getItem("mules_name");
if (mules_name == null) mules_name = [];
else mules_name = JSON.parse(mules_name);
let myskin = localStorage.getItem("myskin");
if (myskin == null) myskin = "images/vue/pj/HumainF.gif";


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

if (page == "empathie") {
	findMules();
	duplicateButtonEmpathie();
}

if (page == "vue"){
	saveSkin();

}

if(page == "formules") {
	
	improveFormulasPage();
	
	//----------addFormulasCategory();
	//----------updateOriginalFilters();
	// ---------addCategoryFilter();
	// ---------addDifficultyFilter();
	// ---------addExtraFilters()
	
	
	// updateTableTitle();
	// addCopyButton($('#formulas-table')[0],"formulas");
}




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

function duplicateButtonEmpathie() {
	$("input.pos:odd").after("&nbsp;&nbsp;",$("input[name=modif_suivant]:last").clone());
	$("img.po").after("&nbsp;&nbsp;",$("input[name=modif_suivant]:last").clone());
}

function saveSkin() {
	$(document).ready( function() {
		myskin = $("div[class='cellule filtre clic']").parent().find("img:first").attr("src");
		if (myskin == undefined) myskin="images/vue/pj/HumainF.gif";
		localStorage.setItem('myskin',myskin);
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
	$("table:first")
		.attr("id","formulas_table")
		.find("small").each( function() {
		if( $(this).parent().prop("tagName")!='EM' ) {
			let value = $(this).text().split('-')[1].trim();
			$(this).parent().parent().attr('data-category', parseCategory(value));
		}
	});
	$("table:first")
		.find("tr").each( function() {
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
	// ADD COPY BUTTON 
	addCopyButton($('#formulas_table')[0],"formulas");
	
	
	updateTableTitle();
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
		updateTableTitle()
		return false;
	}
}


function searchText() {
	let tex = $("#search").val() ;
	$(document).ready( function() {
		applyFiltering();
		updateComponentFilter();
		$("tr[data-formule]:visible:not(:contains('"+tex+"'))").hide();
		updateTableTitle()
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
	updateTableTitle()
}

function updateTableTitle() {
	let displayed_lines = $("tr[data-formule]:visible");
	let nombre = displayed_lines.length;
	let s = "s";
	if(nombre<2) s = '';
	if(nombre==0) nombre = "Aucune";
	
	$("table:first").children("tbody:first").children("tr:first").children("td:first")[0].innerText = nombre + " formule" + s;
	$("table:first").find("td").removeClass("clair");
	$("table:first").find("tr:visible:odd > td").addClass("clair");
}

function addCopyButton(table,type) {

	let parent = table.parentNode;
	let span = document.createElement("span");
	parent.insertBefore(span,table);

	// let button2 = '<input name="copy_list" type="button" value="Copier la liste">';
	let button = document.createElement("input");//, { name: "copy_list"; type: "button"; value: "Copier la liste" });
	button.id = "copy_list";
	button.type = "button";
	button.value = "Copier la liste";

	let space = document.createTextNode('&nbsp;')
    let filter1, filter2, filter3, filter4, filter5;
    let label1, label2, label3, label4, label5;

	switch(type) {

		  case 'inventory':
			span.appendChild(button);
			$("#copy_list").click(copyListInventory);
			break;

		  case 'formulas':
			filter1 = document.createElement("input");
			filter1.id = "show_formule";
			filter1.type = "checkbox";
			label1 = document.createElement("label");
			label1.setAttribute('for',"show_formule");
			label1.innerHTML = "Formules";

            filter2 = document.createElement("input");
			filter2.id = "show_caracs";
			filter2.type = "checkbox";
			label2 = document.createElement("label");
			label2.setAttribute('for',"show_caracs");
			label2.innerHTML = "Caracs";

            filter3 = document.createElement("input");
			filter3.id = "show_diff";
			filter3.type = "checkbox";
			label3 = document.createElement("label");
			label3.setAttribute('for',"show_diff");
			label3.innerHTML = "Difficulté";

            filter4 = document.createElement("input");
			filter4.id = "show_metier";
			filter4.type = "checkbox";
			label4 = document.createElement("label");
			label4.setAttribute('for',"show_metier");
			label4.innerHTML = "Métier";

            filter5 = document.createElement("input");
			filter5.id = "show_bonus";
			filter5.type = "checkbox";
			label5 = document.createElement("label");
			label5.setAttribute('for',"show_bonus");
			label5.innerHTML = "Bonus";

            span.appendChild(button);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter1);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label1);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter2);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label2);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter3);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label3);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter4);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label4);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter5);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label5);
			$("#copy_list").click(copyListFormulas);
			break;

		  default:

	}
}

function copyListInventory() {

	// navigator.clipboard.writeText($("table:first").children("tbody:first").children("tr:visible").find("strong").each(function(){$(this).text($(this).text()+'\n')}).text());
	navigator.clipboard.writeText($("tr:visible strong:nth-child(2)").clone().each(function(){$(this).text($(this).text()+'\n')}).text().trim());
}

function copyListFormulas() {

	var i, j , m, p;

	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	var comp = $('a[data-comp][class="sel"]').data('comp');
	var comp_name = $('a[data-comp][class="sel"]').children("img").attr("title");
	var search = $('#search')[0].value ;

	let show_formule = $("#show_formule")[0].checked;
	let show_caracs = $("#show_caracs")[0].checked;
	let show_diff = $("#show_diff")[0].checked;
	let show_metier = $("#show_metier")[0].checked;
	let show_bonus = $("#show_bonus")[0].checked;

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