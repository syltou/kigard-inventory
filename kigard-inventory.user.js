// ==UserScript==
// @name		 Kigard Inventory
// @version	  1.7.1
// @description  Permet un meilleur usage de l'inventaire et des formules d'artisanat, et rajoute un radar dans la vue
// @author	   Fergal <ffeerrggaall@gmail.com>
// @match		https://tournoi.kigard.fr/*
// @icon		 https://tournoi.kigard.fr/images/items/37.gif
// @grant    GM_addStyle
// ==/UserScript==

$("#header").remove();

var myred = "#CC0000"
var myyellow = "#D4A253"
var mygreen = "#009900"
var myrose = "#E8A8B0"//"#CC6677"
var mylilac = "#C3B3E5" //#7766CC"


window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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

let gridon = JSON.parse(localStorage.getItem("gridon"));
let details_logs_shown = JSON.parse(localStorage.getItem("details_logs_shown"));
let details_vue_shown = JSON.parse(localStorage.getItem("details_vue_shown"));
let arena_id = JSON.parse(localStorage.getItem("last_arena"));
let vue_x2 = JSON.parse(localStorage.getItem("vue_x2"));

let list_arenas = ["1140","1118","1137","1142","1152","1155","1154","1153","1147"];
$("#menu>ul>li:eq(6)>ul>li:eq(4)>a").attr("href","index.php?p=arene"+ (arena_id ? "&id_arene="+list_arenas[arena_id] : "") )

var members = [];
var mypos = parsePositionPerso( $(".margin_position").text() );
var myname = $(".inline span[class!='margin_pa'] b").text().split(" ")[0]

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
                334,335,336,337,344,350,364];

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
    $("blockquote img").css("height", "");
    updateViewSize();
    addMonsterIDs();
    addHideButton();
    parseHisto();
    //if(!window.mobileCheck()) radarVue();
    //parseMonsterLogs();
    addGrid();
    addTabs();
    statsTirage();
}

if (page == "empathie") {
    findMules();
    duplicateButtonEmpathie();
}

// if (page == "profil"){
// 	saveSkin();
// }

if(page == "formules") {
    improveFormulasPage();
}

// if (page == 'InventaireComplet') {
// 	createInventoryPage();
// }

if(page == "liste_pj") {
    displayListPJs();
}
if(page == "liste_clan") {
    displayListClans();
}


if (page == "inventaire") {
    enhanceInventory();
    addMulesToInventory();

    //var list = {};

    // 	saveInventory(inv);
    // 	addCopyButton( $("#bloc table:first"),"inventory");
}

if (page == "gestion_stock") {
    var id = urlParams.get('id_monstre');
    saveMulet(id);
    addCopyButton( $("#bloc table:first"),"inventory");
    renameMuletPage(id);
}

if (page == "arene") {
    if (vue_x2) $("div.bloc-vue").attr("class","bloc-vue vue_x2");
    renameArenas();
    navigateArenas();
    addMonsterIDs();
    addTabs();
    //parseHisto();
    //if(!window.mobileCheck()) radarVue();
    //parseMonsterLogs();
    addGrid();
}

if (page == "clan" && subp == "membres") {
    var listNames = getNames();
    getPositions();
    localStorage.setItem("members",members);
    localStorage.setItem("fetched",1);
}

if (page == "clan" && subp == "batiments") {
    //showStats();
    someTests();
}


function displayListPJs() {

    function selectDiplo() {
        var diplo = JSON.parse(localStorage.getItem("diploPJ"))
        var id = $(this).attr("id")
        var pj = 0
        switch( id[0] ) {
            case 'a':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",mygreen)
                pj = id.split("ally")[1]
                $("#neutral"+pj).removeClass("fa-solid")
                $("#neutral"+pj).addClass("fa-regular")
                $("#neutral"+pj).css("color","")
                $("#foe"+pj).removeClass("fa-solid")
                $("#foe"+pj).addClass("fa-regular")
                $("#foe"+pj).css("color","")
                diplo[pj] = 0;
                break;

            case 'n':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",myyellow)
                pj = id.split("neutral")[1]
                $("#ally"+pj).removeClass("fa-solid")
                $("#ally"+pj).addClass("fa-regular")
                $("#ally"+pj).css("color","")
                $("#foe"+pj).removeClass("fa-solid")
                $("#foe"+pj).addClass("fa-regular")
                $("#foe"+pj).css("color","")
                diplo[pj] = 1;
                break;

            case 'f':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",myred)
                pj = id.split("foe")[1]
                $("#neutral"+pj).removeClass("fa-solid")
                $("#neutral"+pj).addClass("fa-regular")
                $("#neutral"+pj).css("color","")
                $("#ally"+pj).removeClass("fa-solid")
                $("#ally"+pj).addClass("fa-regular")
                $("#ally"+pj).css("color","")
                diplo[pj] = 2;
                break;
        }
        localStorage.setItem("diploPJ",JSON.stringify(diplo));
    }

    $("#contenu").children().each( function() {
        if( $(this).attr("id") != "header" && $(this).attr("id") != "menu" )
            $(this).remove();
    });
    $("#contenu").append( $("<div/>").attr("id","liste_pj") )
    $("#liste_pj").load("https://tournoi.kigard.fr/liste_pj.php #page_profil_public > *", function(response, status, xhr) {
        if (status === "success") {
            var diplo = (v=localStorage.getItem("diploPJ")) ? JSON.parse(v) : {};
            if( Object.keys(diplo).length == 0 ) {
                $("#historique tr:not(:first) td:nth-child(1) a").each( function(index) {
                    diplo[$(this).attr("href").split("?id=")[1].split("&type")[0]] = 1
                })
                localStorage.setItem("diploPJ",JSON.stringify(diplo));
            }
            $("#historique tr>td:not([class]):nth-child(2)").attr("width","8%")
            $("#historique tr:first").append( $("<td/>").attr("width","20%").attr("class","fonce").append( "Diplomatie" ) )
            $("#historique tr:not(:first)").each( function(index) {
                var id = $(this).find("td:nth-child(1) a").attr("href").split("?id=")[1].split("&type")[0]
                var code = diplo[id];
                if(code==undefined) {
                    code = 1
                    diplo[id] = 1;
                }
                $(this).append( $("<td/>")
                               .attr("width","20%")
                               .append( $("<div/>")
                                       .append( $("<span/>").attr("id","ally"+id).attr("class",diplo[id]==0?"fa-solid fa-circle-check":"fa-regular fa-circle-check").css("color",diplo[id]==0?mygreen:"").on("click", selectDiplo) )
                                       .append( "&nbsp;&nbsp;" )
                                       .append( $("<span/>").attr("id","neutral"+id).attr("class",diplo[id]==1?"fa-solid fa-circle-question":"fa-regular fa-circle-question").css("color",diplo[id]==1?myyellow:"").on("click", selectDiplo) )
                                       .append( "&nbsp;&nbsp;" )
                                       .append( $("<span/>").attr("id","foe"+id).attr("class",diplo[id]==2?"fa-solid fa-circle-xmark":"fa-regular fa-circle-xmark").css("color",diplo[id]==2?myred:"").on("click", selectDiplo) ) ) )

            });
            $("#historique tr>td[class=fonce]:nth-child(1)").attr("width","20%")
            $("#historique tr>td[class=fonce]:nth-child(2)").attr("width","20%")
            $("#historique tr>td[class=fonce]:nth-child(3)").attr("width","40%")
        } else if (status === "error") {
            console.log("An error occurred when loading the characters list: " + xhr.status + " " + xhr.statusText);
        }
    });

}


function updateClanMembersDiplo( clanid, state) {
    $.get("profil_public.php?id="+clanid+"&type=clan").done( function (data) {
        var diploM = (v=localStorage.getItem("diploPJ")) ? JSON.parse(v) : {};
        $(data).find("table tr:not(:first) td:first-child a").each( function() {
            var id = $(this).attr("href").split("id=")[1].split("&")[0]
            diploM[id] = state;
        });
        localStorage.setItem("diploPJ",JSON.stringify(diploM));
    });
}


