"use strict";

const $ = id => document.getElementById(id);
const LETTERS = ["A", "B", "C", "D"];

const animeList = [
  {id:"nanatsu",name:"Nanatsu no Taizai",icon:"⚔️",genre:"Fantasía"},
  {id:"aot",name:"Attack on Titan",icon:"🧱",genre:"Acción"},
  {id:"shangri",name:"Shangri-La Frontier",icon:"🎮",genre:"Aventura"},
  {id:"edens",name:"Edens Zero",icon:"🚀",genre:"Ciencia ficción"},
  {id:"jjk",name:"Jujutsu Kaisen",icon:"👊",genre:"Sobrenatural"},
  {id:"pokemon",name:"Pokémon",icon:"⚡",genre:"Aventura"},
  {id:"dragonball",name:"Dragon Ball",icon:"🐉",genre:"Acción"},
  {id:"foodwars",name:"Food Wars! (Soma Yukihira)",icon:"🍜",genre:"Cocina"},
  {id:"konosuba",name:"KonoSuba",icon:"💥",genre:"Comedia"},
  {id:"naruto",name:"Naruto",icon:"🍥",genre:"Ninja"},
  {id:"blackclover",name:"Black Clover",icon:"🍀",genre:"Fantasía"},
  {id:"plunderer",name:"Plunderer",icon:"🔢",genre:"Fantasía"},
  {id:"tokyo",name:"Tokyo Revengers",icon:"🛵",genre:"Drama"},
  {id:"fma",name:"Fullmetal Alchemist: Brotherhood",icon:"⚗️",genre:"Fantasía"},
  {id:"onepiece",name:"One Piece",icon:"🏴‍☠️",genre:"Aventura"},
  {id:"demonslayer",name:"Demon Slayer",icon:"🌊",genre:"Acción"},
  {id:"deathnote",name:"Death Note",icon:"📓",genre:"Suspenso"},
  {id:"spyfamily",name:"Spy x Family",icon:"🕵️",genre:"Comedia"},
  {id:"hxh",name:"Hunter x Hunter",icon:"🎣",genre:"Aventura"},
  {id:"bleach",name:"Bleach",icon:"🗡️",genre:"Sobrenatural"},
  {id:"sololeveling",name:"Solo Leveling",icon:"🌑",genre:"Acción"},
  {id:"chainsaw",name:"Chainsaw Man",icon:"🪚",genre:"Acción"},
  {id:"mha",name:"My Hero Academia",icon:"💚",genre:"Superhéroes"},
  {id:"tokyoghoul",name:"Tokyo Ghoul",icon:"🩸",genre:"Horror"}
];

/*
  Cada pregunta tiene este formato:
  [pregunta, respuesta correcta, [3 respuestas incorrectas]]
  Se mezclan las opciones para que la correcta no esté siempre en la misma letra.
*/

