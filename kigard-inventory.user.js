// ==UserScript==
// @name         Kigard Inventory
// @version      0.1
// @description  Permet un meilleur usage de l'inventaire et des formules d'artisanat
// @author       Fergal <ffeerrggaall@gmail.com>
// @match        https://tournoi.kigard.fr/*
// @icon         https://tournoi.kigard.fr/images/items/37.gif
// @grant        none
// ==/UserScript==

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p');
const subp = urlParams.get('g');
const inv = urlParams.get('genre');

let mules_id = JSON.parse(localStorage.getItem("mules_id"));
if (mules_id == undefined) mules_id=[];
let mules_name = JSON.parse(localStorage.getItem("mules_name"));
if (mules_name == undefined) mules_name=[];


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