function displayListClans() {

    function selectDiplo() {
        var diplo = JSON.parse(localStorage.getItem("diploClan"))
        var id = $(this).attr("id")
        var clan = 0
        switch( id[0] ) {
            case 'a':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",mygreen)
                clan = id.split("ally")[1]
                $("#neutral"+clan).removeClass("fa-solid")
                $("#neutral"+clan).addClass("fa-regular")
                $("#neutral"+clan).css("color","")
                $("#foe"+clan).removeClass("fa-solid")
                $("#foe"+clan).addClass("fa-regular")
                $("#foe"+clan).css("color","")
                diplo[clan] = 0;
                updateClanMembersDiplo( clan, 0)
                break;

            case 'n':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",myyellow)
                clan = id.split("neutral")[1]
                $("#ally"+clan).removeClass("fa-solid")
                $("#ally"+clan).addClass("fa-regular")
                $("#ally"+clan).css("color","")
                $("#foe"+clan).removeClass("fa-solid")
                $("#foe"+clan).addClass("fa-regular")
                $("#foe"+clan).css("color","")
                diplo[clan] = 1;
                updateClanMembersDiplo( clan, 1)
                break;

            case 'f':
                $(this).removeClass("fa-regular")
                $(this).addClass("fa-solid")
                $(this).css("color",myred)
                clan = id.split("foe")[1]
                $("#neutral"+clan).removeClass("fa-solid")
                $("#neutral"+clan).addClass("fa-regular")
                $("#neutral"+clan).css("color","")
                $("#ally"+clan).removeClass("fa-solid")
                $("#ally"+clan).addClass("fa-regular")
                $("#ally"+clan).css("color","")
                diplo[clan] = 2;
                updateClanMembersDiplo( clan, 2)
                break;
        }
        localStorage.setItem("diploClan",JSON.stringify(diplo));
    }

    $("#contenu").children().each( function() {
        if( $(this).attr("id") != "header" && $(this).attr("id") != "menu" )
            $(this).remove();
    });
    $("#contenu").append( $("<div/>").attr("id","liste_clan") )
    $("#liste_clan").load("https://tournoi.kigard.fr/liste_clan.php #page_profil_public > *", function(response, status, xhr) {
        if (status === "success") {
            var diplo = (v=localStorage.getItem("diploClan")) ? JSON.parse(v) : {};
            if( Object.keys(diplo).length == 0 ) {
                $("#historique tr:not(:first) td:nth-child(1) a").each( function(index) {
                    diplo[$(this).attr("href").split("?id=")[1].split("&type")[0]] = 1
                })
                localStorage.setItem("diploClan",JSON.stringify(diplo));
            }
            $("#historique tr>td:not([class]):nth-child(2)").attr("width","8%")
            $("#historique tr:first").append( $("<td/>").attr("width","20%").attr("class","fonce").append( "Diplomatie" ) )
            $("#historique tr:not(:first)").each( function(index) {
                var id = $(this).find("td:nth-child(1) a").attr("href").split("?id=")[1].split("&type")[0]
                $(this).append( $("<td/>")
                               .attr("width","20%")
                               .append( $("<div/>")
                                       .append( $("<span/>").attr("id","ally"+id).attr("class",diplo[id]==0?"fa-solid fa-circle-check":"fa-regular fa-circle-check").css("color",diplo[id]==0?mygreen:"").on("click", selectDiplo) )
                                       .append( "&nbsp;&nbsp;" )
                                       .append( $("<span/>").attr("id","neutral"+id).attr("class",diplo[id]==1?"fa-solid fa-circle-question":"fa-regular fa-circle-question").css("color",diplo[id]==1?myyellow:"").on("click", selectDiplo) )
                                       .append( "&nbsp;&nbsp;" )
                                       .append( $("<span/>").attr("id","foe"+id).attr("class",diplo[id]==2?"fa-solid fa-circle-xmark":"fa-regular fa-circle-xmark").css("color",diplo[id]==2?myred:"").on("click", selectDiplo) ) ) )

            });
            $("#historique tr>td[class=fonce]:nth-child(1)").attr("width","20%")
            $("#historique tr>td[class=fonce]:nth-child(2)").attr("width","20%")
            $("#historique tr>td[class=fonce]:nth-child(3)").attr("width","40%")
        } else if (status === "error") {
            console.log("An error occurred when loading the clans list: " + xhr.status + " " + xhr.statusText);
        }
    });

}


function updateViewSize() {
    //on page Vue

    if( $("div.bloc-vue").attr("class") == "bloc-vue vue_x2" ) {
        vue_x2 = 1;
        localStorage.setItem("vue_x2",1);
    }
    else {
        vue_x2 = 0;
        localStorage.setItem("vue_x2",0);
    }
    console.log("Type de vue: ", (vue_x2 ? "double" : "simple") );
}



function addTabs() {

    GM_addStyle(`

.tab {
  display: flex;
  justify-content: space-evenly; /* Distribute space evenly */
  width: 100%; /* Ensure the tabs container takes full width */
  overflow: hidden;
  border: none; //1px solid #332408;
  background-color: #332408;
}

/* Style the buttons inside the tab */
.tab button {
  flex: 1;
  text-align: center;
  box-sizing: border-box;
  background-color: #332408;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px 5px 5px 5px;
  transition: 0.3s;
  font-weight: bold;
  color: #f7e7be;
  font-size: 1.1em;
  line-height: 20px;
  font-family: Verdana, Tahoma, Helvetica, sans-serif;
}

.tab:not(:last-child) {
            border-right: none; /* Remove right border for all except last tab */
        }

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #f7e7be;
  color: #332408;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #f7e7be;
  color: #332408;
}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 6px 12px;
 /* border: 1px solid #ccc; */
  border-top: none;
}
`);

    var tab = $("<div/>").attr("class","tab")
    .append( $("<button/>").attr("class","tablinks active").on("click",{id: "selection"},tabfunc).text("Sélection") )
    .append( $("<button/>").attr("class","tablinks").on("click",{id: "radar"},tabfunc).text("Radar") )

    var tab1 = $("<div/>").attr("class","tabcontent").attr("id","selection").attr("style","display: block;")
    .append( $("blockquote.vue").children().detach() )

    var tab2 = $("<div/>").attr("class","tabcontent").attr("id","radar").attr("style","display: none; height: "+String( $("table.vue").height()-45 )+"px;")
    .append( $("<div/>").attr("id","radarContent") )//.attr("style","height:"+String( $("table.vue").height() )+";") )
                                                        //+String( $("#selection>div.description").height() + $("#form_action").height() )+";") )

    $("blockquote.vue").append( tab, tab1, tab2)
    $("div.vue")
        .append( $("#kicarteGo").parent().get() )
        .append( $("#kicarteMessages").parent().get() )

    radarVue()

    function tabfunc(event) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(event.data.id).style.display = "block";
        event.currentTarget.className += " active";
    }

}