const BANK = {
nanatsu:[
["¿Quién es el capitán de los Siete Pecados Capitales?","Meliodas",["Ban","King","Escanor"]],
["¿Qué pecado representa Ban?","Avaricia",["Ira","Envidia","Pereza"]],
["¿Cómo se llama el cerdito compañero del grupo?","Hawk",["Gilthunder","Zaratras","Griamore"]],
["¿Qué pecado representa Diane?","Envidia",["Orgullo","Gula","Lujuria"]],
["¿Cuál es el tesoro sagrado de Meliodas?","Lostvayne",["Courechouse","Gideon","Rita"]],
["¿Qué pecado representa King?","Pereza",["Ira","Avaricia","Orgullo"]],
["¿Qué raza es Elizabeth?","Diosa",["Gigante","Hada","Vampira"]],
["¿Cómo se llama el reino principal de la historia?","Liones",["Clover","Fiore","Amestris"]],
["¿Qué pecado representa Escanor?","Orgullo",["Envidia","Pereza","Avaricia"]],
["¿Cuál es el poder característico de Escanor durante el día?","Sunshine",["Black Flash","Gear Second","Alquimia"]],
["¿Quién es el hermano de Meliodas?","Zeldris",["Ban","Gowther","Gilthunder"]],
["¿Qué pecado representa Gowther?","Lujuria",["Gula","Ira","Pereza"]],
["¿Qué tipo de criatura es Diane?","Gigante",["Hada","Diosa","Humana"]],
["¿Quién es conocida como la Serpiente de la Envidia?","Diane",["Merlin","Elizabeth","Elaine"]],
["¿Qué grupo reúne a los siete protagonistas?","Los Siete Pecados Capitales",["Los Caballeros Mágicos","La Brigada Fantasma","Los Homúnculos"]]
],
aot:[
["¿Quién es el protagonista principal?","Eren Yeager",["Armin Arlert","Jean Kirstein","Levi Ackerman"]],
["¿Quién es la amiga de infancia de Eren?","Mikasa Ackerman",["Sasha Blouse","Historia Reiss","Annie Leonhart"]],
["¿Qué cuerpo militar explora el exterior de las murallas?","Cuerpo de Exploración",["Policía Militar","Guarnición","Brigada Fantasma"]],
["¿Cómo se llama el titán de Eren al principio?","Titán de Ataque",["Titán Bestia","Titán Mandíbula","Titán Carro"]],
["¿Quién es conocido como el soldado más fuerte de la humanidad?","Levi Ackerman",["Jean Kirstein","Connie Springer","Marco Bott"]],
["¿Qué comida le encanta a Sasha?","Patatas",["Manzanas","Pescado crudo","Pasteles"]],
["¿Quién es el amigo de Eren que destaca por su inteligencia?","Armin Arlert",["Reiner Braun","Porco Galliard","Floch Forster"]],
["¿Qué protege a la humanidad al inicio de la historia?","Las murallas",["Un campo mágico","Un océano de lava","Un ejército de dragones"]],
["¿Quién puede transformarse en el Titán Colosal al principio?","Bertholdt Hoover",["Jean Kirstein","Connie Springer","Erwin Smith"]],
["¿Cómo se llama la muralla más exterior?","María",["Rose","Sina","Trost"]],
["¿Qué personaje es comandante del Cuerpo de Exploración?","Erwin Smith",["Dot Pixis","Kenny Ackerman","Theo Magath"]],
["¿Qué tipo de seres amenazan a la humanidad?","Titanes",["Hollows","Homúnculos","Demonios de sangre"]],
["¿Qué personaje es hermana adoptiva de Eren?","Mikasa Ackerman",["Annie Leonhart","Pieck Finger","Ymir Fritz"]],
["¿Qué organización militar protege principalmente las murallas?","Guarnición",["Marina","Cuerpo de Alquimistas","Seguridad Pública"]],
["¿Cuál es uno de los grandes misterios al comienzo de la serie?","El origen de los titanes",["El origen de los pokémon","La receta de Soma","El tesoro de los piratas"]]
],
shangri:[
["¿Cómo se llama el protagonista de Shangri-La Frontier?","Rakuro Hizutome",["Sun Jinwoo","Shiki Granbell","Asta"]],
["¿Qué apodo utiliza Rakuro al jugar?","Sunraku",["Kirito","Deku","Luffy"]],
["¿Qué tipo de juegos suele disfrutar Rakuro antes de Shangri-La Frontier?","Juegos malos o defectuosos",["Solo juegos de cocina","Juegos exclusivamente deportivos","Juegos de cartas profesionales"]],
["¿Qué tipo de obra es Shangri-La Frontier?","Una aventura centrada en un videojuego",["Un drama histórico sin juegos","Un documental culinario","Una historia de detectives realistas"]],
["¿Qué busca Rakuro al jugar?","Superar desafíos y disfrutar del juego",["Convertirse en Hokage","Encontrar la Death Note","Ser el Rey Mago"]],
["¿Cómo se llama la compañera de Rakuro que usa el nombre Psyger-0?","Rei Saiga",["Makima","Nobara Kugisaki","Noelle Silva"]],
["¿Qué tipo de equipo suele usar Sunraku?","Equipo ligero para moverse con agilidad",["Una armadura espacial pesada","Un uniforme de chef","Una capa de alquimista estatal"]],
["¿Qué destaca del estilo de Sunraku?","Su habilidad y adaptación en combate",["Su poder para cocinar","Su capacidad de alquimia","Su habilidad para controlar titanes"]],
["¿Qué clase de mundo explora Sunraku?","Un mundo virtual de fantasía",["Una ciudad real sin videojuegos","Una escuela de cocina","Una colonia espacial moderna"]],
["¿Qué tipo de desafío presenta el juego principal?","Enemigos y misiones difíciles",["Exámenes de cocina únicamente","Carreras de autos reales","Partidos de béisbol"]],
["¿Qué hace Rakuro antes de empezar un juego nuevo?","Aprende sus mecánicas jugando",["Pide ser Hokage","Se convierte en pirata","Escribe un cuaderno sobrenatural"]],
["¿Qué medio dio origen a la historia?","Una novela web",["Un libro de recetas","Un manual de deportes","Un cómic occidental de superhéroes"]],
["¿Qué género describe mejor la serie?","Aventura y videojuegos",["Romance histórico únicamente","Terror psicológico realista","Drama judicial"]],
["¿Qué caracteriza a muchos enemigos del juego?","Diseños y patrones de combate particulares",["Todos son idénticos","Solo pueden cocinar","No pueden atacar"]],
["¿Qué hace que Sunraku destaque?","Su experiencia con juegos difíciles",["Ser el padre de Deku","Ser un shinigami","Ser un titán colosal"]]
],
edens:[
["¿Cómo se llama el protagonista de Edens Zero?","Shiki Granbell",["Eren Yeager","Asta","Denji"]],
["¿Qué poder usa Shiki?","Ether Gear de gravedad",["Alquimia de fuego","Respiración del Agua","Sharingan"]],
["¿Cómo se llama la compañera androide de Shiki?","Rebecca Bluegarden",["Lucy Heartfilia","Mikasa Ackerman","Nobara Kugisaki"]],
["¿Cómo se llama la nave principal del grupo?","Edens Zero",["Going Merry","Thousand Sunny","Baratie"]],
["¿Qué busca Shiki al viajar por el espacio?","Encontrar a Mother",["Encontrar el One Piece","Ser Hokage","Encontrar la Death Note"]],
["¿Quién es Happy?","Un androide con apariencia de gato",["Un titán","Un alquimista","Un pirata humano"]],
["¿Qué género combina la serie?","Ciencia ficción y aventura",["Solo cocina","Deportes escolares","Historia documental"]],
["¿Cómo se llama el creador de Edens Zero?","Hiro Mashima",["Eiichiro Oda","Tite Kubo","Tsugumi Ohba"]],
["¿Qué medio de transporte usan para viajar entre mundos?","Una nave espacial",["Un tren de vapor solamente","Una bicicleta mágica","Un submarino escolar"]],
["¿Quién es una de las Cuatro Estrellas Brillantes del Rey Demonio?","Witch Regret",["Sakura Haruno","Rukia Kuchiki","Misa Amane"]],
["¿Qué es Pino?","Una androide",["Una pirata humana","Una alquimista estatal","Una cazadora de titanes"]],
["¿Qué nombre tiene el Rey Demonio al que acompaña Shiki?","Ziggy",["Zeref","Madara","Aizen"]],
["¿Qué elemento de la historia es central?","La amistad entre humanos y máquinas",["La búsqueda de recetas únicamente","Los torneos de tenis","La investigación policial realista"]],
["¿En qué entorno ocurre gran parte de la aventura?","En el espacio",["Solo en una escuela","Solo en un pueblo medieval","En una isla desierta sin tecnología"]],
["¿Qué quiere Rebecca hacer con sus aventuras?","Crear videos para B-Cube",["Ser la Hokage","Trabajar en la Marina","Escribir un cuaderno de muerte"]]
],
jjk:[
["¿Cómo se llama el protagonista de Jujutsu Kaisen?","Yuji Itadori",["Megumi Fushiguro","Yuta Okkotsu","Kento Nanami"]],
["¿Qué objeto maldito se traga Yuji?","Un dedo de Sukuna",["Una Death Note","Una esfera del dragón","Una piedra filosofal"]],
["¿Quién es el maestro de Yuji, Megumi y Nobara?","Satoru Gojo",["Suguru Geto","Toji Fushiguro","Aoi Todo"]],
["¿Cómo se llama la energía utilizada por los hechiceros?","Energía maldita",["Nen","Ether Gear","Chakra espiritual de alquimia"]],
["¿Qué técnica caracteriza a Gojo?","Limitless",["Sunshine","One For All","Gear Fifth"]],
["¿Quién es el compañero de Yuji que usa sombras?","Megumi Fushiguro",["Toge Inumaki","Panda","Kento Nanami"]],
["¿Qué arma suele usar Nobara Kugisaki?","Martillo y clavos",["Una guadaña gigante","Una pistola de agua","Una espada de alquimista"]],
["¿Quién es Ryomen Sukuna?","El Rey de las Maldiciones",["El Rey Pirata","El Rey Mago","El Rey de los Titanes"]],
["¿Qué dice a menudo Toge Inumaki para comunicarse?","Ingredientes de onigiri",["Nombres de planetas","Recetas de curry","Nombres de pokémon"]],
["¿Qué institución frecuentan los protagonistas?","Escuela Técnica de Hechicería de Tokio",["Academia U.A.","Academia Totsuki","Escuela de Eden"]],
["¿Quién es el compañero panda del grupo?","Panda",["Hawk","Happy","Bond"]],
["¿Qué tipo de seres nacen de emociones negativas?","Maldiciones",["Titanes","Homúnculos","Pokémon"]],
["¿Qué personaje es conocido por su técnica de proporción?","Kento Nanami",["Aoi Todo","Mahito","Junpei Yoshino"]],
["¿Qué técnica de dominio utiliza Gojo?","Vacío Infinito",["Expansión de Dominio: Santuario Malevolente","Sunshine","Black Clover"]],
["¿Qué género define mejor la serie?","Acción sobrenatural",["Cocina competitiva","Deportes de invierno","Comedia romántica histórica"]]
],
pokemon:[
["¿Cómo se llama el compañero Pokémon más conocido de Ash?","Pikachu",["Charmander","Squirtle","Eevee"]],
["¿Qué tipo es Pikachu?","Eléctrico",["Agua","Fuego","Planta"]],
["¿En qué evoluciona Charmander?","Charmeleon",["Bulbasaur","Wartortle","Pidgeotto"]],
["¿Qué objeto se usa habitualmente para capturar Pokémon?","Poké Ball",["Death Note","Grimorio","Piedra filosofal"]],
["¿Qué tipo es Squirtle?","Agua",["Fuego","Eléctrico","Roca"]],
["¿Cuál es el Pokémon número 001 de la Pokédex nacional?","Bulbasaur",["Pikachu","Charmander","Mew"]],
["¿En qué evoluciona Eevee con una Piedra Trueno?","Jolteon",["Vaporeon","Flareon","Umbreon"]],
["¿Qué equipo intenta robar Pokémon en la serie clásica?","Equipo Rocket",["Akatsuki","Liga de Villanos","Brigada Fantasma"]],
["¿Cómo se llama la entrenadora que viaja con Ash en parte de la serie original?","Misty",["Nami","Nobara","Noelle"]],
["¿Qué tipo es Charizard?","Fuego y Volador",["Agua y Hielo","Planta y Veneno","Eléctrico y Acero"]],
["¿Qué Pokémon es conocido por dormir mucho?","Snorlax",["Pikachu","Mewtwo","Scyther"]],
["¿Qué criatura legendaria está asociada con los mares?","Lugia",["Moltres","Entei","Rayquaza"]],
["¿Qué hace un entrenador Pokémon?","Entrena Pokémon y participa en combates",["Caza titanes","Realiza alquimia humana","Escribe nombres en un cuaderno"]],
["¿Qué tipo es Bulbasaur?","Planta y Veneno",["Fuego y Volador","Agua y Roca","Eléctrico y Acero"]],
["¿Qué organización oficial celebra combates entre entrenadores?","La Liga Pokémon",["El Cuerpo de Exploración","La Marina","Los Toros Negros"]]
],
dragonball:[
["¿Cómo se llama el protagonista principal?","Son Goku",["Vegeta","Piccolo","Gohan"]],
["¿Qué objeto reúne siete esferas mágicas?","Las Esferas del Dragón",["Las Piedras Filosofales","Los dedos de Sukuna","Los grimorios"]],
["¿Quién es el príncipe de los saiyajin?","Vegeta",["Krillin","Yamcha","Trunks del futuro"]],
["¿Cómo se llama la transformación de cabello dorado más conocida de Goku?","Super Saiyajin",["Modo Sabio","Bankai","Dominio Infinito"]],
["¿Quién es el hijo mayor de Goku?","Gohan",["Goten","Trunks","Bardock"]],
["¿Qué técnica grita Goku al lanzar energía?","Kamehameha",["Rasengan","Getsuga Tensho","Black Flash"]],
["¿Cómo se llama el mejor amigo humano de Goku?","Krillin",["Freezer","Cell","Raditz"]],
["¿Quién es el creador de Dragon Ball?","Akira Toriyama",["Masashi Kishimoto","Eiichiro Oda","Hiro Mashima"]],
["¿Qué raza es Goku?","Saiyajin",["Namekiano","Androide","Humano artificial"]],
["¿Quién destruye el planeta Vegeta en la historia clásica?","Freezer",["Cell","Majin Buu","Raditz"]],
["¿Cómo se llama el maestro anciano de Goku?","Maestro Roshi",["Maestro Jiraiya","Urahara","Yami"]],
["¿Qué personaje verde pertenece a los namekianos?","Piccolo",["Krillin","Yamcha","Android 18"]],
["¿Quién es el rival de Goku que se vuelve aliado?","Vegeta",["Pilaf","Oolong","Mr. Satan"]],
["¿Qué se necesita para invocar a Shenlong?","Reunir las siete Esferas del Dragón",["Reunir siete grimorios","Vencer a siete titanes","Escribir siete nombres"]],
["¿Qué género predomina en Dragon Ball?","Acción y artes marciales",["Cocina competitiva","Drama médico","Investigación policial"]]
],
foodwars:[
["¿Cómo se llama el protagonista de Food Wars!?","Soma Yukihira",["Shiki Granbell","Asta","Denji"]],
["¿Qué tipo de historia es Food Wars!?","Competición culinaria",["Aventura espacial","Caza de titanes","Misterio sobrenatural"]],
["¿Cómo se llama la escuela de cocina principal?","Academia Totsuki",["Academia U.A.","Escuela de Tokio","Academia Clover"]],
["¿Qué restaurante familiar ayuda a Soma a aprender a cocinar?","El restaurante Yukihira",["Anteiku","Baratie","Ichiraku"]],
["¿Qué suele hacer Soma para mejorar sus platos?","Experimentar con recetas",["Usar alquimia humana","Luchar contra maldiciones","Capturar pokémon"]],
["¿Quién es una compañera de Soma conocida como la lengua divina?","Erina Nakiri",["Mikasa Ackerman","Rukia Kuchiki","Misa Amane"]],
["¿Qué tipo de duelos culinarios aparecen en la serie?","Shokugeki",["Bankai","Nen","Ether Gear"]],
["¿Quién es el padre de Soma?","Joichiro Yukihira",["Satoru Gojo","Shanks","All Might"]],
["¿Qué habilidad es importante para un estudiante de Totsuki?","Técnica y creatividad culinaria",["Controlar titanes","Invocar maldiciones","Usar grimorios mágicos"]],
["¿Qué suele decidir un Shokugeki?","Una competencia de cocina",["Un duelo de piratas","Una carrera ninja","Una batalla espacial"]],
["¿Qué ingrediente se utiliza para cocinar?","Ingredientes alimentarios",["Esferas del Dragón","Dedos malditos","Cuadernos sobrenaturales"]],
["¿Qué busca Soma con sus desafíos?","Mejorar como cocinero",["Ser el Rey Pirata","Ser el Hokage","Ser el Rey Mago"]],
["¿Qué género combina la serie?","Comedia y cocina",["Terror y zombis","Ciencia ficción militar","Drama judicial"]],
["¿Qué organización escolar tiene gran influencia en Totsuki?","El Consejo de los Diez",["Los Siete Pecados","Los Doce Kizuki","La Marina"]],
["¿Qué distingue a los platos exitosos de Soma?","Creatividad y sabor",["Poderes sobrenaturales reales","Magia de titanes","Tecnología espacial"]]
],
konosuba:[
["¿Cómo se llama el protagonista de KonoSuba?","Kazuma Satou",["Kirito","Shiki Granbell","Yuji Itadori"]],
["¿Qué diosa acompaña a Kazuma?","Aqua",["Eris","Hestia","Athena"]],
["¿Qué magia utiliza Megumin?","Explosión",["Agua curativa","Control de sombras","Alquimia"]],
["¿Cómo se llama la caballera masoquista del grupo?","Darkness",["Yunyun","Wiz","Sylphina"]],
["¿Qué género destaca en KonoSuba?","Comedia y fantasía",["Terror realista","Drama médico","Documental histórico"]],
["¿Qué hace Megumin después de lanzar su hechizo más poderoso?","Queda sin energía y no puede moverse bien",["Se transforma en dragón","Se vuelve invisible","Cambia de mundo automáticamente"]],
["¿Qué clase de mundo explora el grupo?","Un mundo de fantasía",["Una ciudad futurista realista","Una escuela de cocina","Un planeta de titanes"]],
["¿Cómo consigue Kazuma dinero en el nuevo mundo?","Aceptando trabajos y misiones",["Trabajando como Hokage","Vendiendo grimorios prohibidos","Cazando pokémon legendarios"]],
["¿Qué diosa es conocida por sus habilidades curativas?","Aqua",["Megumin","Darkness","Yunyun"]],
["¿Qué arma utiliza Darkness habitualmente?","Una espada",["Una motosierra","Un cuaderno","Un arco tecnológico"]],
["¿Quién es una rival y amiga de Megumin?","Yunyun",["Mikasa","Makima","Nami"]],
["¿Qué suele ocurrir con los planes de Kazuma?","Acaban en situaciones caóticas",["Siempre salen perfectos","Nunca implican a sus amigos","Terminan en una competencia culinaria"]],
["¿Qué recurso es esencial para la magia de Megumin?","Poder mágico",["Combustible de nave","Esferas del Dragón","Sangre de titán"]],
["¿Qué tipo de grupo forma Kazuma?","Un grupo de aventureros",["Un escuadrón policial real","Una banda de piratas espaciales","Un equipo profesional de cocina"]],
["¿Qué hace especial a KonoSuba frente a muchas fantasías?","Parodia los clichés del género",["Es un documental","No tiene humor","Trata únicamente de deportes"]]
],
naruto:[
["¿Cuál es el sueño de Naruto?","Convertirse en Hokage",["Ser Rey Pirata","Ser Rey Mago","Ser alquimista estatal"]],
["¿Qué criatura está sellada dentro de Naruto?","Kurama",["Shukaku únicamente","Pikachu","Pochita"]],
["¿Cómo se llama el equipo de Naruto, Sakura y Sasuke?","Equipo 7",["Equipo 10","Equipo Guy","Equipo 8"]],
["¿Quién es el maestro del Equipo 7 al principio?","Kakashi Hatake",["Jiraiya","Iruka Umino","Orochimaru"]],
["¿Qué técnica crea una esfera de chakra giratoria?","Rasengan",["Chidori","Kamehameha","Getsuga Tensho"]],
["¿Quién es el rival de Naruto durante gran parte de la historia?","Sasuke Uchiha",["Shikamaru Nara","Kiba Inuzuka","Choji Akimichi"]],
["¿Qué clan es famoso por el Sharingan?","Uchiha",["Hyuga","Nara","Akimichi"]],
["¿Quién es el maestro conocido como el Sabio Pervertido?","Jiraiya",["Kakashi","Guy","Minato"]],
["¿Qué organización viste capas negras con nubes rojas?","Akatsuki",["Los Homúnculos","Los Toros Negros","El Equipo Rocket"]],
["¿Cómo se llama la aldea de Naruto?","Konohagakure",["Sunagakure","Amegakure","Kirigakure"]],
["¿Qué técnica usa Naruto para crear copias?","Clones de sombra",["Bankai","Dominio Infinito","Alchemy Seal"]],
["¿Quién es el padre de Naruto?","Minato Namikaze",["Hiruzen Sarutobi","Jiraiya","Kakashi Hatake"]],
["¿Qué habilidad tiene Hinata relacionada con su clan?","Byakugan",["Sharingan","Rinnegan","Geass"]],
["¿Qué rango desea alcanzar Naruto?","Hokage",["Capitán de la Marina","Rey Pirata","Rey Demonio"]],
["¿Qué energía utiliza un ninja para ejecutar técnicas?","Chakra",["Nen","Ether Gear","Energía maldita"]]
],
blackclover:[
["¿Cómo se llama el protagonista de Black Clover?","Asta",["Yuno","Yami","Luck"]],
["¿Qué característica inusual tiene Asta al principio?","No tiene magia",["No puede hablar","No puede correr","No puede usar espadas"]],
["¿Quién es el rival de Asta desde la infancia?","Yuno",["Magna","Finral","Gauche"]],
["¿Cómo se llama el escuadrón de Asta?","Toros Negros",["Leones Carmesí","Águilas Plateadas","Rosas Azules"]],
["¿Qué desea convertirse Asta?","Rey Mago",["Hokage","Rey Pirata","Alquimista estatal"]],
["¿Qué objeto recibe Asta para usar anti-magia?","Un grimorio de cinco hojas",["Una Death Note","Una Poké Ball","Una piedra filosofal"]],
["¿Quién es el capitán de los Toros Negros?","Yami Sukehiro",["Fuegoleon Vermillion","Nozel Silva","William Vangeance"]],
["¿Qué tipo de magia utiliza Noelle Silva?","Magia de agua",["Magia de fuego","Magia de arena","Magia de sombras"]],
["¿Qué es Yuno para Asta?","Su amigo y rival",["Su padre","Su maestro de cocina","Su enemigo de otra dimensión"]],
["¿Qué objeto usan los magos para realizar magia?","Grimorios",["Zanpakutō","Cuadernos de muerte","Poké Balls"]],
["¿Qué fuerza puede anular la magia?","Anti-magia",["Nen de emisión","Sunshine","One For All"]],
["¿Quién es una integrante de los Toros Negros conocida por su magia espacial?","Finral Roulacase",["Levi Ackerman","Soma Yukihira","Kento Nanami"]],
["¿Qué reino es el escenario principal?","Reino del Trébol",["Reino de Liones","Amestris","Wano"]],
["¿Qué género combina la serie?","Acción y fantasía",["Cocina y deportes","Drama médico","Ciencia ficción realista"]],
["¿Qué representa el sueño de Asta?","Superar sus límites y convertirse en Rey Mago",["Encontrar la Death Note","Ser el mejor chef","Convertirse en pirata"]]
],
plunderer:[
["¿Cómo se llama la protagonista que busca al legendario As?","Hina",["Licht","Mikasa","Rebecca"]],
["¿Cómo se llama el protagonista masculino?","Licht Bach",["Asta","Kazuma","Ken Kaneki"]],
["¿Qué concepto numérico es importante en Plunderer?","El conteo",["El chakra","La alquimia","La energía maldita"]],
["¿Qué puede determinar el conteo de una persona?","Aspectos de su vida o habilidades",["Su comida favorita únicamente","Su color de cabello solamente","Su lugar de nacimiento siempre"]],
["¿Qué género tiene Plunderer?","Acción y fantasía",["Cocina competitiva","Deportes escolares","Documental natural"]],
["¿Qué busca Hina al comienzo de la historia?","Encontrar al legendario As",["Ser Hokage","Encontrar a Mother","Convertirse en chef"]],
["¿Qué tipo de mundo presenta la serie?","Un mundo donde los números tienen gran importancia",["Un mundo sin números","Un mundo de cocina profesional","Una ciudad exclusivamente submarina"]],
["¿Qué caracteriza al sistema de poder de la serie?","El conteo de cada persona",["Las Poké Balls","Los grimorios de cinco hojas","Las murallas de piedra"]],
["¿Quién es una figura importante vinculada al pasado de Licht?","Los ases legendarios",["Los Siete Pecados Capitales","Los Homúnculos de Amestris","Los cazadores de ghouls"]],
["¿Qué busca la historia explorar además de la acción?","Las consecuencias de las reglas de su sociedad",["Solo recetas culinarias","Solo partidos deportivos","Solo viajes espaciales"]],
["¿Qué es Licht en la historia?","Un personaje con un pasado misterioso",["El padre de Naruto","Un capitán pirata","Un profesor de cocina"]],
["¿Qué tipo de habilidad puede influir en el combate?","El valor del conteo",["Una receta de curry","Una Poké Ball","Una técnica de alquimia culinaria"]],
["¿Qué género de aventura aparece en Plunderer?","Fantasía distópica",["Comedia escolar realista","Documental de cocina","Drama médico"]],
["¿Qué elemento es recurrente en la serie?","Los números y su significado",["Las Esferas del Dragón","Los cuadernos sobrenaturales","Los deportes de invierno"]],
["¿Qué impulsa a los personajes a avanzar?","Descubrir la verdad de su mundo",["Encontrar un restaurante famoso","Ganar la Liga Pokémon","Ser el Rey Pirata"]]
],
tokyo:[
["¿Cómo se llama el protagonista de Tokyo Revengers?","Takemichi Hanagaki",["Manjiro Sano","Ken Kaneki","Yuji Itadori"]],
["¿Cómo se conoce a Manjiro Sano?","Mikey",["Draken","Baji","Chifuyu"]],
["¿Quién es el mejor amigo de Mikey y vicepresidente de Toman?","Draken",["Takemichi","Naoto","Kisaki"]],
["¿Qué capacidad extraordinaria tiene Takemichi?","Viajar en el tiempo",["Controlar el fuego","Leer pensamientos","Transformarse en titán"]],
["¿Cómo se llama la pandilla principal al inicio?","Tokyo Manji Gang (Toman)",["Akatsuki","Equipo Rocket","Brigada Fantasma"]],
["¿Quién es la novia de Takemichi?","Hinata Tachibana",["Emma Sano","Yuzuha Shiba","Senju Kawaragi"]],
["¿Cómo se llama el hermano menor de Hinata?","Naoto Tachibana",["Draken","Baji","Mitsuya"]],
["¿Qué personaje suele llamarse Draken?","Ken Ryuguji",["Manjiro Sano","Takemichi Hanagaki","Kazutora Hanemiya"]],
["¿Qué género combina la serie?","Drama y pandillas con viajes temporales",["Cocina y fantasía","Ciencia ficción espacial","Deportes escolares"]],
["¿Qué intenta cambiar Takemichi con sus viajes?","Un futuro trágico",["El resultado de un torneo culinario","La historia de los titanes","El origen de los Pokémon"]],
["¿Qué personaje está vinculado a muchos de los conflictos de Toman?","Tetta Kisaki",["Soma Yukihira","Yami Sukehiro","Rukia Kuchiki"]],
["¿Qué valor aparece con frecuencia entre los personajes?","La lealtad a sus amigos",["La alquimia humana","La caza de demonios","La cocina profesional"]],
["¿Qué suele desencadenar los viajes temporales de Takemichi?","Un contacto relacionado con Naoto",["Una Poké Ball","Un grimorio","Un plato de cocina"]],
["¿Qué tipo de ropa suelen llevar los miembros de las pandillas?","Uniformes de pandilla",["Uniformes de astronauta","Túnicas de alquimista","Trajes de chef"]],
["¿Cuál es uno de los objetivos centrales de Takemichi?","Salvar a Hinata y a sus amigos",["Encontrar el One Piece","Ser el Rey Mago","Encontrar a Mother"]]
],
fma:[
["¿Cómo se llaman los hermanos protagonistas?","Edward y Alphonse Elric",["Eren y Zeke Yeager","Yuji y Megumi","Asta y Yuno"]],
["¿Qué arte domina Edward?","Alquimia",["Nen","Ether Gear","Respiración del Agua"]],
["¿Qué perdió Edward durante el intento de transmutación humana?","Una pierna y luego un brazo",["La vista únicamente","La memoria completa","Su corazón por una maldición"]],
["¿Qué perdió Alphonse en el intento de transmutación humana?","Su cuerpo físico",["Su voz","Su sombra","Su capacidad de aprender"]],
["¿Qué ley fundamental rige la alquimia en la serie?","Intercambio equivalente",["El chakra infinito","La ley del Rey Pirata","La regla de las siete Poké Balls"]],
["¿Cómo llaman a Edward por su prótesis?","El Alquimista de Acero",["El Rey Mago","El Segador del CCG","El Titán Colosal"]],
["¿Qué objeto buscan los hermanos?","La Piedra Filosofal",["La Death Note","El One Piece","El grimorio de cinco hojas"]],
["¿Cómo se llama el país donde ocurre la historia?","Amestris",["Liones","Wano","Clover"]],
["¿Qué rango militar tiene Edward?","Alquimista Estatal",["Capitán de la Marina","Hokage","Cazador de rango S"]],
["¿Qué es Alphonse después del accidente?","Un alma ligada a una armadura",["Un androide con forma de gato","Un titán inteligente","Un ghoul de un ojo"]],
["¿Quién es el padre de Edward y Alphonse?","Van Hohenheim",["Roy Mustang","Maes Hughes","King Bradley"]],
["¿Qué elemento utiliza Roy Mustang en combate?","Fuego",["Agua","Hielo","Electricidad"]],
["¿Qué organización investiga a los alquimistas estatales?","El ejército de Amestris",["La Marina de One Piece","La Liga Pokémon","El Cuerpo de Exploración"]],
["¿Qué tema moral aparece en la historia?","El precio de intentar desafiar las leyes de la naturaleza",["Ganar torneos de cocina","Ser un entrenador Pokémon","Encontrar un tesoro pirata"]],
["¿Quién es el autor del manga original?","Hiromu Arakawa",["Eiichiro Oda","Masashi Kishimoto","Tite Kubo"]]
],
onepiece:[
["¿Cómo se llama el protagonista de One Piece?","Monkey D. Luffy",["Roronoa Zoro","Sanji","Trafalgar Law"]],
["¿Qué quiere encontrar Luffy?","El One Piece",["La Piedra Filosofal","La Death Note","El Santo Grial"]],
["¿Qué título desea conseguir Luffy?","Rey de los Piratas",["Hokage","Rey Mago","Alquimista Estatal"]],
["¿Cómo se llama el espadachín de la tripulación?","Roronoa Zoro",["Usopp","Franky","Brook"]],
["¿Quién es la navegante de los Sombrero de Paja?","Nami",["Robin","Vivi","Perona"]],
["¿Qué fruta comió Luffy?","Gomu Gomu no Mi",["Mera Mera no Mi","Hie Hie no Mi","Ope Ope no Mi"]],
["¿Cómo se llama el cocinero de la tripulación?","Sanji",["Jinbe","Franky","Chopper"]],
["¿Qué animal es Tony Tony Chopper?","Un reno",["Un perro","Un gato","Un oso"]],
["¿Quién es el médico de la tripulación?","Tony Tony Chopper",["Nami","Brook","Usopp"]],
["¿Cómo se llama el barco que sucede al Going Merry?","Thousand Sunny",["Red Force","Polar Tang","Moby Dick"]],
["¿Qué sueño tiene Zoro?","Ser el mejor espadachín del mundo",["Ser el mejor chef","Encontrar a Mother","Convertirse en Hokage"]],
["¿Quién es el arqueólogo de los Sombrero de Paja?","Nico Robin",["Nami","Vivi","Carrot"]],
["¿Qué organización gobierna gran parte del mundo de One Piece?","Gobierno Mundial",["Cuerpo de Exploración","Akatsuki","Los Homúnculos"]],
["¿Qué especie es Jinbe?","Hombre-pez",["Gigante","Mink zorro","Cyborg humano"]],
["¿Qué género combina la serie?","Aventura y piratas",["Cocina competitiva","Horror escolar","Drama médico"]]
],
demonslayer:[
["¿Cómo se llama el protagonista de Demon Slayer?","Tanjiro Kamado",["Zenitsu Agatsuma","Inosuke Hashibira","Giyu Tomioka"]],
["¿Cómo se llama la hermana de Tanjiro?","Nezuko Kamado",["Kanao Tsuyuri","Shinobu Kocho","Mitsuri Kanroji"]],
["¿Qué organización combate a los demonios?","Cuerpo de Exterminio de Demonios",["Cuerpo de Exploración","Akatsuki","Seguridad Pública"]],
["¿Qué respiración utiliza Tanjiro al principio de su entrenamiento?","Respiración del Agua",["Respiración del Viento","Respiración de la Serpiente","Respiración de la Bestia"]],
["¿Quién entrena a Tanjiro al principio?","Sakonji Urokodaki",["Kyojuro Rengoku","Tengen Uzui","Muzan Kibutsuji"]],
["¿Qué característica tiene Nezuko tras convertirse en demonio?","Puede reducir su tamaño",["Puede usar alquimia","Puede convertirse en titán","Puede escribir en la Death Note"]],
["¿Quién es el demonio principal de la historia?","Muzan Kibutsuji",["Akaza","Enmu","Rui"]],
["¿Qué utiliza Zenitsu para luchar cuando está inconsciente?","Respiración del Rayo",["Respiración de la Niebla","Respiración de la Flor","Respiración del Amor"]],
["¿Qué arma utilizan los cazadores de demonios?","Espadas Nichirin",["Zanpakutō de shinigami","Armas de alquimia","Poké Balls"]],
["¿Quién es conocido como el Pilar de la Llama?","Kyojuro Rengoku",["Giyu Tomioka","Muichiro Tokito","Sanemi Shinazugawa"]],
["¿Cómo se llama el chico que lleva una máscara de jabalí?","Inosuke Hashibira",["Genya Shinazugawa","Yushiro","Murata"]],
["¿Qué debilidad clásica tienen los demonios de la serie?","La luz del sol",["El agua salada","La electricidad únicamente","La plata siempre"]],
["¿Quién es el Pilar del Agua?","Giyu Tomioka",["Tengen Uzui","Obanai Iguro","Gyomei Himejima"]],
["¿Qué familia protagoniza la historia?","La familia Kamado",["La familia Elric","La familia Uchiha","La familia Forger"]],
["¿Qué género define mejor Demon Slayer?","Acción y fantasía oscura",["Cocina y romance","Deportes y ciencia","Comedia política"]]
],
deathnote:[
["¿Cómo se llama el protagonista que encuentra el cuaderno?","Light Yagami",["L Lawliet","Near","Mello"]],
["¿Qué ocurre cuando se escribe un nombre en la Death Note?","La persona puede morir",["La persona obtiene poderes mágicos","La persona se vuelve invisible","La persona viaja en el tiempo"]],
["¿Cómo se llama el shinigami que deja caer el cuaderno?","Ryuk",["Rem","Gelus","Sidoh"]],
["¿Qué detective intenta atrapar a Light?","L",["Near","Matsuda","Soichiro Yagami"]],
["¿Qué necesita saber el usuario para matar con el cuaderno?","El nombre y el rostro de la persona",["Solo su color favorito","Su dirección exacta siempre","Su número de teléfono únicamente"]],
["¿Cómo se llama la idol que también posee una Death Note?","Misa Amane",["Kiyomi Takada","Naomi Misora","Sayu Yagami"]],
["¿Qué título recibe Light en sus acciones como Kira?","Kira",["Luffy","Hokage","Alquimista de Acero"]],
["¿Qué es Ryuk?","Un shinigami",["Un detective humano","Un ghoul","Un alquimista"]],
["¿Qué desea crear Light mediante el cuaderno?","Un mundo sin criminales según su ideal",["Un nuevo reino pirata","Una academia de cocina","Una aldea ninja"]],
["¿Qué tipo de historia es Death Note?","Suspenso psicológico",["Comedia culinaria","Deportes escolares","Aventura espacial"]],
["¿Qué hace especial a L como investigador?","Su capacidad deductiva",["Su magia de fuego","Su poder de titán","Su control de Pokémon"]],
["¿Qué alimento le gusta mucho a Ryuk?","Manzanas",["Patatas fritas","Curry picante","Pescado crudo"]],
["¿Qué regla puede extender la vida de un shinigami en circunstancias específicas?","Escribir el nombre de alguien para salvar a una persona por amor",["Comer una manzana","Usar alquimia humana","Ganar una competencia"]],
["¿Quién es el padre de Light?","Soichiro Yagami",["L Lawliet","Teru Mikami","Touta Matsuda"]],
["¿Qué elemento central explora la serie?","La justicia y el abuso del poder",["La cocina profesional","La piratería espacial","Los torneos deportivos"]]
],
spyfamily:[
["¿Cómo se llama el espía conocido como Twilight?","Loid Forger",["Yor Briar","Franky Franklin","Damian Desmond"]],
["¿Qué habilidad secreta tiene Anya?","Leer pensamientos",["Controlar el fuego","Viajar en el tiempo","Transformarse en perro"]],
["¿Cuál es la profesión secreta de Yor?","Asesina",["Espía","Detective","Cocinera profesional"]],
["¿Cómo se llama el perro de la familia Forger?","Bond",["Pochita","Hawk","Happy"]],
["¿Qué nombre usa Loid en su identidad familiar?","Loid Forger",["Loid Briar","Donovan Forger","Henry Henderson"]],
["¿Por qué Loid crea una familia?","Para cumplir una misión de espionaje",["Para encontrar el One Piece","Para convertirse en Hokage","Para participar en un concurso culinario"]],
["¿Qué escuela frecuenta Anya?","Academia Eden",["Academia U.A.","Academia Totsuki","Escuela de Tokio"]],
["¿Qué puede ver Bond en algunas de sus visiones?","Posibles acontecimientos futuros",["Los pensamientos de todos","El futuro exacto sin excepción","La ubicación de todas las Death Notes"]],
["¿Qué le gusta comer a Anya?","Cacahuetes",["Manzanas","Patatas fritas","Ramen exclusivamente"]],
["¿Qué relación tiene Yuri Briar con Yor?","Es su hermano menor",["Es su padre","Es su hijo","Es su compañero de espionaje"]],
["¿Qué organización emplea a Loid?","WISE",["Akatsuki","Marina","Cuerpo de Exploración"]],
["¿Qué habilidad tiene Yor además de su vida normal?","Es una asesina muy hábil",["Es una hechicera de maldiciones","Es una capitana pirata","Es una alquimista estatal"]],
["¿Qué tono mezcla la serie?","Comedia, espionaje y vida familiar",["Terror de supervivencia únicamente","Cocina competitiva","Documental militar"]],
["¿Cuál es el nombre en clave de Loid?","Twilight",["Thorn Princess","Nightfall","Handler"]],
["¿Qué hace Anya para intentar ayudar a su familia?","Usa lo que sabe al leer pensamientos",["Escribe nombres en un cuaderno","Caza titanes","Invoca dragones"]]
],
hxh:[
["¿Cómo se llama el protagonista de Hunter x Hunter?","Gon Freecss",["Killua Zoldyck","Kurapika","Leorio"]],
["¿Qué busca Gon al inicio de la historia?","Encontrar a su padre",["Ser Rey Pirata","Encontrar la Piedra Filosofal","Convertirse en Hokage"]],
["¿Cómo se llama el mejor amigo de Gon?","Killua Zoldyck",["Hisoka","Chrollo","Illumi"]],
["¿Qué energía utilizan los cazadores en combate avanzado?","Nen",["Chakra","Ether Gear","Energía maldita"]],
["¿Qué arma o estilo caracteriza a Kurapika en combate?","Cadenas",["Una motosierra","Un grimorio","Una espada Nichirin"]],
["¿Qué profesión intenta conseguir Gon?","Cazador",["Alquimista estatal","Chef de Totsuki","Shinigami"]],
["¿De qué familia procede Killua?","Zoldyck",["Uchiha","Elric","Forger"]],
["¿Qué personaje es un luchador impredecible y peligroso?","Hisoka",["Maes Hughes","Kento Nanami","Soma Yukihira"]],
["¿Qué organización criminal aparece en la serie?","Brigada Fantasma",["Akatsuki únicamente","Equipo Rocket","Los Homúnculos"]],
["¿Qué busca Kurapika vengar?","La masacre de su clan",["La destrucción de su barco","La pérdida de su restaurante","La derrota de su equipo escolar"]],
["¿Quién es el padre de Gon?","Ging Freecss",["Silva Zoldyck","Netero","Leorio"]],
["¿Qué tipo de examen realizan los aspirantes al principio?","Examen de Cazador",["Examen de Hokage","Shokugeki","Examen de alquimia estatal"]],
["¿Qué personaje es conocido por sus habilidades médicas y su ambición de ser médico?","Leorio",["Hisoka","Feitan","Phinks"]],
["¿Qué tipo de mundo presenta Hunter x Hunter?","Aventura con criaturas, pruebas y cazadores",["Solo una escuela de cocina","Una historia de piratas espaciales","Un drama médico realista"]],
["¿Qué característica tiene el Nen?","Permite desarrollar habilidades según el usuario",["Es una libreta sobrenatural","Es una espada mágica única","Es una forma de cocinar"]]
],
bleach:[
["¿Cómo se llama el protagonista de Bleach?","Ichigo Kurosaki",["Uryu Ishida","Renji Abarai","Kisuke Urahara"]],
["¿Qué es Rukia Kuchiki?","Una shinigami",["Una titán","Una alquimista","Una ghoul"]],
["¿Cómo se llama la espada de un shinigami?","Zanpakutō",["Nichirin","Grimorio","Poké Ball"]],
["¿Qué grito acompaña una técnica famosa de Ichigo?","Getsuga Tenshō",["Rasengan","Kamehameha","Black Flash"]],
["¿Qué organización protege el equilibrio de almas?","Gotei 13",["Akatsuki","WISE","Toros Negros"]],
["¿Cómo se llaman los seres espirituales que devoran almas?","Hollows",["Homúnculos","Titanes","Pokémon"]],
["¿Quién es el compañero de Ichigo experto en Quincy?","Uryu Ishida",["Renji Abarai","Kon","Yasutora Sado"]],
["¿Quién es el capitán de la décima división conocido por su cabello blanco?","Toshiro Hitsugaya",["Byakuya Kuchiki","Kenpachi Zaraki","Sajin Komamura"]],
["¿Qué es un Bankai?","Una liberación avanzada de una Zanpakutō",["Una técnica de cocina","Un rango de cazador","Una clase de grimorio"]],
["¿Quién es el padre de Ichigo?","Isshin Kurosaki",["Kisuke Urahara","Jushiro Ukitake","Genryusai Yamamoto"]],
["¿Cómo se llama la hermana de Rukia?","Hisana Kuchiki",["Orihime Inoue","Rangiku Matsumoto","Yoruichi Shihouin"]],
["¿Qué habilidad tiene Orihime?","Rechazar fenómenos mediante sus poderes",["Controlar titanes","Leer Death Notes","Usar anti-magia"]],
["¿Quién es conocido como el capitán de la undécima división?","Kenpachi Zaraki",["Sosuke Aizen","Toshiro Hitsugaya","Shinji Hirako"]],
["¿Qué lugar es el hogar de los shinigami?","Sociedad de Almas",["Amestris","Liones","Clover"]],
["¿Qué género predomina en Bleach?","Acción sobrenatural",["Cocina competitiva","Deportes escolares","Comedia romántica"]]
],
sololeveling:[
["¿Cómo se llama el protagonista de Solo Leveling?","Sung Jinwoo",["Sung Jinah","Yoo Jinho","Go Gunhee"]],
["¿Qué rango tenía Jinwoo al comienzo?","Rango E",["Rango S","Rango A","Rango Nacional"]],
["¿Qué capacidad especial obtiene Jinwoo?","Subir de nivel como un jugador",["Leer Death Notes","Crear grimorios","Controlar titanes"]],
["¿Cómo se llama la habilidad que le permite formar un ejército de sombras?","Extracción de sombras",["Respiración del Rayo","Alquimia estatal","Dominio Infinito"]],
["¿Qué tipo de criaturas aparecen en portales?","Monstruos",["Solo animales normales","Piratas","Chef profesionales"]],
["¿Qué profesión tiene Jinwoo al inicio?","Cazador",["Chef","Espía","Ninja"]],
["¿Quién es Yoo Jinho?","Un cazador que se vuelve aliado de Jinwoo",["El padre de Jinwoo","El principal antagonista desde el inicio","Un profesor de cocina"]],
["¿Qué significa que un portal se abra en el mundo?","Puede aparecer una mazmorra peligrosa",["Empieza un concurso culinario","Se celebra un examen ninja","Todos se vuelven invisibles"]],
["¿Qué personaje es la hermana de Jinwoo?","Sung Jinah",["Cha Hae-In","Esil Radiru","Lee Joohee"]],
["¿Quién es una cazadora de rango S que se acerca a Jinwoo?","Cha Hae-In",["Mikasa Ackerman","Yor Forger","Noelle Silva"]],
["¿Qué tipo de historia es Solo Leveling?","Acción y fantasía con progresión de poder",["Cocina escolar","Drama histórico realista","Deportes de equipo"]],
["¿Qué interfaz ve Jinwoo tras despertar su habilidad?","Una interfaz similar a un videojuego",["Una Death Note","Una Pokédex","Un grimorio de cinco hojas"]],
["¿Qué hace especial a Jinwoo en comparación con otros cazadores?","Puede fortalecerse continuamente mediante niveles",["No puede combatir","Solo sabe cocinar","No puede entrar en mazmorras"]],
["¿Qué amenaza enfrentan los cazadores?","Monstruos de mazmorras",["Únicamente exámenes escolares","Piratas de mar abierto","Pandillas urbanas"]],
["¿Qué recurso utiliza Jinwoo para formar su ejército?","Sombras de enemigos derrotados",["Poké Balls","Clones de sombra ninja","Piedras filosofales"]]
],
chainsaw:[
["¿Cómo se llama el protagonista de Chainsaw Man?","Denji",["Aki Hayakawa","Kishibe","Beam"]],
["¿Cómo se llama el demonio-perro que acompaña a Denji?","Pochita",["Kon","Beam","Meowy"]],
["¿Qué parte del cuerpo de Denji se transforma en motosierra?","La cabeza y los brazos",["Solo las piernas","La espalda","Los ojos"]],
["¿Quién recluta a Denji para Seguridad Pública?","Makima",["Power","Himeno","Kobeni"]],
["¿Qué es Power?","Una demonio de sangre",["Una cazadora humana sin poderes","Una shinigami","Una alquimista"]],
["¿Qué contrato tiene Aki con el Demonio Zorro?","Puede invocarlo diciendo 'Kon'",["Puede controlar el tiempo","Puede resucitar a cualquiera","Puede crear comida"]],
["¿Cómo se llama el demonio que se vincula con Aki por un contrato?","Demonio del Futuro",["Demonio de la Cocina","Demonio del Agua","Demonio de las Sombras"]],
["¿Qué temen los demonios según la lógica de la serie?","Los conceptos que generan miedo",["Solo los animales","Las recetas de cocina","Los juegos de cartas"]],
["¿Qué división integra Denji al principio?","Seguridad Pública",["Cuerpo de Exploración","Gotei 13","Toros Negros"]],
["¿Qué mascota busca Power recuperar?","Meowy",["Pochita","Bond","Emul"]],
["¿Qué personaje trabaja con Denji y usa una espada en combate?","Aki Hayakawa",["Kishibe","Soma Yukihira","Ging Freecss"]],
["¿Qué relación especial tiene Pochita con Denji?","Se convierte en su corazón",["Es su padre","Es su profesor","Es su rival escolar"]],
["¿Qué personaje es un cazador veterano y mentor?","Kishibe",["Soma Yukihira","Ging Freecss","Yami Sukehiro"]],
["¿Qué género combina la serie?","Acción, horror y humor negro",["Deportes y cocina","Solo romance","Documental de naturaleza"]],
["¿Qué suele motivar a Denji al inicio?","Deseos sencillos y una vida mejor",["Ser Rey Pirata","Encontrar al Hokage","Ser el mejor alquimista"]]
],
mha:[
["¿Cuál es el nombre real de Deku?","Izuku Midoriya",["Katsuki Bakugo","Shoto Todoroki","Tenya Iida"]],
["¿Qué héroe le transmite One For All a Izuku?","All Might",["Endeavor","Hawks","Best Jeanist"]],
["¿Cómo se llama la academia de héroes?","U.A.",["Totsuki","Eden","Técnica de Tokio"]],
["¿Qué don usa Katsuki Bakugo?","Explosión",["Hielo y fuego","Cinta adhesiva","Gravedad cero"]],
["¿Qué don tiene Ochaco Uraraka?","Gravedad Cero",["Copia","Endurecimiento","Motor"]],
["¿Quién es el padre de Shoto Todoroki?","Endeavor",["All Might","Present Mic","Hawks"]],
["¿Qué hace el don de Shoto?","Usa hielo y fuego",["Se vuelve invisible","Controla plantas","Crea portales"]],
["¿Quién es el profesor de la clase 1-A que usa una bufanda?","Shota Aizawa",["Hizashi Yamada","Nezu","Sir Nighteye"]],
["¿Qué significa ser héroe profesional en la serie?","Usar dones para proteger a la sociedad",["Ser el líder de una pandilla","Cazar piratas","Investigar maldiciones"]],
["¿Qué organización reúne a villanos bajo Shigaraki?","Liga de Villanos",["Akatsuki","Brigada Fantasma","Homúnculos"]],
["¿Cuál es el nombre de héroe de Mirio Togata?","Lemillion",["Deku","Dynamight","Red Riot"]],
["¿Qué don tiene Tsuyu Asui?","Rana",["Fuego infernal","Cinta","Duplicación"]],
["¿Qué personaje puede endurecer su cuerpo?","Eijiro Kirishima",["Denki Kaminari","Minoru Mineta","Fumikage Tokoyami"]],
["¿Qué don tiene Denki Kaminari?","Electricidad",["Agua","Gravedad","Control de arena"]],
["¿Qué idea central explora My Hero Academia?","Ser héroe en una sociedad de dones",["La búsqueda de un tesoro pirata","El precio de la alquimia","La vida de cazadores en mazmorras"]]
],
tokyoghoul:[
["¿Quién es el protagonista de Tokyo Ghoul?","Ken Kaneki",["Koutarou Amon","Renji Yomo","Nishiki Nishio"]],
["¿Qué se convierte Kaneki tras un trasplante?","Un medio ghoul",["Un shinigami","Un titán","Un alquimista estatal"]],
["¿Qué necesitan comer los ghouls para sobrevivir?","Carne humana",["Solo frutas","Piedras mágicas","Píldoras de energía"]],
["¿Cómo se llama la cafetería que funciona como refugio?","Anteiku",["Totsuki","Axel","Edens Zero"]],
["¿Qué arma biológica usan los ghouls en combate?","Kagune",["Zanpakutō","Grimorio","Nen"]],
["¿Qué organización investiga y combate a los ghouls?","CCG",["WISE","Marina","Gotei 13"]],
["¿Qué color suele tener el cabello de Kaneki después de un cambio importante?","Blanco",["Verde","Azul","Naranja"]],
["¿Quién es una ghoul que trabaja en Anteiku y se acerca a Kaneki?","Touka Kirishima",["Rize Kamishiro","Akame","Mikasa Ackerman"]],
["¿Qué ocurre con el ojo de Kaneki cuando usa su poder ghoul?","Se vuelve rojo y negro",["Se vuelve dorado","Desaparece por completo","Brilla azul como un Sharingan"]],
["¿Qué apodo recibe el investigador Kishou Arima?","El Segador del CCG",["Rey Pirata","Rey Mago","Dios de la Destrucción"]],
["¿Qué es Rize Kamishiro para la transformación de Kaneki?","La fuente de los órganos trasplantados",["Su hermana","Su maestra de escuela","La líder de Anteiku"]],
["¿Qué tipo de máscara usa Kaneki en una etapa de la historia?","Una máscara que cubre un ojo y la boca",["Una máscara de zorro completa","Un casco de astronauta","Una máscara de cerdo"]],
["¿Qué dilema vive Kaneki?","Su identidad entre humano y ghoul",["Elegir un escuadrón mágico","Convertirse en pirata","Entrar en un torneo culinario"]],
["¿Qué género tiene Tokyo Ghoul?","Horror oscuro y acción sobrenatural",["Comedia de cocina","Deportes escolares","Aventura espacial"]],
["¿Qué café se vuelve un lugar importante para ghouls pacíficos?","Anteiku",["Baratie","Ichiraku","Witch's Shop"]]
]
};

