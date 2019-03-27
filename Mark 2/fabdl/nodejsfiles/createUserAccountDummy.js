// Expecting the following args as variables in the code
// args: [userid,fname,lname,gender,dob,age,contactno,emailid],

'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('channelboth
');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);

var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

var dummy = [{
	"id": "358804845538",
	"firstname": "Marcel",
	"lastname": "Chataignier",
	"gender": "Male",
	"dob": "09/20/1977",
	"age": 51,
	"contact_number": 9217982187,
	"email_id": "mchataignier0@techcrunch.com",
	"photohash": "O39U743QW0A68G0V",
	"dochash": "L80I678JT1S66I8H"
  }, {
	"id": "699034755048",
	"firstname": "Mathe",
	"lastname": "Dafydd",
	"gender": "Male",
	"dob": "01/09/1972",
	"age": 27,
	"contact_number": 9169459425,
	"email_id": "mdafydd1@narod.ru",
	"photohash": "H12J456OP7M56O8Y",
	"dochash": "R43J355LE1J98J6I"
  }, {
	"id": "458032201534",
	"firstname": "Archaimbaud",
	"lastname": "Dowse",
	"gender": "Male",
	"dob": "07/31/1986",
	"age": 67,
	"contact_number": 9321881839,
	"email_id": "adowse2@accuweather.com",
	"photohash": "W74G872CG6V42T3V",
	"dochash": "T86Y755KL6Z02C2C"
  }, {
	"id": "039054366067",
	"firstname": "Kevina",
	"lastname": "Sickling",
	"gender": "Female",
	"dob": "08/17/1955",
	"age": 27,
	"contact_number": 9701401795,
	"email_id": "ksickling3@addthis.com",
	"photohash": "O05M717HR8F76P2R",
	"dochash": "F35G532TC5K93O9N"
  }, {
	"id": "856254734749",
	"firstname": "Meggy",
	"lastname": "Langstone",
	"gender": "Female",
	"dob": "05/18/1988",
	"age": 52,
	"contact_number": 8419086293,
	"email_id": "mlangstone4@washingtonpost.com",
	"photohash": "M40S208JZ0T27I3I",
	"dochash": "N98I736ZC5O38B6C"
  }, {
	"id": "562435102505",
	"firstname": "Sigrid",
	"lastname": "Vittery",
	"gender": "Female",
	"dob": "01/08/1985",
	"age": 66,
	"contact_number": 8265048395,
	"email_id": "svittery5@slate.com",
	"photohash": "S46R804CZ0L02P2G",
	"dochash": "Z58W169MY9Y00W8X"
  }, {
	"id": "893094423140",
	"firstname": "Merwyn",
	"lastname": "Yokel",
	"gender": "Male",
	"dob": "11/24/1959",
	"age": 31,
	"contact_number": 8305568434,
	"email_id": "myokel6@guardian.co.uk",
	"photohash": "I57T149DS8B60L4I",
	"dochash": "J54Z099AT5C30G4A"
  }, {
	"id": "694772574122",
	"firstname": "Harlene",
	"lastname": "Ogglebie",
	"gender": "Female",
	"dob": "03/28/1974",
	"age": 43,
	"contact_number": 9774542723,
	"email_id": "hogglebie7@ca.gov",
	"photohash": "K78G060VW7C11F7L",
	"dochash": "T52H879US9B02M2I"
  }, {
	"id": "004694264723",
	"firstname": "Margaret",
	"lastname": "Castaignet",
	"gender": "Female",
	"dob": "08/03/1960",
	"age": 41,
	"contact_number": 9788901368,
	"email_id": "mcastaignet8@wunderground.com",
	"photohash": "P62B498XN1X70J4Z",
	"dochash": "I25C748OW4V25E6A"
  }, {
	"id": "862109505835",
	"firstname": "Hinze",
	"lastname": "Capener",
	"gender": "Male",
	"dob": "04/17/1951",
	"age": 39,
	"contact_number": 9916624702,
	"email_id": "hcapener9@google.com.br",
	"photohash": "K29P154IT2F92G6A",
	"dochash": "P61I844ZK2I97T6X"
  }, {
	"id": "709503431498",
	"firstname": "Carla",
	"lastname": "Retallick",
	"gender": "Female",
	"dob": "01/29/1995",
	"age": 64,
	"contact_number": 9266560010,
	"email_id": "cretallicka@army.mil",
	"photohash": "Z16E317EL1K90L8A",
	"dochash": "J21P550WH2R93K4N"
  }, {
	"id": "737493315167",
	"firstname": "Rustin",
	"lastname": "Saffrin",
	"gender": "Male",
	"dob": "11/16/1974",
	"age": 44,
	"contact_number": 9082115806,
	"email_id": "rsaffrinb@bigcartel.com",
	"photohash": "V68C738UR4A02E3H",
	"dochash": "B36V161MI6F19E3G"
  }, {
	"id": "211305192095",
	"firstname": "Samaria",
	"lastname": "Hurdle",
	"gender": "Female",
	"dob": "06/28/1986",
	"age": 32,
	"contact_number": 9717409678,
	"email_id": "shurdlec@europa.eu",
	"photohash": "A26D982AS5X43N3M",
	"dochash": "Q66A288IW6T25D1G"
  }, {
	"id": "785905210557",
	"firstname": "Hilly",
	"lastname": "Kain",
	"gender": "Male",
	"dob": "01/18/1957",
	"age": 35,
	"contact_number": 8002315546,
	"email_id": "hkaind@symantec.com",
	"photohash": "A88L362FR1C96Z4E",
	"dochash": "Z28Q571GQ2L98R2N"
  }, {
	"id": "032804965596",
	"firstname": "Raynard",
	"lastname": "Hriinchenko",
	"gender": "Male",
	"dob": "05/28/1962",
	"age": 31,
	"contact_number": 8738044256,
	"email_id": "rhriinchenkoe@google.pl",
	"photohash": "K22R852GM3D70R6D",
	"dochash": "F69S042IZ8A92L8W"
  }, {
	"id": "517046362030",
	"firstname": "Annemarie",
	"lastname": "Dedon",
	"gender": "Female",
	"dob": "05/15/1991",
	"age": 46,
	"contact_number": 8239150259,
	"email_id": "adedonf@usa.gov",
	"photohash": "B01U346SX2Y65T7T",
	"dochash": "L82N282OV5Y93S8Y"
  }, {
	"id": "642977701165",
	"firstname": "Peyter",
	"lastname": "Markie",
	"gender": "Male",
	"dob": "01/11/1954",
	"age": 48,
	"contact_number": 8373485496,
	"email_id": "pmarkieg@zimbio.com",
	"photohash": "F30D855RS3N48Z2Y",
	"dochash": "O50V647FJ2M29N4P"
  }, {
	"id": "255345390412",
	"firstname": "Martynne",
	"lastname": "Osmint",
	"gender": "Female",
	"dob": "04/27/1956",
	"age": 69,
	"contact_number": 9767156471,
	"email_id": "mosminth@indiegogo.com",
	"photohash": "Q01K430GG9X13I2L",
	"dochash": "M64N611VE5W66W7Z"
  }, {
	"id": "862756851467",
	"firstname": "Fina",
	"lastname": "Morin",
	"gender": "Female",
	"dob": "03/27/1978",
	"age": 50,
	"contact_number": 9745531293,
	"email_id": "fmorini@webnode.com",
	"photohash": "O22P698MV6Z90N2P",
	"dochash": "F31J768GH2W99X8L"
  }, {
	"id": "347111413429",
	"firstname": "Di",
	"lastname": "Mirfield",
	"gender": "Female",
	"dob": "01/26/1987",
	"age": 37,
	"contact_number": 9530589690,
	"email_id": "dmirfieldj@reverbnation.com",
	"photohash": "T76K399NF2U53U5Z",
	"dochash": "L75O015TH9U75A0G"
  }, {
	"id": "656941851932",
	"firstname": "Luce",
	"lastname": "Jansa",
	"gender": "Male",
	"dob": "04/08/1987",
	"age": 39,
	"contact_number": 8906159439,
	"email_id": "ljansak@mozilla.com",
	"photohash": "H98Z537UI9L67A0N",
	"dochash": "T04R521SW3S28S9X"
  }, {
	"id": "735517741918",
	"firstname": "Kristofer",
	"lastname": "Yacob",
	"gender": "Male",
	"dob": "07/26/1963",
	"age": 40,
	"contact_number": 8549376712,
	"email_id": "kyacobl@cbc.ca",
	"photohash": "F40O692UC3B10T1O",
	"dochash": "X86Y222VG2P86C3I"
  }, {
	"id": "935976473504",
	"firstname": "Pablo",
	"lastname": "O'Dee",
	"gender": "Male",
	"dob": "03/01/1964",
	"age": 39,
	"contact_number": 8142333958,
	"email_id": "podeem@about.me",
	"photohash": "S22L303JF8V47Y0E",
	"dochash": "J90H951KJ1W65A8Y"
  }, {
	"id": "649985303306",
	"firstname": "Curt",
	"lastname": "Chillingsworth",
	"gender": "Male",
	"dob": "05/31/1968",
	"age": 60,
	"contact_number": 8081391120,
	"email_id": "cchillingsworthn@wunderground.com",
	"photohash": "Y93E779PQ2P50O8F",
	"dochash": "A35R487XO5Y55I1F"
  }, {
	"id": "294692240282",
	"firstname": "Sandor",
	"lastname": "Westoll",
	"gender": "Male",
	"dob": "09/14/1999",
	"age": 49,
	"contact_number": 8877434052,
	"email_id": "swestollo@youku.com",
	"photohash": "V50R311ES1W55C9X",
	"dochash": "S74V485BH9N60G1P"
  }, {
	"id": "302162596323",
	"firstname": "Barbe",
	"lastname": "Antwis",
	"gender": "Female",
	"dob": "08/12/1981",
	"age": 71,
	"contact_number": 9976452189,
	"email_id": "bantwisp@newsvine.com",
	"photohash": "L84B349UQ9G56S5B",
	"dochash": "B84E075TK7A03L0H"
  }, {
	"id": "784422536625",
	"firstname": "Rochester",
	"lastname": "Marikhin",
	"gender": "Male",
	"dob": "09/08/1993",
	"age": 20,
	"contact_number": 8566349133,
	"email_id": "rmarikhinq@exblog.jp",
	"photohash": "E23U063RX9H62W4O",
	"dochash": "B05K615XJ1W31D7G"
  }, {
	"id": "232635888547",
	"firstname": "Bern",
	"lastname": "Thaller",
	"gender": "Male",
	"dob": "03/28/1971",
	"age": 51,
	"contact_number": 8441851188,
	"email_id": "bthallerr@npr.org",
	"photohash": "I28O997AJ5B21L1X",
	"dochash": "W84B105PM8S63U8J"
  }, {
	"id": "529331660106",
	"firstname": "Kort",
	"lastname": "Oloshkin",
	"gender": "Male",
	"dob": "11/25/1959",
	"age": 21,
	"contact_number": 9506022761,
	"email_id": "koloshkins@lycos.com",
	"photohash": "U77Z630IM2M02X9E",
	"dochash": "R64F053PT3W03U3P"
  }, {
	"id": "184572488978",
	"firstname": "Milly",
	"lastname": "Phizaclea",
	"gender": "Female",
	"dob": "09/11/1972",
	"age": 50,
	"contact_number": 8262119368,
	"email_id": "mphizacleat@behance.net",
	"photohash": "F33M503TX7I14Y8Y",
	"dochash": "H52O214LX8C53Q7H"
  }, {
	"id": "040349809659",
	"firstname": "Charmain",
	"lastname": "Boland",
	"gender": "Female",
	"dob": "07/01/1985",
	"age": 43,
	"contact_number": 9634473074,
	"email_id": "cbolandu@washingtonpost.com",
	"photohash": "T95N340PM4E25U4S",
	"dochash": "U83V518UR3N14X0W"
  }, {
	"id": "627212728385",
	"firstname": "Huntington",
	"lastname": "Jelkes",
	"gender": "Male",
	"dob": "08/10/1953",
	"age": 18,
	"contact_number": 8257664834,
	"email_id": "hjelkesv@bbb.org",
	"photohash": "I61L143QQ6V81I6R",
	"dochash": "P47X422AM5Y90U9Y"
  }, {
	"id": "286524006551",
	"firstname": "Jasmine",
	"lastname": "McNellis",
	"gender": "Female",
	"dob": "01/22/1986",
	"age": 33,
	"contact_number": 8469254278,
	"email_id": "jmcnellisw@examiner.com",
	"photohash": "C70V000CL8J45K2F",
	"dochash": "A05R973WE0W47G0P"
  }, {
	"id": "079781232598",
	"firstname": "Raeann",
	"lastname": "Hubback",
	"gender": "Female",
	"dob": "10/13/1965",
	"age": 29,
	"contact_number": 9166537899,
	"email_id": "rhubbackx@discuz.net",
	"photohash": "N28O572HH6S87E0B",
	"dochash": "A97P903GF4R01Y3E"
  }, {
	"id": "695688831429",
	"firstname": "Raymond",
	"lastname": "Yonnie",
	"gender": "Male",
	"dob": "03/17/1979",
	"age": 63,
	"contact_number": 9763613724,
	"email_id": "ryonniey@businessweek.com",
	"photohash": "I22L248LV1N48N6U",
	"dochash": "O64O447WR4E80O7W"
  }, {
	"id": "485033229234",
	"firstname": "Gallagher",
	"lastname": "Guerreau",
	"gender": "Male",
	"dob": "10/18/1960",
	"age": 21,
	"contact_number": 8582091950,
	"email_id": "gguerreauz@51.la",
	"photohash": "O54A875VZ0P36K8C",
	"dochash": "P15H389SK5M96B9W"
  }, {
	"id": "000914652764",
	"firstname": "Rhianna",
	"lastname": "Corrie",
	"gender": "Female",
	"dob": "12/15/1961",
	"age": 39,
	"contact_number": 8792103046,
	"email_id": "rcorrie10@devhub.com",
	"photohash": "V10O811AP8P56E0J",
	"dochash": "B49I262MV4Z03F6V"
  }, {
	"id": "757182650786",
	"firstname": "Roscoe",
	"lastname": "Burberow",
	"gender": "Male",
	"dob": "05/30/1950",
	"age": 61,
	"contact_number": 9701013496,
	"email_id": "rburberow11@ucsd.edu",
	"photohash": "E53G097OA9E95C5J",
	"dochash": "H74P921QG2S89K5A"
  }, {
	"id": "106659637458",
	"firstname": "Maximilianus",
	"lastname": "Howick",
	"gender": "Male",
	"dob": "08/29/1996",
	"age": 57,
	"contact_number": 8124580997,
	"email_id": "mhowick12@latimes.com",
	"photohash": "N97G653KI0B98O7O",
	"dochash": "J42V107RM3G34O0F"
  }, {
	"id": "942881254702",
	"firstname": "Alyson",
	"lastname": "Canada",
	"gender": "Female",
	"dob": "10/21/1956",
	"age": 28,
	"contact_number": 9390144576,
	"email_id": "acanada13@cafepress.com",
	"photohash": "F11V638BP0Y56L1P",
	"dochash": "L45J241QF4A05E6V"
  }, {
	"id": "966597119507",
	"firstname": "Annie",
	"lastname": "Ferenc",
	"gender": "Female",
	"dob": "05/30/1997",
	"age": 20,
	"contact_number": 8503855796,
	"email_id": "aferenc14@flickr.com",
	"photohash": "U93B482BS6M14Y1P",
	"dochash": "U64Y211MN6R31E4S"
  }, {
	"id": "692218837082",
	"firstname": "Elden",
	"lastname": "Aucutt",
	"gender": "Male",
	"dob": "02/26/1986",
	"age": 19,
	"contact_number": 9720718588,
	"email_id": "eaucutt15@live.com",
	"photohash": "A49C004HJ0O39M6R",
	"dochash": "S82J601VT4J65F8Y"
  }, {
	"id": "448230412286",
	"firstname": "Hanna",
	"lastname": "Greenman",
	"gender": "Female",
	"dob": "02/17/1989",
	"age": 46,
	"contact_number": 9146874225,
	"email_id": "hgreenman16@jimdo.com",
	"photohash": "L07R862IE3C50L1B",
	"dochash": "A58A264GC0I74L7V"
  }, {
	"id": "895514718005",
	"firstname": "Eldredge",
	"lastname": "Mil",
	"gender": "Male",
	"dob": "09/17/1983",
	"age": 51,
	"contact_number": 8985020451,
	"email_id": "emil17@nbcnews.com",
	"photohash": "P26W467TK8W71E3V",
	"dochash": "L36B553YT5Q37I7H"
  }, {
	"id": "792614826047",
	"firstname": "Cristi",
	"lastname": "Logesdale",
	"gender": "Female",
	"dob": "12/11/1963",
	"age": 49,
	"contact_number": 9424390153,
	"email_id": "clogesdale18@desdev.cn",
	"photohash": "V82I767ZR6Q42O3K",
	"dochash": "E45W914ON5O33J7B"
  }, {
	"id": "529455117423",
	"firstname": "Clemmie",
	"lastname": "Hammerstone",
	"gender": "Male",
	"dob": "09/02/1958",
	"age": 29,
	"contact_number": 9009218106,
	"email_id": "chammerstone19@xing.com",
	"photohash": "T81J386BV5D35W5U",
	"dochash": "V46I332ZV0Z07R2U"
  }, {
	"id": "972932565752",
	"firstname": "Brana",
	"lastname": "Jopling",
	"gender": "Female",
	"dob": "06/18/1950",
	"age": 68,
	"contact_number": 9660795427,
	"email_id": "bjopling1a@gov.uk",
	"photohash": "E28G256OM8L35A2O",
	"dochash": "S28F164OK3G46F0G"
  }, {
	"id": "638783273808",
	"firstname": "Anna-diane",
	"lastname": "Hankins",
	"gender": "Female",
	"dob": "04/11/1985",
	"age": 34,
	"contact_number": 9143441124,
	"email_id": "ahankins1b@bravesites.com",
	"photohash": "S34E716YM4P19J6H",
	"dochash": "V43H201WB9M52Q3D"
  }, {
	"id": "282501423324",
	"firstname": "Hilde",
	"lastname": "Lain",
	"gender": "Female",
	"dob": "05/01/1984",
	"age": 23,
	"contact_number": 9985957857,
	"email_id": "hlain1c@narod.ru",
	"photohash": "E30D114AN0M38L5Z",
	"dochash": "A41E213BE8N85S9H"
  }, {
	"id": "508966479073",
	"firstname": "Ripley",
	"lastname": "Edmund",
	"gender": "Male",
	"dob": "03/19/1959",
	"age": 18,
	"contact_number": 8629568628,
	"email_id": "redmund1d@dell.com",
	"photohash": "Q35I814NT7S39R4A",
	"dochash": "Y00T766JY3I48A5B"
  }, {
	"id": "099702644479",
	"firstname": "Norton",
	"lastname": "Garret",
	"gender": "Male",
	"dob": "04/05/1963",
	"age": 45,
	"contact_number": 9016505015,
	"email_id": "ngarret1e@walmart.com",
	"photohash": "S49X384LY9C53G7E",
	"dochash": "C62G253PI3J66F3D"
  }, {
	"id": "775167337519",
	"firstname": "Alberik",
	"lastname": "Lochet",
	"gender": "Male",
	"dob": "01/26/1956",
	"age": 68,
	"contact_number": 9910136848,
	"email_id": "alochet1f@hexun.com",
	"photohash": "Z37E752GC5F54T3D",
	"dochash": "U18W606ZT4U32Y6Q"
  }, {
	"id": "059815277091",
	"firstname": "Audie",
	"lastname": "Cullivan",
	"gender": "Female",
	"dob": "12/21/1991",
	"age": 18,
	"contact_number": 8854918088,
	"email_id": "acullivan1g@purevolume.com",
	"photohash": "D90A043EJ4V09R7F",
	"dochash": "E29G482WU2O53R4N"
  }, {
	"id": "425597477329",
	"firstname": "Reider",
	"lastname": "Tomasino",
	"gender": "Male",
	"dob": "03/02/1958",
	"age": 36,
	"contact_number": 9623811404,
	"email_id": "rtomasino1h@taobao.com",
	"photohash": "I05V010JX2X85K6K",
	"dochash": "J51D586VO0B12W7D"
  }, {
	"id": "927567084555",
	"firstname": "Upton",
	"lastname": "Ambrose",
	"gender": "Male",
	"dob": "04/24/1985",
	"age": 20,
	"contact_number": 9252857474,
	"email_id": "uambrose1i@narod.ru",
	"photohash": "R88V507LY9A38X2T",
	"dochash": "I85B901YI0A51H2X"
  }, {
	"id": "696897411150",
	"firstname": "Davita",
	"lastname": "Elcum",
	"gender": "Female",
	"dob": "08/10/1997",
	"age": 51,
	"contact_number": 9898860479,
	"email_id": "delcum1j@soundcloud.com",
	"photohash": "Y48H780JT0Q12W6M",
	"dochash": "R37L329FK5F67S6C"
  }, {
	"id": "570307214520",
	"firstname": "Simonette",
	"lastname": "Egel",
	"gender": "Female",
	"dob": "05/09/1953",
	"age": 67,
	"contact_number": 8810174262,
	"email_id": "segel1k@imdb.com",
	"photohash": "B88F658TB2N44S9T",
	"dochash": "W42Q734GT6F57R3P"
  }, {
	"id": "171511788846",
	"firstname": "Joyce",
	"lastname": "Blasi",
	"gender": "Female",
	"dob": "10/15/1964",
	"age": 24,
	"contact_number": 8130794508,
	"email_id": "jblasi1l@tripadvisor.com",
	"photohash": "A02P399CU2H13T2A",
	"dochash": "E83L317UI2E61S3X"
  }, {
	"id": "504168617111",
	"firstname": "Brock",
	"lastname": "Judkin",
	"gender": "Male",
	"dob": "11/11/1975",
	"age": 31,
	"contact_number": 8770284726,
	"email_id": "bjudkin1m@dion.ne.jp",
	"photohash": "N03B635NX4F20U7O",
	"dochash": "M41N338WJ4T72S0U"
  }, {
	"id": "120501626099",
	"firstname": "Daryle",
	"lastname": "Friman",
	"gender": "Male",
	"dob": "07/09/1962",
	"age": 50,
	"contact_number": 9766447341,
	"email_id": "dfriman1n@jugem.jp",
	"photohash": "Y62I282QX1H64D0J",
	"dochash": "G04Y824UC9I94D4Z"
  }, {
	"id": "038101466997",
	"firstname": "Frederigo",
	"lastname": "Jeckell",
	"gender": "Male",
	"dob": "01/20/1987",
	"age": 46,
	"contact_number": 9668235777,
	"email_id": "fjeckell1o@woothemes.com",
	"photohash": "S93S808DS9P48J7Z",
	"dochash": "U82N502II8Y67F5H"
  }, {
	"id": "016297598631",
	"firstname": "Gwenneth",
	"lastname": "Burnie",
	"gender": "Female",
	"dob": "03/04/1972",
	"age": 57,
	"contact_number": 9984748138,
	"email_id": "gburnie1p@ifeng.com",
	"photohash": "A67E471NY7Y02A4X",
	"dochash": "G44W812SY0Q60V6D"
  }, {
	"id": "555499561957",
	"firstname": "Elihu",
	"lastname": "Rupp",
	"gender": "Male",
	"dob": "10/30/1961",
	"age": 38,
	"contact_number": 8445852535,
	"email_id": "erupp1q@friendfeed.com",
	"photohash": "T37X976PB5L26R8O",
	"dochash": "C62I613UG3X09X0G"
  }, {
	"id": "963331066249",
	"firstname": "Vivia",
	"lastname": "Doogan",
	"gender": "Female",
	"dob": "02/01/1993",
	"age": 32,
	"contact_number": 9032263586,
	"email_id": "vdoogan1r@ed.gov",
	"photohash": "I73O027ZO3C75I0F",
	"dochash": "W20L959PM6B72Q4H"
  }, {
	"id": "274929594583",
	"firstname": "Feodor",
	"lastname": "Seiter",
	"gender": "Male",
	"dob": "06/05/1975",
	"age": 61,
	"contact_number": 9554215738,
	"email_id": "fseiter1s@tinypic.com",
	"photohash": "Q00H486PE2S69K2N",
	"dochash": "N19L492FX6D96K9M"
  }, {
	"id": "268288268460",
	"firstname": "Vachel",
	"lastname": "Dummett",
	"gender": "Male",
	"dob": "12/01/1998",
	"age": 53,
	"contact_number": 9585639518,
	"email_id": "vdummett1t@hexun.com",
	"photohash": "S25B552TD4P02R9J",
	"dochash": "Y75J853OU8Z97P7W"
  }, {
	"id": "556538086751",
	"firstname": "Rurik",
	"lastname": "Craythorn",
	"gender": "Male",
	"dob": "04/12/1978",
	"age": 65,
	"contact_number": 9345695490,
	"email_id": "rcraythorn1u@bbc.co.uk",
	"photohash": "F81S758CT6J97P4D",
	"dochash": "Y47D447HM2Y41E1U"
  }, {
	"id": "956136072738",
	"firstname": "Kassey",
	"lastname": "Fabry",
	"gender": "Female",
	"dob": "12/15/1983",
	"age": 75,
	"contact_number": 8673880211,
	"email_id": "kfabry1v@ehow.com",
	"photohash": "O94X092UH3V57K7Y",
	"dochash": "O73O922EB9D47P7P"
  }, {
	"id": "700231177558",
	"firstname": "Koo",
	"lastname": "Pulham",
	"gender": "Female",
	"dob": "10/24/1972",
	"age": 59,
	"contact_number": 9877546142,
	"email_id": "kpulham1w@reddit.com",
	"photohash": "B90S996RC7J88F8Z",
	"dochash": "F60I904TS2F56S8U"
  }, {
	"id": "371727652566",
	"firstname": "Shannon",
	"lastname": "Dowding",
	"gender": "Female",
	"dob": "11/28/1959",
	"age": 39,
	"contact_number": 9953092435,
	"email_id": "sdowding1x@latimes.com",
	"photohash": "O10T234BB0I71N1X",
	"dochash": "R81J663IO4Y02I5R"
  }, {
	"id": "803649907146",
	"firstname": "Inigo",
	"lastname": "MacAirt",
	"gender": "Male",
	"dob": "01/14/1954",
	"age": 28,
	"contact_number": 9973758464,
	"email_id": "imacairt1y@independent.co.uk",
	"photohash": "S11G561LW8Y56L2N",
	"dochash": "Z22E762SX0C25U3O"
  }, {
	"id": "154219780102",
	"firstname": "Alfredo",
	"lastname": "Stilgo",
	"gender": "Male",
	"dob": "01/02/1975",
	"age": 31,
	"contact_number": 8473207166,
	"email_id": "astilgo1z@cornell.edu",
	"photohash": "E50J347US0B07Q1T",
	"dochash": "O90I284HA0J02E0A"
  }, {
	"id": "591599147207",
	"firstname": "Melisent",
	"lastname": "Spataro",
	"gender": "Female",
	"dob": "08/17/1978",
	"age": 40,
	"contact_number": 8884289721,
	"email_id": "mspataro20@reuters.com",
	"photohash": "F57Q500UX3Z86F9J",
	"dochash": "Z39S635QL2K12O6G"
  }, {
	"id": "856576386008",
	"firstname": "Seline",
	"lastname": "Rusted",
	"gender": "Female",
	"dob": "01/22/1972",
	"age": 43,
	"contact_number": 8421063310,
	"email_id": "srusted21@who.int",
	"photohash": "T84Y122QN9K17C6R",
	"dochash": "X95N658EN5M05Y4V"
  }, {
	"id": "681971645181",
	"firstname": "Cinderella",
	"lastname": "Matushevitz",
	"gender": "Female",
	"dob": "08/09/1982",
	"age": 23,
	"contact_number": 8617813625,
	"email_id": "cmatushevitz22@army.mil",
	"photohash": "A13G352YJ6D41O1W",
	"dochash": "S33H102FA2M48L7T"
  }, {
	"id": "961989484963",
	"firstname": "Corby",
	"lastname": "Spiring",
	"gender": "Male",
	"dob": "05/16/1980",
	"age": 22,
	"contact_number": 8607859502,
	"email_id": "cspiring23@dedecms.com",
	"photohash": "M42Z454XH5K02H6P",
	"dochash": "Z47F160OZ2J48X5P"
  }, {
	"id": "785805818477",
	"firstname": "Onfroi",
	"lastname": "Willstrop",
	"gender": "Male",
	"dob": "10/23/1981",
	"age": 54,
	"contact_number": 9185778567,
	"email_id": "owillstrop24@sciencedaily.com",
	"photohash": "O42C282MR8B24Y1N",
	"dochash": "P79R300LG4H46X4F"
  }, {
	"id": "970853873490",
	"firstname": "Rutledge",
	"lastname": "Bainbrigge",
	"gender": "Male",
	"dob": "09/15/1974",
	"age": 23,
	"contact_number": 9654573285,
	"email_id": "rbainbrigge25@loc.gov",
	"photohash": "R46H090XP7F57U2C",
	"dochash": "G87H005ME7H76K5T"
  }, {
	"id": "147480194652",
	"firstname": "Mace",
	"lastname": "Kulver",
	"gender": "Male",
	"dob": "02/09/1967",
	"age": 61,
	"contact_number": 9546527720,
	"email_id": "mkulver26@taobao.com",
	"photohash": "E31A955OZ7O36J5N",
	"dochash": "Q50W555AO2U88R4J"
  }, {
	"id": "141564686976",
	"firstname": "Cissy",
	"lastname": "Elmar",
	"gender": "Female",
	"dob": "07/05/1973",
	"age": 61,
	"contact_number": 8214295953,
	"email_id": "celmar27@unicef.org",
	"photohash": "H49B878DL4X63O8R",
	"dochash": "J81S334MZ1D40E0P"
  }, {
	"id": "293287668154",
	"firstname": "Uriah",
	"lastname": "Archdeckne",
	"gender": "Male",
	"dob": "08/02/1994",
	"age": 60,
	"contact_number": 9855557364,
	"email_id": "uarchdeckne28@princeton.edu",
	"photohash": "T66Z203TX5T19T2D",
	"dochash": "E44P705HV8Q59O2L"
  }, {
	"id": "101713132882",
	"firstname": "Auguste",
	"lastname": "McKillop",
	"gender": "Female",
	"dob": "07/14/1978",
	"age": 57,
	"contact_number": 8750762531,
	"email_id": "amckillop29@wsj.com",
	"photohash": "F37A580JE9Z54H7I",
	"dochash": "W11O912RO8R50U1C"
  }, {
	"id": "347840219886",
	"firstname": "Cordula",
	"lastname": "Willes",
	"gender": "Female",
	"dob": "12/02/1991",
	"age": 67,
	"contact_number": 8610314188,
	"email_id": "cwilles2a@omniture.com",
	"photohash": "S47I565UU9W99L0E",
	"dochash": "L33Y763FQ2X86I6D"
  }, {
	"id": "372677999599",
	"firstname": "Pennie",
	"lastname": "Dalinder",
	"gender": "Male",
	"dob": "01/20/1961",
	"age": 29,
	"contact_number": 8705811825,
	"email_id": "pdalinder2b@symantec.com",
	"photohash": "N16N183LV3X27H6N",
	"dochash": "C52J496VT1U58C1X"
  }, {
	"id": "552057748811",
	"firstname": "Selby",
	"lastname": "Marvin",
	"gender": "Male",
	"dob": "05/16/1999",
	"age": 50,
	"contact_number": 8415945076,
	"email_id": "smarvin2c@usa.gov",
	"photohash": "P01G670RF9A39J7L",
	"dochash": "Y25L694IU5K35K4A"
  }, {
	"id": "920900268334",
	"firstname": "Dela",
	"lastname": "Tregona",
	"gender": "Female",
	"dob": "02/17/1973",
	"age": 39,
	"contact_number": 8095755537,
	"email_id": "dtregona2d@cpanel.net",
	"photohash": "K94C476LE1G58K0C",
	"dochash": "R11H213TX3F10H0T"
  }, {
	"id": "659988788101",
	"firstname": "Wash",
	"lastname": "Ilson",
	"gender": "Male",
	"dob": "09/23/1998",
	"age": 20,
	"contact_number": 8303134992,
	"email_id": "wilson2e@yelp.com",
	"photohash": "V19Y584AT7K68B1O",
	"dochash": "U89Y873OM1L60G5P"
  }, {
	"id": "276606158626",
	"firstname": "Germain",
	"lastname": "Elliot",
	"gender": "Female",
	"dob": "10/30/1981",
	"age": 29,
	"contact_number": 8412588697,
	"email_id": "gelliot2f@eepurl.com",
	"photohash": "W92Z188IL9K41E5R",
	"dochash": "W38A361DV8A33Y4D"
  }, {
	"id": "033357774396",
	"firstname": "Jayme",
	"lastname": "Tarply",
	"gender": "Female",
	"dob": "07/24/1960",
	"age": 54,
	"contact_number": 9661272039,
	"email_id": "jtarply2g@fotki.com",
	"photohash": "T23O250WU5Y37H6Z",
	"dochash": "N84A965OZ0H79A1G"
  }, {
	"id": "449168302709",
	"firstname": "Kingston",
	"lastname": "Cutridge",
	"gender": "Male",
	"dob": "10/23/1984",
	"age": 70,
	"contact_number": 8107427565,
	"email_id": "kcutridge2h@fema.gov",
	"photohash": "B99P616VY4D65I8O",
	"dochash": "H67L035VV0A10C9J"
  }, {
	"id": "620162529981",
	"firstname": "Judie",
	"lastname": "Van Bruggen",
	"gender": "Female",
	"dob": "10/29/1996",
	"age": 56,
	"contact_number": 9479660629,
	"email_id": "jvanbruggen2i@delicious.com",
	"photohash": "B17F609EC9M90J6C",
	"dochash": "O27U766QE1M34M1P"
  }, {
	"id": "027959504670",
	"firstname": "Albie",
	"lastname": "Abrahamovitz",
	"gender": "Male",
	"dob": "11/28/1979",
	"age": 59,
	"contact_number": 8945712811,
	"email_id": "aabrahamovitz2j@forbes.com",
	"photohash": "N83A350MV0T30H3E",
	"dochash": "G56S822AN9A59M5J"
  }, {
	"id": "989626004178",
	"firstname": "Sheela",
	"lastname": "Chern",
	"gender": "Female",
	"dob": "10/13/1955",
	"age": 68,
	"contact_number": 9368286240,
	"email_id": "schern2k@sogou.com",
	"photohash": "G86H581KT6X55Z8M",
	"dochash": "F65H677XD8F10K6H"
  }, {
	"id": "925214162225",
	"firstname": "Giulietta",
	"lastname": "Wayon",
	"gender": "Female",
	"dob": "01/05/1959",
	"age": 41,
	"contact_number": 8996027341,
	"email_id": "gwayon2l@pbs.org",
	"photohash": "K88S002PM4V97A0X",
	"dochash": "U05G398NI8B37S4Q"
  }, {
	"id": "500209306156",
	"firstname": "Case",
	"lastname": "Josum",
	"gender": "Male",
	"dob": "12/14/1989",
	"age": 36,
	"contact_number": 8712492683,
	"email_id": "cjosum2m@youtube.com",
	"photohash": "H74A922SU0I10B1F",
	"dochash": "T56O111PG2O38W1G"
  }, {
	"id": "362828734347",
	"firstname": "Guilbert",
	"lastname": "Foottit",
	"gender": "Male",
	"dob": "06/29/1977",
	"age": 75,
	"contact_number": 9571247039,
	"email_id": "gfoottit2n@umn.edu",
	"photohash": "C23B258EB4Z90Y2F",
	"dochash": "Y86H554NT7H71X8H"
  }, {
	"id": "260857082118",
	"firstname": "Berthe",
	"lastname": "Titterton",
	"gender": "Female",
	"dob": "08/16/1959",
	"age": 57,
	"contact_number": 9611255431,
	"email_id": "btitterton2o@seattletimes.com",
	"photohash": "A86G676XO6N61M3G",
	"dochash": "F84O750SB7Q66X1N"
  }, {
	"id": "303141282377",
	"firstname": "Heddi",
	"lastname": "Venart",
	"gender": "Female",
	"dob": "03/08/1966",
	"age": 21,
	"contact_number": 9188717351,
	"email_id": "hvenart2p@nhs.uk",
	"photohash": "M45N015EP6T10X7U",
	"dochash": "F06Z993TB4F63V1G"
  }, {
	"id": "580552546741",
	"firstname": "Viva",
	"lastname": "Rosin",
	"gender": "Female",
	"dob": "02/09/1977",
	"age": 21,
	"contact_number": 8259990253,
	"email_id": "vrosin2q@amazon.co.uk",
	"photohash": "V98A783NN1I66J3H",
	"dochash": "P81J059AM7K51R5R"
  }, {
	"id": "410696267327",
	"firstname": "Karia",
	"lastname": "Boaler",
	"gender": "Female",
	"dob": "01/21/1975",
	"age": 67,
	"contact_number": 8766981765,
	"email_id": "kboaler2r@unc.edu",
	"photohash": "Z32V987QG6I54J3S",
	"dochash": "P50L813HA5M30E5A"
  }
]

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
for (let i = 0; i < dummy.length; i++) {
	Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
	
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		return fabric_client.getUserContext('user', true);
	
	}).then((user_from_store) => {
	
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user.... run registerUser.js');
		}
		tx_id = fabric_client.newTransactionID();
		console.log("Assigning transaction_id: ", tx_id._transaction_id);
	
		var request = {
			chaincodeId: 'fabdl',
			fcn: 'CreateUserAccount',
			args: [dummy[i].id,dummy[i].firstname,dummy[i].lastname,dummy[i].gender,dummy[i].dob,toString(dummy[i].age), toString(dummy[i].contact_number),dummy[i].email_id, dummy[i].photohash, dummy[i].dochash],
			// args: [userid,fname,lname,gender,dob,age,contactno,emailid],
			chainId: 'channelboth
',
			txId: tx_id
		};
	
		return channel.sendTransactionProposal(request);
	
	}).then((results) => {
		
		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
	
			// build up the request for the orderer to have the transaction committed
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
	
			// set the transaction listener and set a timeout of 30 sec
			// if the transaction did not get committed within the timeout period,
			// report a TIMEOUT status
			var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			var promises = [];
	
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise); //we want the send transaction first, so that we know where to check status
	
			// get an eventhub once the fabric client has a user assigned. The user
			// is required bacause the event registration must be signed
			let event_hub = channel.newChannelEventHub(peer);
	
			// using resolve the promise so that result status may be processed
			// under the then clause rather than having the catch clause process
			// the status
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
				}, 3000);
				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					// this is the callback for transaction event status
					// first some clean up of event listener
					clearTimeout(handle);
	
					// now let the application know what happened
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
					} else {
						console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
						resolve(return_status);
					}
				}, (err) => {
					//this is the callback if something goes wrong with the event registration or processing
					reject(new Error('There was a problem with the eventhub ::'+err));
				},
					{disconnect: true} //disconnect when complete
				);
				event_hub.connect();
	
			});
			promises.push(txPromise);
	
			return Promise.all(promises);
		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		// check the results in the order the promises were added to the promise all list
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + results[0].status);
		}
	
		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
	});
}


/*

*/