function addMulesToInventory() {

    $.get("https://tournoi.kigard.fr/index.php?p=empathie", function(data) {
        var mules_list = new Map();
        $(data).find("tr:contains(Mulet)").each( function(index) {
            var link = $(this).find("a[href*='gestion_stock']").first();
            var url = link.attr("href");
            var id = link.attr("href").split("monstre=")[1];
            var charge = link.text().split("stock (")[1].split(" / ")[0];
            var capacite = link.text().split(" / ")[1].split(")")[0];
            mules_list.set(index, {"id":id,
                                   "url":url,
                                   "charge":charge,
                                   "capa":capacite} );
        });
        processMule(0,mules_list);
    });

    function processMule(index,mules_list) {

        if( index>= mules_list.length) return;

        var id = mules_list.get(index).id;
        console.log("Processing mule #"+id);

        $("<div/>").attr("class","infoline")
            .append( $("<span/>").text("???"), $("<i/>").attr("class","fa-solid fa-weight-hanging"), $("<b/>").text( mules_list.get(index).charge + "/" + mules_list.get(index).capa) )
            .insertBefore( $("div.infoline:contains(Ventes)" ) );

        $("<div/>").attr("class","storage").attr("id","mule"+id)
            .insertBefore( $("div.infoline:contains(Ventes)" ) );

        var height = $("blockquote.equipement").height();
        // <blockquote class="equipement" style="position:relative;top:400px">
        $("<blockquote/>").attr("class","equipement").attr("style","position:relative;top:"+String(height+15)+"px")
            .append( $("<h4/>").text("Mulet Robuste") )
            .append( $("<div/>").attr("id","mulet_items").attr("style","margin-left: 10px;") )
            .insertAfter( $("blockquote.equipement").attr("style","position:absolute;") );


        var items_list = [];

        $.get("https://tournoi.kigard.fr/index.php?p=gestion_stock&id_monstre="+id, function (data) {

            var items_list_grouped = new Map();

            $(data).find("table:first tbody td:first-child").each( function() {
                var icon = $(this).find("img.item")
                var item = $(this).find("img.item").attr("src").split("items/")[1].split(".gif")[0];
                var name = $(this).find("b:first").text()

                if( items_list_grouped.has(item) ) {
                    items_list_grouped.set(item, items_list_grouped.get(item)+1 );
                }
                else {
                    items_list_grouped.set(item,1);
                    var obj = $("<a/>").attr("href","https://tournoi.kigard.fr/index.php?p=gestion_stock&id_monstre="+id)
                    .append( $("<div/>").attr("class","item")
                            .append( $("<b/>").text( 1 ) )
                            .append( $(icon).attr("alt",name).attr("title",name)
                                    .attr("width","20").attr("height","20").attr("style","min-width:20px;min-height:20px;image-rendering: smooth;")) );
                    items_list.push( $(obj).prop("outerHTML") );
                }
            });

            $("#mule"+id).append( $(items_list.join('&nbsp;') ) );
            $("#mulet_items").append( $(items_list.join('') ) );

            for(const [item, nb] of items_list_grouped) {
                $("#mule"+id+" img[src*='/"+item+".gif']").parent().find("b").text(nb);
                $("#mulet_items img[src*='/"+item+".gif']").parent().find("b").text(nb);
            }
        });

        processMule(index+1);
    }
}

function enhanceInventory() {

    var current_items_list = $.map( $("div.storage:eq(0) a"), function(i) { return $(i).attr("href").split("item_id=")[1]; });
    var previous_items_list = localStorage.getItem("items_list");
    var details;

    if( current_items_list == previous_items_list ) {
        // console.log("Loaded from localstorage")
        details = localStorage.getItem("items_details");
        $("div.storage:eq(0) a").remove();
        $("div.storage:eq(0)").append( $(details) );
    }
    else {
        // console.log("Loaded from server")
        details = [];
        processItem(0);
    }

    function processItem(index) {
        if (index >= current_items_list.length) {
            // All items processed, now save details to localStorage
            var data_to_save = details.join('');
            localStorage.setItem("items_details", data_to_save);
            localStorage.setItem("items_list",current_items_list)
            return;
        }

        // Get the current item
        var item = current_items_list[index];

        // Make the $.get request
        $.get('https://tournoi.kigard.fr/index.php?p=inventaire&item_id=' + item, function(data) {
            let name = $(data).find("div.info-item div.label").text().trim();
            let ench = $(data).find("span.enchantement").text().trim();
            let sert = $(data).find("span.sertissage").text().trim();
            let extra = "";
            if(ench) {
                extra += " [" + ench;
                extra += (!sert)?"]":"";
            };
            if(ench && sert) extra+=" | ";
            if(sert) {
                extra += (!ench)?" [":"";
                extra += sert + "]";
            };

            let link = $("a[href*="+item+"]");
            link.find("img").attr("title", name+extra );
            let icon = link.find("div.item").detach();
            link.append( $("<div/>").attr("class","label")
                        .append( icon )
                        .append( $("<span/>").append( $("<b/>").text("  "+name) ) )
                        .append( $("<strong/>").attr("style","font-size:10px;")
                                .append( $("<span/>").attr("class","enchantement").text(" "+ench) )
                                .append( $("<span/>").attr("class","sertissage").text(" "+sert) ) )
                       );
            details.push( $(link).prop("outerHTML") );
            processItem(index + 1);
        })
            .fail(function() {
            console.error("Error when processing item number ", item);
            processItem(index + 1); // Proceed even if one request fails
        });
    }

}



function someTests() {

    let a = $("div[id=bloc]>i");

    a = $("<p>").insertAfter(a);

    for(var k=1; k<180; k++) {
        a=$("<img>")
            .attr("src","https://tournoi.kigard.fr/images/vue/monstre/"+k+".gif")
            .attr("width","100").attr("height","100")
            .insertAfter(a);
    }

    a = $("<p>").insertAfter(a);

    for( k=1; k<400; k++) {
        a=$("<img>")
            .attr("src","https://tournoi.kigard.fr/images/items/"+k+".gif")
            .attr("width","100").attr("height","100")
            .insertAfter(a);
    }

    a = $("<p>").insertAfter(a);

    for( k=1; k<180; k++) {
        a=$("<img>")
            .attr("src","https://tournoi.kigard.fr/images/vue/lieu/"+k+".gif")
            .attr("width","100").attr("height","100")
            .insertAfter(a);
    }


    var dons = "Rapide, Transport,  Adaptation, Excellence, Sauvagerie, Endurance, Bravoure, Régénération, Alternance, Prudence, Ingéniosité";
    dons = dons.split(",");

    a = $("<p/>").insertAfter(a);
    for(k=0;k<dons.length;k++) {
        let don = dons[k].trim();
        getDon(don,a);
    }
}