const state = {
  selected: new Set(),
  level: "facil",
  qty: 5,
  questions: [],
  index: 0,
  correct: 0,
  wrong: 0,
  answered: false
};

const screens = ["selectScreen", "configScreen", "quizScreen", "resultScreen"];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showScreen(id) {
  screens.forEach(screen => {
    const element = $(screen);
    if (element) element.classList.toggle("active", screen === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAnimeList() {
  const search = $("animeSearch");
  const list = $("animeList");
  if (!search || !list) return;

  const term = search.value.trim().toLocaleLowerCase();
  const filtered = animeList.filter(anime =>
    (anime.name + " " + anime.genre).toLocaleLowerCase().includes(term)
  );

  list.innerHTML = "";

  filtered.forEach(anime => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "anime-card" +
      (state.selected.has(anime.id) ? " selected" : "");
    button.setAttribute("aria-pressed", String(state.selected.has(anime.id)));

    const mark = document.createElement("span");
    mark.className = "check-mark";
    mark.textContent = state.selected.has(anime.id) ? "✓" : "";

    const icon = document.createElement("span");
    icon.className = "anime-icon";
    icon.textContent = anime.icon;

    const name = document.createElement("span");
    name.className = "anime-name";
    name.textContent = anime.name;

    const genre = document.createElement("span");
    genre.className = "anime-genre";
    genre.textContent = anime.genre;

    const info = document.createElement("span");
    info.append(name, genre);
    button.append(mark, icon, info);

    button.addEventListener("click", () => {
      if (state.selected.has(anime.id)) {
        state.selected.delete(anime.id);
      } else {
        state.selected.add(anime.id);
      }
      renderAnimeList();
      updateSelected();
    });

    list.appendChild(button);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No encontramos animes con esa búsqueda.";
    list.appendChild(empty);
  }
}

function updateSelected() {
  $("selectedCount").textContent = state.selected.size;
  $("toConfigBtn").disabled = state.selected.size === 0;
  $("selectAllBtn").textContent =
    state.selected.size === animeList.length
      ? "Quitar selección"
      : "Seleccionar todos";
}

function setSelectedButton(selector, attr, value) {
  document.querySelectorAll(selector).forEach(button => {
    button.classList.toggle(
      "selected",
      button.getAttribute(attr) === String(value)
    );
  });
}

function buildQuestions() {
  const all = [];

  [...state.selected].forEach(id => {
    const anime = animeList.find(item => item.id === id);
    const questions = BANK[id] || [];

    questions.forEach(item => {
      const [question, correct, distractors] = item;
      all.push({
        anime: anime.name,
        question,
        correct,
        options: shuffle([correct, ...distractors])
      });
    });
  });

  let ordered = shuffle(all);

  // Dificultad: cambia la cantidad de respuestas difíciles en una partida.
  // Las preguntas siguen siendo de los animes seleccionados.
  if (state.level === "dificil") {
    ordered = ordered.reverse();
  }

  return ordered.slice(0, Math.min(state.qty, ordered.length));
}

function startQuiz() {
  if (state.selected.size === 0) {
    $("configNotice").textContent = "Selecciona al menos un anime para comenzar.";
    return;
  }

  state.questions = buildQuestions();
  state.index = 0;
  state.correct = 0;
  state.wrong = 0;
  state.answered = false;

  if (state.questions.length === 0) {
    $("configNotice").textContent = "No hay preguntas disponibles.";
    return;
  }

  $("configNotice").textContent = "";
  showScreen("quizScreen");
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  if (!question) return;

  state.answered = false;

  $("questionCount").textContent =
    `PREGUNTA ${state.index + 1} / ${state.questions.length}`;
  $("questionNumber").textContent =
    `PREGUNTA ${String(state.index + 1).padStart(2, "0")}`;
  $("progressBar").style.width =
    `${(state.index / state.questions.length) * 100}%`;
  $("animeTag").textContent = question.anime.toLocaleUpperCase();
  $("scoreLive").textContent = `✦ ${state.correct} puntos`;
  $("questionText").textContent = question.question;

  $("feedbackBox").textContent = "";
  $("feedbackBox").className = "feedback-box";
  $("optionsList").innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = LETTERS[index];

    const answer = document.createElement("span");
    answer.textContent = option;

    button.append(letter, answer);
    button.addEventListener("click", () => answerQuestion(option, button));
    $("optionsList").appendChild(button);
  });

  $("nextBtn").disabled = true;
  $("nextBtn").textContent =
    state.index === state.questions.length - 1
      ? "Ver resultado ✦"
      : "Siguiente pregunta →";
}

function answerQuestion(option, clickedButton) {
  if (state.answered) return;

  state.answered = true;
  const question = state.questions[state.index];
  const isCorrect = option === question.correct;

  if (isCorrect) {
    state.correct++;
  } else {
    state.wrong++;
  }

  document.querySelectorAll("#optionsList .option-btn").forEach(button => {
    button.disabled = true;
    const text = button.querySelector("span:last-child").textContent;

    if (text === question.correct) {
      button.classList.add("correct");
    } else if (button === clickedButton && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  $("feedbackBox").className =
    "feedback-box " + (isCorrect ? "good" : "bad");

  $("feedbackBox").textContent = isCorrect
    ? "¡Correcto! Tu conocimiento otaku está creciendo."
    : `No exactamente. La respuesta correcta es: ${question.correct}.`;

  $("scoreLive").textContent = `✦ ${state.correct} puntos`;
  $("nextBtn").disabled = false;
}

function nextQuestion() {
  if (!state.answered) return;

  if (state.index < state.questions.length - 1) {
    state.index++;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const total = state.questions.length;
  const percent = total ? Math.round((state.correct / total) * 100) : 0;

  $("progressBar").style.width = "100%";
  $("finalScore").textContent = `${percent}%`;
  $("correctCount").textContent = state.correct;
  $("wrongCount").textContent = state.wrong;
  $("totalCount").textContent = total;

  let icon = "📚";
  let title = "¡Sigue entrenando!";
  let message = "Cada partida te ayuda a recordar más detalles de tus animes favoritos.";

  if (percent === 100) {
    icon = "👑";
    title = "¡Leyenda Otaku!";
    message = "¡Perfecto! Respondiste todas las preguntas correctamente.";
  } else if (percent >= 80) {
    icon = "🏆";
    title = "¡Otaku de élite!";
    message = "¡Excelente resultado! Conoces muy bien estos universos.";
  } else if (percent >= 60) {
    icon = "⚡";
    title = "¡Buen trabajo!";
    message = "Vas por buen camino. Sigue practicando.";
  } else if (percent >= 35) {
    icon = "🔥";
    title = "¡No te rindas!";
    message = "Repasa tus animes favoritos y vuelve a intentarlo.";
  }

  $("resultIcon").textContent = icon;
  $("resultTitle").textContent = title;
  $("resultMessage").textContent = message;

  showScreen("resultScreen");
}

function connectEvents() {
  $("animeSearch").addEventListener("input", renderAnimeList);

  $("selectAllBtn").addEventListener("click", () => {
    if (state.selected.size === animeList.length) {
      state.selected.clear();
    } else {
      animeList.forEach(anime => state.selected.add(anime.id));
    }

    renderAnimeList();
    updateSelected();
  });

  $("toConfigBtn").addEventListener("click", () => {
    if (!state.selected.size) return;
    $("configNotice").textContent = "";
    showScreen("configScreen");
  });

  $("backToAnime").addEventListener("click", () => {
    showScreen("selectScreen");
  });

  document.querySelectorAll(".level-btn").forEach(button => {
    button.addEventListener("click", () => {
      state.level = button.dataset.level;
      setSelectedButton(".level-btn", "data-level", state.level);
    });
  });

  document.querySelectorAll(".qty-btn").forEach(button => {
    button.addEventListener("click", () => {
      state.qty = Number(button.dataset.qty);
      setSelectedButton(".qty-btn", "data-qty", state.qty);
    });
  });

  $("startBtn").addEventListener("click", startQuiz);
  $("nextBtn").addEventListener("click", nextQuestion);

  $("quitBtn").addEventListener("click", () => {
    if (confirm("¿Quieres salir de esta partida? Perderás el progreso actual.")) {
      showScreen("configScreen");
    }
  });

  $("retryBtn").addEventListener("click", startQuiz);
  $("homeBtn").addEventListener("click", () => showScreen("selectScreen"));

  $("brandHome").addEventListener("click", event => {
    event.preventDefault();
    showScreen("selectScreen");
  });
}

function init() {
  connectEvents();
  renderAnimeList();
  updateSelected();
}

document.addEventListener("DOMContentLoaded", init);