const tbCharacters = ["Scapegoat", "Gunslinger", "Beggar","Bureaucrat","Thief", "Washerwoman", "Librarian", "Investigator", "Chef", "Empath", "Fortune Teller", "Undertaker", "Monk", "Ravenkeeper", "Virgin", "Slayer", "Soldier", "Mayor", "Butler", "(Drunk)*", "Recluse", "Saint", "Poisoner", "Spy", "Scarlet Woman", "Baron", "Imp"];
const snvCharacters = ["Butcher","Bone Collector", "Harlot", "Barista", "Deviant", "Clockmaker", "Dreamer", "Snake Charmer", "Mathematician", "Flowergirl", "Town Crier", "Oracle", "Savant", "Seamstress", "Philosopher", "Artist", "Juggler", "Sage", "Mutant", "Sweetheart", "Barber", "Klutz", "Evil Twin", "Witch", "Cerenovus", "Pit-hag", "Fang Gu", "Vigormortis", "No Dashii", "Vortox"];
const bmrCharacters = ["Apprentice", "Matron", "Voudon", "Judge", "Bishop", "Grandmother", "Sailor", "Chambermaid", "Exorcist", "Innkeeper", "Gambler", "Gossip", "Courtier", "Professor", "Minstrel", "Tea Lady", "Pacifist", "Fool", "Tinker", "Moonchild", "Goon", "Lunatic", "Godfather", "Devils Advocate", "Assassin", "Mastermind", "Zombuul", "Pukka", "Shabaloth", "Po"];

const tbScript = {id:"tb", name: "Trouble Brewing", characters: tbCharacters, travellers: 5, townsfolk: 13, outsiders: 4, minions: 4, demon: 1};
const snvScript = {id:"snv", name: "Sects and Violets", characters: snvCharacters, travellers: 5, townsfolk: 13, outsiders: 4, minions: 4, demon: 4};
const bmrScript = {id:"bmr", name: "Bad Moon Rising", characters: bmrCharacters, travellers: 5, townsfolk: 13, outsiders: 4, minions: 4, demon: 4};
const players = [,,,,,[3,0,1,1],[3,1,1,1],[5,0,1,1],[5,1,1,1],[5,2,1,1],[7,0,2,1],[7,1,2,1],[7,2,2,1],[9,0,3,1],[9,1,3,1],[9,2,3,1]];

var selectedScript = "tb";
var playerCount = 7;
var t;
var o;
var m;
var d;

$(document).ready(function() {
    $("select.script").change(function(){
        selectedScript = $(this).children("option:selected").val();
    });
    $("select.players").change(function(){
        playerCount = $(this).children("option:selected").val();
    });
    $("form").on("submit", function(e){
        e.preventDefault();
        $(".content").empty();
        switch(selectedScript) {
            case "tb":
                script = tbScript;
                break;
            case "snv":
                script = snvScript;
                break;
            case "bmr":
                script = bmrScript;
                break;
            default:
                script = tbScript;
        }
        showTravellers = $('input[name="showTravellers"]:checked').val();

        grim = selectCharacters(script, playerCount);
        selectedTownsfolk = grim[0].sort();
        selectedOutsiders = grim[1].sort();
        selectedMinions = grim[2].sort();
        selectedDemon = grim[3].sort();
        selectedTravellers = grim[4];

        $("h2#script").text(script.name);

        $("div#townsfolk").append("<h3>Townsfolk</h3>");
        selectedTownsfolk.forEach(printTownsfolk);
        
        if(selectedOutsiders.length > 0) { 
            $("div#outsiders").append("<h3>Outsiders</h3>");
            selectedOutsiders.forEach(printOutsiders);
        }
        
        $("div#minions").append("<h3>Minions</h3>");
        selectedMinions.forEach(printMinions);
        
        $("div#demon").append("<h3>Demon</h3>");
        selectedDemon.forEach(printDemon);
        
        if (showTravellers === "true") {
            $("div#travellers").append('<h3><span class="good">Trave</span><span class="evil">llers</h3><p class="smaller">*Alignments are a suggestion only, based on 2:1 good/evil ratio</p>');
            selectedTravellers.forEach(printTravellers);
        }
    });
});

function selectCharacters(script, playerCount) {
    tomd = players[playerCount];
    t = tomd[0];
    o = tomd[1];
    m = tomd[2];
    d = tomd[3];

    allCharacters = script.characters;
    demon = allCharacters.slice(26, 26 + script.demon); shuffleArray(demon);
    minions = allCharacters.slice(22, 22 + script.minions); shuffleArray(minions);
    outsiders = allCharacters.slice(18, 18 + script.outsiders); shuffleArray(outsiders);
    townsfolk = allCharacters.slice(5, 5 + script.townsfolk); shuffleArray(townsfolk);
    travellers = allCharacters.slice(0, script.travellers); shuffleArray(travellers);
    
    demon.splice(0, script.demon - d); 
    modifySetup(demon, "Fang Gu", -1, 1);
    modifySetup(demon, "Vigormortis", 1, -1);

    minions.splice(0, script.minions - m);
    modifySetup(minions, "Baron", -2, 2);
    modifySetup(minions, "Godfather", -1, 1);
    
    outsiders.splice(0, script.outsiders - o);
    modifySetup(outsiders, "(Drunk)*", 1, 0);
    
    townsfolk.splice(0, script.townsfolk - t);

    return [townsfolk, outsiders, minions, demon, travellers];
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function modifySetup(array, character, tMod, oMod) {   
    if (array.includes(character)) {
        if (character == "Vigormortis" && o == 0) return;
        if (character == "Godfather" && Math.random() <= 0.25) {
            tMod = Math.abs(tMod);
            oMod = -Math.abs(oMod);
            if (oMod < 0 && o == 0) return;
        }
        t += tMod;
        o += oMod;
    }
}

function printTownsfolk(characters) {
    $("div#townsfolk").append(characters + "<br>");
}
function printOutsiders(characters) {
    $("div#outsiders").append(characters + "<br>");
}
function printMinions(characters) {
    $("div#minions").append(characters + "<br>");
}
function printDemon(characters) {
    $("div#demon").append(characters + "<br>");
}
function printTravellers(characters) {
    alignment = "good";
    if (Math.random() <= (1/3)) {
        alignment = "evil";
    }
    $("div#travellers").append('<span class="' + alignment + '">' + characters + '</span><br>');
}