function getDon(don,a) {
    $.get("https://tournoi.kigard.fr/aide_public.php?id="+don+"&type=don", function(data) {
        a=$("<div/>")
            .append( $("<strong/>").text(don) )
            .append( $(data).find("div.description") )
            .insertAfter(a);
    });
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

    //move the inventory back to root
    $("#menu li:contains(Profil)").after($("#menu li:contains(Profil) li:contains(Inventaire)").detach().addClass("parent"))
    //change the entry for the list of pj
    $("#menu li a:contains(Personnages)").attr("href","index.php?p=liste_pj").removeAttr("class")
    $("#menu li a:contains(Clans)").attr("href","index.php?p=liste_clan").removeAttr("class")

    // one direct link to every mule
    // for(var j=0;j<mules_id.length;j++) {
    // 	let name = mules_name[j];
    // 	if(name=="Mulet") name += " " + mules_id[j];
    // 	$("#menu li.parent:contains(Inventaire)").append(
    // 		$("<ul/>").append(
    // 			$("<a/>").attr("href","index.php?p=gestion_stock&id_monstre=" + mules_id[j])
    // 				.append( $("<img/>").attr("src","images/vue/monstre/37.gif").attr("class","elements") )
    // 				.append( " " + name  ) ) );
    // }
    // one link to the complete inventory that will be built
    // $("#menu a.parent:contains(Inventaire) ~ ul").append(
    // 		$("<li/>").append(
    // 			$("<a/>").attr("href","index.php?p=InventaireComplet")
    // 				.append( $("<img/>").attr("src","images/items/37.gif").attr("class","elements") )
    // 				.append( " Complet " ) ) );
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

function statsTirage() {
    let cnt=0, sumtotreg=0, sumtotextra=0;
    $("#historique tr").each( function () {
        let sumreg=0, reg=0;
        let sumextra=0, extra=0;
        $(this).find("i[class*='fa-solid fa-dice']").each( function() {
            if( $(this).parent().siblings().text().includes("active son tour") ) {
                reg = 1;
                switch( $(this).attr("class").split("-")[3] ) {
                    case "one":
                        sumreg = sumreg+1;
                        break;
                    case "two":
                        sumreg = sumreg+2;
                        break;
                    case "three":
                        sumreg = sumreg+3;
                        break;
                    case "four":
                        sumreg = sumreg+4;
                        break;
                    case "five":
                        sumreg = sumreg+5;
                        break;
                    case "six":
                        sumreg = sumreg+6;
                        break;
                }
            }
        });
        if(reg) {
            cnt = cnt+1;
            sumtotreg = sumtotreg+sumreg;
        }
        $(this).find("i[class*='fa-regular fa-dice']").each( function() {
            if( $(this).parent().siblings().text().includes("active son tour") ) {
                extra = 1;
                switch( $(this).attr("class").split("-")[3] ) {
                    case "one":
                        sumextra = sumextra+1;
                        break;
                    case "two":
                        sumextra = sumextra+2;
                        break;
                    case "three":
                        sumextra = sumextra+3;
                        break;
                    case "four":
                        sumextra = sumextra+4;
                        break;
                    case "five":
                        sumextra = sumextra+5;
                        break;
                    case "six":
                        sumextra = sumextra+6;
                        break;
                }
            }
        });
        if(extra) {
            sumtotextra = sumtotextra+sumextra;
        }
        if( sumreg>0 ){
            $(this).find("td:nth-last-child(1)").append( $("<span/>").attr("style","margin-left:5px;font-size:0.8em;")
                                                        .append( $("<b/>").append(`${sumreg+sumextra}`) )
                                                        .append( $("<img/>").attr("src","images/interface/pa.gif").attr("width","12").attr("class","pa").attr("alt","PA").attr("title","Points d'Action").attr("style","margin-left:2px;") ) )
        }
    })
    if( sumtotreg ) {
        $("div.label").append( $("<div/>").attr("style","margin-left:10px;")
                              .append( $("<b/>").attr("style","font-size:.8em")
                                      .append(`${((sumtotreg+sumtotextra)/cnt).toFixed(1)}`)
                                      .append( $("<img/>").attr("src","images/interface/pa.gif").attr("width","12").attr("class","pa").attr("alt","PA").attr("title","Points d'Action").attr("style","margin-right:3px;margin-left:1px;") )
                                      .append(`(${(sumtotreg/cnt).toFixed(1)}+${(sumtotextra/cnt).toFixed(1)})`) ) )
    }

}


function parseHisto() {


    //Techniques:
    let dicTechniques = {
        "Attaque hypnotique": ["attaque hypnotiquement"], // Attaque hypnotique
        "Attaque mystique": ["attaque mystiquement"],   // Attaque mystique
        "Attaque puissante": ["attaque puissamment"],    // Attaque puissante
        "Attaque précise": ["attaque précisément"],    // Attaque precise
        "Attaque sournoise": ["attaque sournoisement"],  // Attaque sournoise
        "Coup de bouclier": ["coup de bouclier"],        // Coup de bouclier
        Exécuter: ["exécute", "tente d'exécuter"], // Exécuter
        Enchaîner: ["enchaîne"],               // Enchaîner
        "Lancer un projectile": ["lance un projectile"],     // Lancer un projectile
        Charger: ["charge"],                  // Charger
        Disparaître: ["disparaît "],               // Disparaître
        Incanter: ["utilise Incanter"],                 // Incanter
        "Lire l'avenir": ["lit l'avenir"],            // Lire l'avenir
        "Poser un piège": ["pose un piège"],           // Poser un piège
        Sacrifice: ["réalise un sacrifice rituel"],               // Sacrifice
        "Subterfuge mystique": ["se renforce mystiquement"], // Subterfuge mystique
        Protéger: ["protège"],                 // Protéger
        Riposter: ["riposte"],                // Riposter
        "Recherche intuitive": ["utilise Recherche intuitive"],
        "Bond athlétique": ["utilise Bond athlétique"]
    }

    //Sorts:
    let dicSorts = {
        "Boule de feu": ["envoie une boule de feu"], // Boule de feu
        Congélation: ["congèle","a essayé de congeler", "bloc de glace"],
        "Drain de vie": ["envoie un drain de vie"],
        Entrave: ["entrave"], // ????????????????
        Envoûtement: ["xcxcxcxc"],
        Foudre: ["foudre"], // ????????????????
        Incinération: ["cxcxcxcxc"],
        Jugement: ["xcxcxcxc"],
        "Lance de cristal": ["xcxcxcxc"],
        Maléfice: ["maudit"],
        Piqûre: ["xcxcxcxc"],
        "Rafale de givre": ["Rafale de givre"],
        Subversion: ["xcxcxcxcx"],
        Télékinésie: ["fait léviter"],
        Téléportation: ["téléporte"],
        "Vol de magie": ["vole la magie", "a essayé de voler la magie"],
        Dévotion: ["renforce pour le combat"],
        Exaltation: ["xcxcxcxcx"],
        Guérison: ["Guérison"],
        Instinct: ["aiguise l'instinct"],
        Purification: ["purifie"],
        "Mur de cristal": ["mur de cristal"], // ??????????
        "Mur de ronces": ["sortir des ronces"],
        Invocation: ["invoque"],
        "Réveil morbide": ["relève"],
        "//": ["échange ses armes"]
    }


    // Autres :
    // - Lien avec XXX : soutient XXX
    // - Chanter : chante pour
    // - Danser : danse pour */




    if( $("table[id=historique]") ) {

        let entite = $("div.description").find("a");
        let thename, thetype;
        if( entite.length > 0 ) {
            thename = entite.eq(0).text().split(" ")[0];
            if( thename == "" ) thename = entite.eq(0).text().split(" ")[1]; // for Itotia :/
            thetype = entite.eq(0).attr("href").split("type=")[1];
        }
        else {
            thename = myname;
            thetype = "autre";
        }

        let pj_list=[];
        let monster_list=[];

        var i;
        let techs_list = [];
        let techs = Object.keys(dicTechniques);
        $("table[id=historique]>tbody>tr>td:nth-child(2)").each( function() {
            let actor = $(this).find("a").first().text()
            for(i=0;i<techs.length;i++) {
                let stringToFind = dicTechniques[techs[i]];
                let match = stringToFind.map(x=>$(this).text().includes(x));
                if( match.some(Boolean) ) {
                    if( !techs_list.includes(techs[i]) && actor.includes(thename) ) techs_list.push(techs[i])
                }
            }
        });
        let sorts_list = [];
        let sorts = Object.keys(dicSorts);
        $("table[id=historique]>tbody>tr>td:nth-child(2)").each( function() {
            let actor = $(this).find("a").first().text()
            for(i=0;i<sorts.length;i++) {
                let stringToFind = dicSorts[sorts[i]];
                let match = stringToFind.map(x=>$(this).text().includes(x));
                if( match.some(Boolean) ) {
                    if( !sorts_list.includes(sorts[i]) && actor.includes(thename) ) sorts_list.push(sorts[i])
                }
            }
        });
        $("table[id=historique]>tbody>tr").each( function() {
            let a = $(this).find("td").eq(1);
            let b = $(a).find("a");
            let test = 0;
            b.each(function() {
                let name = $(this).text();
                if( !name.includes(thename) ) {
                    if( $(this).attr("href").split("type=")[1] == "pj" && !pj_list.includes(name) ) pj_list.push(name);
                    if( !name.includes("Cheval") && !name.includes("Mulet") && !a.text().includes("entend") ) {
                        test = 1;
                        if( $(this).attr("href").split("type=")[1] == "monstre" && !monster_list.includes(name) ) monster_list.push(name);
                    }
                }
            });
            if (test==1) $(this).css("background-color",mylilac) // .attr("style","background-color:#AABBDD");
            if (!(b.eq(0).text().includes(thename)) ) $(this).css("background-color",myrose) // .attr("style","background-color:#DDAABB");
        });
        // console.log(pj_list)
        // console.log(monster_list)
        // console.log(sorts_list)
        // console.log(techs_list)

/*         if(!window.mobileCheck()) {

            if( thename!=myname ) {
                // $("img.position").prev().remove()
                $("div.description>a").filter( function() { return $(this).text().includes("Parler") } ).prev().before( $("<br//>") );
                $("div.description")
                    .append( $("<br/>") )
                    .append( $("<img/>").attr("src","images/interface/puce.gif") )
                    .append( $("<a/>").text( "Informations issues des logs " ) //details_logs_shown ? "Masquer les détails" : "Montrer les détails" )
                            .attr("href","#").attr("id","toggleLinkLogs")
                            .on("click",toggleDetails) )
                    .append( "&nbsp;", $("<i/>").attr("class",details_logs_shown ? "fa fa-chevron-down" : "fa fa-chevron-right") );
            }

            //             $("h3").eq(1)
            //                 .append( $("<span/>").attr("style","margin-left:20px;font-size:x-small")
            //                         .append( $("<a/>").attr("id","toggleLinkLogs").attr("href","#")
            //                                 .text( details_logs_shown ? "Masquer les détails" : "Montrer les détails")
            //                                 .on("click",toggleDetails) ) );

            $("<div/>").attr("id","detailsLogs").attr("style","font-size:smaller;line-height:1.1em;").insertAfter($("h3").eq(1));

            let interactionsPJ = $("<div/>").attr("id","lstPJs").attr("style","margin-top:5px;margin-bottom:10px;").append( $("<span/>").attr("style","font-style:italic;").text("Interactions avec : ") );
            for(i=0; i<pj_list.length; i++) {
                interactionsPJ.append( $("<a/>").attr("href","#").text(pj_list[i]).on("click",scrollToID) );
                if(i<pj_list.length-1) interactionsPJ.append(", ");
            }
            if(pj_list.length==0) interactionsPJ.append( $("<span/>").attr("style","font-weight:bold;").text("-") );
            $("#detailsLogs").append(interactionsPJ);

            let interactionsMonstres = $("<div/>").attr("id","lstMonstres").attr("style","margin-top:5px;margin-bottom:10px;").append( $("<span/>").attr("style","font-style:italic;").text("Monstres croisés : ") );
            for(i=0; i<monster_list.length; i++) {
                interactionsMonstres.append( $("<a/>").attr("href","#").text(monster_list[i]).on("click",scrollToID) );
                if(i<monster_list.length-1) interactionsMonstres.append(", ");
            }
            if(monster_list.length==0) interactionsMonstres.append( $("<span/>").attr("style","font-weight:bold;").text("-") );
            $("#detailsLogs").append(interactionsMonstres);

            let techniques = $("<div/>").attr("id","lstTechs").attr("style","margin-top:5px;margin-bottom:10px;").append( $("<span/>").attr("style","font-style:italic;").text("Techniques utilisées : ") );
            for(i=0; i<techs_list.length; i++) {
                techniques.append( $("<a/>").attr("href","#").text(techs_list[i]).on("click",scrollToTech) );
                if(i<techs_list.length-1) techniques.append(", ");
            }
            if(techs_list.length==0) techniques.append( $("<span/>").attr("style","font-weight:bold;").text("-") );
            $("#detailsLogs").append(techniques);

            let sorts = $("<div/>").attr("id","lstSorts").attr("style","margin-top:5px;margin-bottom:10px;").append( $("<span/>").attr("style","font-style:italic;").text("Sorts utilisés : ") );
            for(i=0; i<sorts_list.length; i++) {
                sorts.append( $("<a/>").attr("href","#").text(sorts_list[i]).on("click",scrollToSort) );
                if(i<sorts_list.length-1) sorts.append(", ");
            }
            if(sorts_list.length==0) sorts.append( $("<span/>").attr("style","font-weight:bold;").text("-") );
            $("#detailsLogs").append(sorts);

            if(!details_logs_shown ) $("#detailsLogs").hide();
            if(thetype=="monstre") {
                //                 $("#lstTechs").hide();
                //                 $("#lstSorts").hide();
                $("#lstMonstres").hide();
            }

            if(thename==myname) {
                $("#detailsLogs").hide();
                $("#toggleLinkLogs").hide();
            }

            function scrollToID() {
                let line_to_scroll_to;
                let id = $(this).text();
                $("table[id=historique]>tbody>tr").each(function() {
                    let log = $(this).find("td").eq(1);
                    if ( log.text().includes(id) ) {
                        line_to_scroll_to = log;
                        return false;
                    }
                });
                let container = document.getElementById("histo");
                container.scrollTop = line_to_scroll_to[0].offsetTop;
            };

            function scrollToTech() {
                let line_to_scroll_to;
                let tech = $(this).text();
                $("table[id=historique]>tbody>tr").each(function() {
                    let log = $(this).find("td").eq(1);
                    let matchTechs = dicTechniques[tech].map(x=>log.text().includes(x));
                    if ( matchTechs.some(Boolean) ) {
                        line_to_scroll_to = log;
                        return false;
                    }
                });
                let container = document.getElementById("histo");
                container.scrollTop = line_to_scroll_to[0].offsetTop;
            };

            function scrollToSort() {
                let line_to_scroll_to;
                let sort = $(this).text();
                $("table[id=historique]>tbody>tr").each(function() {
                    let log = $(this).find("td").eq(1);
                    let matchSorts = dicSorts[sort].map(x=>log.text().includes(x));
                    if ( matchSorts.some(Boolean) ) {
                        line_to_scroll_to = log;
                        return false;
                    }
                });
                let container = document.getElementById("histo");
                container.scrollTop = line_to_scroll_to[0].offsetTop;
            };

            function toggleDetails() {
                if( details_logs_shown ) {
                    $("#detailsLogs").hide();
                    $("#toggleLinkLogs").next().attr("class","fa fa-chevron-right")
                    details_logs_shown = false;
                    localStorage.setItem('details_logs_shown',false);
                }
                else {
                    $("#detailsLogs").show();
                    if(thetype!="pj") {
                        $("#lstTechs").hide();
                        $("#lstSorts").hide();
                        $("#lstMonstres").hide();
                    }
                    $("#toggleLinkLogs").next().attr("class","fa fa-chevron-down")
                    details_logs_shown = true;
                    localStorage.setItem('details_logs_shown',true);
                }
            }


            let histo = $("table[id=historique]").get();
            let h = Math.max(window.innerHeight-800,380);
            $("<section/>").attr("id","histo").attr("style","height:"+ h +"px;overflow:auto;").append(histo).insertAfter($("#detailsLogs"));  //scroll-padding-top:100px
            //$("table[id=historique]>tbody").attr("style","height:"+ h +"px;overflow:auto;");

            $("<tbody/>").append( $("<tr/>").append( $("<td/>").attr("width","275px").attr("class","fonce").text("Date") )
                                 .append( $("<td/>").attr("width","705px").attr("class","fonce").text("Evénement") ) )
                .insertBefore( $("#histo") );
            $("table[id=historique]").find("tr").eq(0).remove();
            let oldstyle = $("table[id=historique]").attr("style");
            $("table[id=historique]").attr("style",oldstyle+";margin:0");
        } */
    }

   // $("#detailsLogs").insertAfter( $("#bloc") )
}

function parseMonsterLogs() {
    let object = $("div.description>a").first();
    let name = object.text().split(' (')[0];
    let temp = object.attr("href").split('id=')[1].split('&type=');
    let id = temp[0];
    let type = temp[1];

    if ( type == "monstre" )
    {
        let list_monsters = (t=localStorage.getItem("list_monsters")) ? t.split(',').map(Number) : [];
        let time_array = (list_monsters.includes(id)) ? localStorage.getItem(id).split(',').map(Number) : [];
        console.log( name, id, type)

        $($("table[id=historique]>tbody>tr>td.date_historique").get().reverse()).each( function() {

            let timeString = $(this).text();
            let time = convertDate(timeString);
            let log = $(this).next().text();


            if( log.split(' (')[0] == name ) {
                //   console.log(timeString,time, log);
                if (time_array.length==0) time_array.push(time);
                else {
                    if( !time_array.includes(time) ) time_array.push(time);
                }
            }
        })

        console.log(time_array);
        localStorage.setItem(id,time_array);
        if( !(list_monsters.includes(id)) ) list_monsters.push(id);
        localStorage.setItem("list_monsters",list_monsters);

        let tour_array = [];
        tour_array[0] = NaN;
        for (var i=1;i<time_array.length;i++){
            tour_array.push( (time_array[i]-time_array[i-1])/(1000*60*60) );
            console.log(time_array[i],tour_array[i]);
        }
    }
}

function getClanPAs( dict) {
    $.get("https://tournoi.kigard.fr/index.php?p=clan&g=membres", function(data) {
        $(data).find("table tbody tr").each( function() {
            dict[ $(this).find("a").text().trim() ] = $(this).find("td[data-title=PA]").text().trim()
        });
    });
}


function sum(a) {var sum = 0; for (var i = 0; i < a.length; i++) sum += a[i]; return sum;}


function logPVMonster( linkDOM, index) {
    var link = $(linkDOM).attr("href")
    var name = $(linkDOM).text()
    $.get(link).done(function (data) {
        var list_pv = []
        var list_id = []
        var hour = -1, min;
        var now = new Date()
        $(data).find("#historique tr").each( function(index) {
            var actor = $(this).find("td:nth-child(2) a:nth(0)").text()
            var target = $(this).find("td:nth-child(2) a:nth(1)").text()
            if( actor ) {
                var actor_id = $(this).find("td:nth-child(2) a:first").attr("href").split("id=")[1].split("&type")[0]
                var pvtemp = $(this).find("td:nth-child(3)").text().split(" PV")[0].split(" ")
                var pv = Number(pvtemp[pvtemp.length-1])
                // console.log(pv)
                if( actor!="" && !isNaN(pv) ) {
                    if( !name.includes(actor) || ( name.includes(actor) && target=="" ) ) {
                        list_id.push(actor_id)
                        list_pv.push(pv)
                    }
                }
            }
            if( actor!="" && name.includes(actor) && hour==-1 ) {
                let time_txt = $(this).find("td:nth-child(1)").text()
                hour = Number(time_txt.split("h")[0])
                min = Number(time_txt.split("h")[1])
            }
        });
        var pvloss = sum(list_pv)
        if( pvloss < 0 ) {
            $("#"+index+"PVloss").text( String(pvloss)+" " )
            $("#"+index+"PVicon").show()
            if ( $(data).find("#historique tr:last").text().includes("quitte") ) {
                $("#"+index+"nidicon").hide()
            }
            else {
                //$("#"+index+"nidicon").attr("class","fa-regular fa-house-circle-xmark").attr("style","color:red;")
                $("#"+index+"nidicon").show()
            }
        }
        var next_turn = (hour+9)%24 + min/60
        now = now.getHours()+now.getMinutes()/60
        if( now>next_turn && (now-next_turn)<15 ) {
            $("#"+index+"time").text( "av."+String((hour+15)%24).padStart(2,'0')+"h"+String(min).padStart(2,'0') )
            $("#"+index+"clock").attr("class","fa-regular fa-clock").attr("style","margin-right:2px;color:"+myred).show()
        }
        else {
            $("#"+index+"time").text( "ap."+String((hour+9)%24).padStart(2,'0')+"h"+String(min).padStart(2,'0') )
            $("#"+index+"clock").show()
        }

    });
}

function logIDPJ( linkDOM, last) {
    var link = $(linkDOM).attr("href")
    $.get(link).done(function (data) {
        var name = $(data).find("div.description a.profil_popin").text()
        var id = $(data).find("div.description a.profil_popin").attr("href").split("id=")[1].split("&")[0]
        $(linkDOM).attr("id",id)
        if(last) {
            var diplo = JSON.parse(localStorage.getItem("diploPJ"))
            $("a.in-radar").each( function() {
                var code = diplo[$(this).attr("id")]
                switch(code) {
                    case 0:
                        $(this).css("color",mygreen)
                        break;
                    case 2:
                        $(this).css("color",myred)
                        break;
                }
            });
        }
    });
}


function radarVue() {

    $.get("https://tournoi.kigard.fr/index.php?p=clan&g=membres").done( function(data) {
        $(data).find("table tbody tr").each( function() {
            let name = $(this).find("a").text().trim()
            let nbPAs = $(this).find("td[data-title=PA]").text().trim()
            let tour = $(this).find("td[data-title=Tour]").text().trim()
            let pvs = $(this).find("div.barre_pv span").text()
            let pvloss = pvs.split(" /")[0].split(": ")[1] - pvs.split("/ ")[1]
            $("#"+name+"PAtxt").text( nbPAs )
            $("#"+name+"time").text( tour )
            $("#"+name+"PAimg").show()
            $("#"+name+"clock").show()
            if( pvloss<0 ) {
                $("#"+name+"PVloss").text( String(pvloss) )
                $("#"+name+"PVicon").show()
            }
        });
    });

    $.get("https://tournoi.kigard.fr/index.php?p=empathie").done( function(data) {
        $(data).find("table tbody td.fonce a.profil_popin[href*=pj]").each( function() {
            let name = $(this).text().trim()
            let nbPAs = $(this).parent().parent().parent().next().find("p:contains('PA : ')").text().split(" : ")[1].trim()
            let tour = $(this).parent().parent().parent().next().find("p:contains('Tour : ')").text().split(" : ")[1].trim()
            let pvs = $(this).parent().parent().parent().next().find("div.barre_pv span").text()
            let pvloss = pvs.split(" /")[0].split(": ")[1] - pvs.split("/ ")[1]
            $("#"+name+"PAtxt").text( nbPAs )
            $("#"+name+"time").text( tour )
            $("#"+name+"PAimg").show()
            $("#"+name+"clock").show()
            if( pvloss<0 ) {
                $("#"+name+"PVloss").text( String(pvloss) )
                $("#"+name+"PVicon").show()
            }
        });
    });

    let text = "";
    // if( $("h3").first().text().includes("vue") ) text = "Dans votre vue: ";
    // else text = "Dans cette arène: ";

    let top = $("table.vue>tbody>tr").first().find("td").first().text()
    let left = $("table.vue>tbody>tr").last().find("td").eq(1).text()
    let persos = $("table.vue>tbody>tr>td>a>img[src*='pj']").filter(function(index){
        return ( !$(this).parent().find("span.titre").eq(0).text().includes(myname) );
    });
    let sp = (persos.length>1) ? "s" : ""
    let monstres = $("table.vue>tbody>tr>td>a>img[src*='monstre']").filter(function(index){
        return ( !$(this).attr("src").includes("/17.gif") && !$(this).attr("src").includes("/37.gif") );
    });
    let sm = (monstres.length>1) ? "s" : ""

    let taille_liste = ((persos.length+monstres.length)>55) ? "xx-small" : "normal";
    let interligne = ((persos.length+monstres.length)>55) ? "70%" : "100%";

    // $("h3").first().filter( function() {return ( $(this).text().includes("vue") || $(this).text().includes("Arène") )})
    //     .append( $("<span/>").attr("style","margin-left:20px;font-size:x-small")
    //             .append( $("<a/>").attr("id","toggleLinkVue").attr("href","#")
    //                     .text( details_vue_shown ? "Cacher le radar" : "Montrer le radar")
    //                     .on("click",toggleDetails) ) );
    // $("<div/>").attr("id","textRadarPJ").attr("style","text-align: left; font-style:italic; margin-top: 0px; margin-bottom: 15px;z-index:0")
    //     .append( $("<span/>").text(persos.length + " personnage" + sp + " :"))
    //     .appendTo( $("#radarContent") );

    $("<div/>").attr("id","listRadarPJ").appendTo( $("#radarContent") );
    $("#listRadarPJ").append($("<br/>"));
    $.each( persos, function(index, value) {
        let name = $(this).parent().find("span.titre").eq(0);
        // let pvtext = $(this).parent().find("div.mini_barre_pv").attr("title");
        let clan = name.next().text();
        let linkDOM = $(this).parent().clone();
        name = name.text().trim()
        linkDOM.removeAttr("class").text(clan + " " + name)
        linkDOM.on("mouseenter",highlightCase).on("mouseleave",unhighlightCase)
        linkDOM.css("font-size",taille_liste)
        linkDOM.css("line-height",interligne)
        linkDOM.attr("class","in-radar")
        $("#listRadarPJ").append(linkDOM)
        // if ( pvtext ) {
        //     let pvmax = Number(pvtext.split("/")[1])
        //     let pv = Number(pvtext.split("/")[0].split(" ")[1])
        //     let pvpct = (100.*pv/pvmax).toFixed(0);
        //     $("#listRadarPJ").append( $("<div/>")
        //                            .attr("class","mini_barre_pv").attr("title",pvtext)
        //                            .attr("style","transform: rotate(90deg);left: 8px;bottom: -2px;")
        //                            .append( $("<img/>").attr("src","images/interface/mini_barre_pv.gif").css("height",String(pvpct)+"%") ) )
        // }
        $("#listRadarPJ").append( $("<span/>").attr("style","margin-left:8px;font-size:0.8em;")
                               .append( $("<b/>").attr("id",name+"PAtxt") )
                               .append( $("<img/>").attr("id",name+"PAimg").attr("src","images/interface/pa.gif").attr("width","12").attr("class","pa").attr("alt","PA").attr("title","Points d'Action").attr("style","margin-left:2px;").hide() )
                               .append( $("<i/>").attr("id",name+"clock").attr("class","fa-regular fa-clock").attr("style","margin-right:2px;margin-left:8px").hide() )
                               .append( $("<b/>").attr("id",name+"time") )
                               .append( $("<i/>").attr("id",name+"PVicon").attr("class","fa-solid fa-heart-crack")
                                       .css("margin-right","2px").css("margin-left","8px").css("color",myred)
                                       .hide() )
                               .append( $("<b/>").attr("id",name+"PVloss") ) ) //.css("color",myred) ) )
        $("#listRadarPJ").append($("<br/>"));
        logIDPJ(linkDOM, (index==(persos.length-1))?true:false)
    });
    $("#listRadarPJ").append($("<br/>"));

    // $("<div/>").attr("id","textRadarMonstre").attr("style","text-align: left; font-style:italic; margin-top: 0px; margin-bottom: 15px;z-index:0")
    //     .append( $("<span/>").text(monstres.length + " monstre" + sm + " :"))
    //     .appendTo( $("#radarContent") );

    $("<div/>").attr("id","listRadarMonstre").appendTo( $("#radarContent") );
    $.each( monstres, function(index, value) {
        let name = $(this).parent().find("span.titre").eq(0);
        let linkDOM = $(this).parent().clone();
        linkDOM.removeAttr("class").text( name.text() );
        linkDOM.on("mouseenter",highlightCase).on("mouseleave",unhighlightCase)
        linkDOM.css("font-size",taille_liste)
        linkDOM.css("line-height",interligne)
        $("#listRadarMonstre").append( linkDOM ) //.css("color","#AA3311") )
        $("#listRadarMonstre").append( $("<span/>").attr("style","margin-left:10px;font-size:0.8em;")
                               .append( $("<i/>").attr("id",index+"clock").attr("class","fa-regular fa-clock").attr("style","margin-right:2px").hide() )
                               .append( $("<b/>").attr("id",index+"time") )
                               .append( $("<i/>").attr("id",index+"PVicon").attr("class","fa-solid fa-heart-crack")
                                       .css("margin-right","2px").css("margin-left","8px").css("color",myred)
                                       .hide() )
                               .append( $("<b/>").attr("id",index+"PVloss") )
                               .append( $("<i/>").attr("id",index+"nidicon").attr("class","fa-regular fa-triangle-exclamation").attr("style","margin-left:2px").attr("style","color:orange;").hide() ) )
        $("#listRadarMonstre").append($("<br/>"))
        logPVMonster(linkDOM, index);
    });
    $("#listRadarMonstre").append($("<br/>"))

    // let max_width = 0;
    // $("#listRadar>a").each( function() {
    //     if($(this).width()>max_width) max_width=$(this).width();
    // });
    // let list_width = Math.min(max_width,290);
    // $("#listRadar>a").each( function() {
    //     let trunk = Math.ceil($(this).text().trim().length * ($(this).width()/list_width-1) );
    //     if( trunk>0 ) $(this).text( $(this).text().trim().slice(0,-trunk)+"..." );
    // });
    // $("#listRadar").attr("style","float:right;width:300px;text-align: left; font-style:normal;margin-bottom:0px");
    // $("div.vue").css("float","center")
    // if(!details_vue_shown) {
    //     $("#listRadar").hide();
    //     $("#textRadar").hide();
    // }
    // else $("div.description_vue").css("left",String(list_width+20+346)+"px");

    function highlightCase() {
        let href = $(this).attr("href");
        let x,y;
        if( href=="#" ) { // si case sélectionnée on récupère les coordonnées dans la description
            let coord = $("div.description").text().split("X:")[1];
            x = coord.split(" | ")[0];
            y = coord.split("Y:")[1].split(" ")[0];
        }
        else {
            x = Number(href.split("x=")[1].split("&")[0]);
            y = Number(href.split("y=")[1].split("&")[0]);
        }

        let i = top-y;
        let j = x-left+1;
        // probleme avec kicarte chez Naly ?
        /*         if( $("td.kcOutline").length>0 ) {
            i++;
            j++;
        } */
        let pastille = $("<div/>").attr("id","pastille").attr("style","z-index: 2; width: "+String(vue_x2?36:18)+"px; height: "+String(vue_x2?36:18)+"px; text-align: center; position: absolute; font-size: 1em; background: "+myred+"88;"+
                                                              "color: gold; border-radius: 0px; bottom: -"+String(vue_x2?36:18)+"px; pointer-events: none; border: 0px solid red; font-family: monospace;").text(" ");
        $("table.vue>tbody>tr").eq(i).find("td").eq(j).find("a").first().append( pastille );
    }

    function unhighlightCase() {
        $("#pastille").remove();
    }

    // function toggleDetails() {
    //     if($("#listRadar").is(":visible")) {
    //         $("#listRadar").hide();
    //         $("#textRadar").hide();
    //         $("#toggleLinkVue").text("Montrer le radar");
    //         details_vue_shown = false;
    //         localStorage.setItem('details_vue_shown',false);
    //         $("div.description_vue").css("left","346px")
    //     }
    //     else {
    //         $("#listRadar").show();
    //         $("#textRadar").show();
    //         $("#toggleLinkVue").text("Cacher le radar");
    //         details_vue_shown = true;
    //         localStorage.setItem('details_vue_shown',true);
    //         $("div.description_vue").css("left",String(list_width+20+346)+"px")
    //     }
    // }




}


function navigateArenas() {



    function test123() {
        console.log("I'm here")
        let name = $("#msdrpdd20_titletext").text();
        let pos = parsePositionArena(name);
        let id = getArenaID(pos);
        let coord = getArenaCenter(id);
        window.location.href = "https://tournoi.kigard.fr/index.php?p=arene&id_arene=" + id + "&clic_x=" + coord[0] + "&clic_y=" + coord[1] + "&clic_z=0";
        let index = list_arenas.indexOf(id);
        localStorage.setItem('last_arena',index);
    }

    let name = $("#msdrpdd20_titletext").text();
    $("h3").eq(0).text(name.split("[")[0])
    console.log(name)
    let pos = parsePositionArena(name);
    let id = getArenaID(pos);
    let index = list_arenas.indexOf(id);


    //     let old_index = ~~localStorage.getItem('last_arena');
    //     let old_id = list_arenas[old_index];
    //     if(old_id != id ) {
    //         let coord = getArenaCenter(old_id);
    //         window.location.href = "https://tournoi.kigard.fr/index.php?p=arene&id_arene=" + old_id + "&clic_x=" + coord[0] + "&clic_y=" + coord[1] + "&clic_z=0";
    //         localStorage.setItem('last_arena',old_index);
    //     }






    //link = "https://tournoi.kigard.fr/index.php?p=arene&id_arene=" 1147&clic_x=-2&clic_y=3&clic_z=0

    $("#msdrpdd20_msdd").next().remove();
    //     $("#msdrpdd20_msdd").next().attr("type","button");
    //     $("#msdrpdd20_msdd").next().on("click", test123);
    $("div.selection_arene>form>div")
        .append( $("<input/>").attr("id","valider").attr("type","button").attr("value","Valider").attr("style","display: inline-block;vertical-align: top;margin-left: 10px;").on("click", test123) )
        .append( $("<input/>").attr("id","prev").attr("type","button").attr("value","<").attr("style","display: inline-block;vertical-align: top;margin-left: 10px;").on("click", navigatePrev) )
        .append( $("<input/>").attr("id","next").attr("type","button").attr("value",">").attr("style","display: inline-block;vertical-align: top;").on("click", navigateNext) )

    function navigateNext() {
        index++
        if(index==9) index=0;
        let id = list_arenas[index];
        let coord = getArenaCenter(id);
        window.location.href = "https://tournoi.kigard.fr/index.php?p=arene&id_arene=" + id + "&clic_x=" + coord[0] + "&clic_y=" + coord[1] + "&clic_z=0";
        localStorage.setItem('last_arena',index);
    }

    function navigatePrev() {
        index--
        if(index==-1) index=8;
        let id = list_arenas[index];
        let coord = getArenaCenter(id);
        window.location.href = "https://tournoi.kigard.fr/index.php?p=arene&id_arene=" + id + "&clic_x=" + coord[0] + "&clic_y=" + coord[1] + "&clic_z=0";
        localStorage.setItem('last_arena',index);
    }

}



function convertDate(date) {
    let y,m,d;
    let parse = date.split(' ');
    let time = parse[parse.length-1];
    let h = Number(time.split('h')[0]);
    let mm = Number(time.split('h')[1]);

    if(parse[0]=="aujourd'hui") {
        let date = new Date();
        y = date.getFullYear();
        m = date.getMonth();
        d = date.getDate();
    }
    else {
        d = Number(parse[1]);
        switch(parse[2]) {
            case 'janvier': m=0; break;
            case 'février': m=1; break;
            case 'mars': m=2; break;
            case 'avril': m=3; break;
            case 'mai': m=4; break;
            case 'juin': m=5; break;
            case 'juillet': m=6; break;
            case 'août': m=7; break;
            case 'septembre': m=8; break;
            case 'octobre': m=9; break;
            case 'novembre': m=10; break;
            case 'décembre': m=11; break;
        }
        y = Number(parse[3]);

    }

    //console.log(y,m,d,h,mm);
    let res = new Date(y,m,d,h,mm);

    return res.valueOf();

}

// temporary !!!
function showStats() {

    let list_monsters = (t=localStorage.getItem("list_monsters")) ? t.split(',').map(Number) : [];

    let temp=[];
    for(var i=0; i<list_monsters.length; i++) {
        let id = list_monsters[i];
        if( !(temp.includes(id)) ) temp.push(id);
    }

    let a = $("div[id=bloc]>i");

    for(var k=0; k<temp.length; k++) {
        let id = temp[k];
        let time_array = localStorage.getItem(id).split(',').map(Number);
        a=$("<p>"+String(id)+"</p>").insertAfter(a);

        for (var j=1;j<time_array.length;j++){
            let tour = (time_array[j]-time_array[j-1])/(1000*60*60);
            a=$("<p>"+String(tour)+"</p>").insertAfter(a);
        }
        a=$("<p>......................</p>").insertAfter(a);
    }
}




function addGrid() {



    let gridh = $("<div/>").attr("class","grid").attr("style","display: none; z-index: 2; width: " + String(vue_x2?36:18) + "px; height: 1px; text-align: center; position: absolute; font-size: 1em; background: #AAAAAA50;"+
                                                      "color: gold; border-radius: 0px; bottom: -" + String(vue_x2?36:18) + "px; pointer-events: none; border: 0px solid white; font-family: monospace;").text(" ");
    let gridv = $("<div/>").attr("class","grid").attr("style","display: none; z-index: 2; width: 1px; height: " + String(vue_x2?36:18) + "px; text-align: center; position: absolute; font-size: 1em; background: #AAAAAA50;"+
                                                      "color: gold; border-radius: 0px; bottom: -" + String(vue_x2?36:18) + "px; pointer-events: none; border: 0px solid white; font-family: monospace;").text(" ");

    $("table.vue>tbody>tr").find("a").append( gridh, gridv);
    gridon?$(".grid").show():$(".grid").hide();

    $("table.vue>tbody>tr").last().find("td").first()
        .append( $("<input/>").attr("type","checkbox").attr("id","gridon").attr("checked",gridon?true:false) );
    $("#gridon").on( "click", function() {
        $(".grid").toggle()
        gridon = !gridon;
        localStorage.setItem('gridon',gridon);
    });

}

function toggleGrid() {
    console.log("je clique");
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

function getArenaID( arenapos ) {
    let dic = { "-13,-13":"1155", "13,13":"1153", "-44,44":"1140", "-41,-41":"1118", "41,-41":"1137", "41,42":"1142", "-13,13":"1152", "0,0":"1147", "13,-13":"1154"};
    let positions = Object.keys(dic);
    let arena_id = "0000";
    positions.forEach( (pos) => {
        if( pos==arenapos.toString() ) {
            arena_id = dic[pos];
        }
    });
    return arena_id;
}

function getArenaCenter( arenaid ) {
    let dic = { "1155":Array(-13,-13), "1153":Array(13,13), "1140":Array(-44,44), "1118":Array(-41,-41), "1137":Array(41,-41), "1142":Array(41,42), "1152":Array(-13,13), "1147":Array(0,0), "1154":Array(13,-13)};
    let ids = Object.keys(dic);
    let coord = Array(0,0);
    ids.forEach( (id) => {
        if( id==arenaid.toString() ) {
            coord = dic[id];
        }
    });
    return coord;
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
            case 'Une main':
                return 'une-main';
            case 'Deux mains':
                return 'deux-mains';
                // 			case 'Deux mains':
                // 			case 'Deux mains d\'arc':
                // 			case 'Deux mains de fusil':
                // 				return 'deux-mains';
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
    $("#formulas_table td:first-child small:first-of-type").each( function() {
        if( $(this).parent().prop("tagName")!='EM' ) {
            console.log($(this).text())
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
        .append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(136), imageCategory(76), imageCategory(2), imageCategory(24), linkCategory("Une main")) )
    //.append( $("<span/>").append("&nbsp;", puce.clone(), "&nbsp;", imageCategory(2), imageCategory(24), linkCategory("Main gauche")) )
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
