"use strict";

const $ = (id) => document.getElementById(id);

const animeSeed = [
  ["Nanatsu no Taizai", "⚔️", "Fantasia"],
  ["Attack on Titan", "🧱", "Ação"],
  ["Shangri-La Frontier", "🎮", "Aventura"],
  ["Edens Zero", "🚀", "Ficção científica"],
  ["Jujutsu Kaisen", "👊", "Ação"],
  ["Pokémon", "⚡", "Aventura"],
  ["Dragon Ball Z", "🐉", "Ação"],
  ["Food Wars! Shokugeki no Soma", "🍳", "Culinária"],
  ["KonoSuba", "💥", "Comédia"],
  ["Naruto", "🍥", "Ninja"],
  ["Black Clover", "🍀", "Fantasia"],
  ["Plunderer", "🗡️", "Fantasia"],
  ["Tokyo Revengers", "⏳", "Drama"],
  ["Fullmetal Alchemist: Brotherhood", "⚗️", "Aventura"],
  ["One Piece", "🏴‍☠️", "Aventura"],
  ["Demon Slayer", "🌊", "Ação"],
  ["Death Note", "📓", "Suspense"],
  ["My Hero Academia", "🦸", "Super-heróis"],
  ["Hunter x Hunter", "🎯", "Aventura"],
  ["Bleach", "⚔️", "Ação"],
  ["Chainsaw Man", "🪚", "Ação"],
  ["Spy x Family", "🕵️", "Comédia"],
  ["Haikyuu!!", "🏐", "Esportes"],
  ["Blue Lock", "⚽", "Esportes"],
  ["Sword Art Online", "🗡️", "Aventura"],
  ["Frieren", "✨", "Fantasia"],
  ["Sailor Moon", "🌙", "Fantasia"],
  ["Cardcaptor Sakura", "🪄", "Fantasia"],
  ["JoJo's Bizarre Adventure", "💪", "Ação"],
  ["Mob Psycho 100", "👻", "Sobrenatural"],
  ["Re:Zero", "🔄", "Fantasia"],
  ["Dr. Stone", "🧪", "Ciência"],
  ["Vinland Saga", "🛡️", "Histórico"],
  ["Tokyo Ghoul", "👹", "Terror"],
  ["Steins;Gate", "⌚", "Ficção científica"],
  ["Code Geass", "♟️", "Mecha"],
  ["The Promised Neverland", "🏡", "Suspense"],
  ["Assassination Classroom", "🎯", "Comédia"],
  ["Oshi no Ko", "⭐", "Drama"],
  ["Solo Leveling", "🌑", "Ação"],
  ["Neon Genesis Evangelion", "🤖", "Mecha"],
  ["Inuyasha", "🐕", "Fantasia"],
  ["Detective Conan", "🔎", "Mistério"],
  ["Fruits Basket", "🍙", "Romance"],
  ["Toradora!", "🐯", "Romance"],
  ["The Apothecary Diaries", "🌿", "Mistério"],
  ["Dandadan", "👽", "Sobrenatural"],
  ["Seven Deadly Sins", "🦁", "Fantasia"],
  ["Hellsing Ultimate", "🧛", "Terror"],
  ["Mushoku Tensei", "🪄", "Fantasia"],
  ["Kuroko's Basketball", "🏀", "Esportes"],
  ["Violet Evergarden", "✉️", "Drama"],
  ["Bocchi the Rock!", "🎸", "Música"],
  ["Your Name", "☄️", "Romance"],
  ["Fullmetal Alchemist", "⚙️", "Aventura"],
  ["The Disastrous Life of Saiki K.", "🧠", "Comédia"]
];

const questionBank = {
  "Nanatsu no Taizai": [
    ["¿Cómo se llama el líder de los Siete Pecados Capitales?", ["Meliodas", "Ban", "King", "Escanor"], 0],
    ["¿Qué pecado representa Ban?", ["Ira", "Avaricia", "Envidia", "Pereza"], 1],
    ["¿Cómo se llama la princesa que busca a los Pecados Capitales?", ["Merlín", "Diane", "Elizabeth", "Elaine"], 2]
  ],
  "Attack on Titan": [
    ["¿Cómo se llama el protagonista de la historia?", ["Armin Arlert", "Eren Yeager", "Levi Ackerman", "Jean Kirstein"], 1],
    ["¿Qué muralla es la más exterior al inicio de la historia?", ["Maria", "Rose", "Sina", "Orvud"], 0],
    ["¿Quién es conocido como el capitán más fuerte de la humanidad?", ["Erwin", "Reiner", "Levi", "Connie"], 2]
  ],
  "Shangri-La Frontier": [
    ["¿Cuál es el nombre de jugador de Rakuro Hizutome?", ["Sunraku", "Pencilgon", "Oikatzo", "Vysache"], 0],
    ["¿Qué tipo de jugador es Rakuro antes de jugar Shangri-La Frontier?", ["Jugador de juegos difíciles", "Jugador profesional de fútbol", "Creador de videojuegos", "Jugador de cartas"], 0]
  ],
  "Edens Zero": [
    ["¿Cómo se llama el protagonista de Edens Zero?", ["Natsu", "Shiki Granbell", "Gray", "Luffy"], 1],
    ["¿Cómo se llama la compañera androide de Shiki?", ["Lucy", "Rebecca Bluegarden", "Wendy", "Erza"], 1]
  ],
  "Jujutsu Kaisen": [
    ["¿Quién es el protagonista de Jujutsu Kaisen?", ["Megumi Fushiguro", "Yuji Itadori", "Satoru Gojo", "Yuta Okkotsu"], 1],
    ["¿Quién es el maestro de Yuji en la escuela de hechicería?", ["Nanami", "Geto", "Gojo", "Sukuna"], 2],
    ["¿Qué objeto maldito ingiere Yuji al comienzo?", ["Un ojo", "Un dedo de Sukuna", "Un anillo", "Una espada"], 1]
  ],
  "Pokémon": [
    ["¿Cuál es el Pokémon más conocido de Ash?", ["Charmander", "Pikachu", "Bulbasaur", "Eevee"], 1],
    ["¿Qué tipo es Squirtle?", ["Fuego", "Planta", "Agua", "Eléctrico"], 2],
    ["¿En qué evoluciona Pikachu usando una Piedra Trueno?", ["Raichu", "Pichu", "Electabuzz", "Jolteon"], 0]
  ],
  "Dragon Ball Z": [
    ["¿Cuál es el nombre de nacimiento de Goku?", ["Vegeta", "Kakarotto", "Bardock", "Raditz"], 1],
    ["¿Quién es el príncipe de los Saiyajin?", ["Gohan", "Trunks", "Vegeta", "Broly"], 2],
    ["¿Cuántas Esferas del Dragón se necesitan para invocar a Shenlong?", ["Cinco", "Seis", "Siete", "Ocho"], 2]
  ],
  "Food Wars! Shokugeki no Soma": [
    ["¿Cómo se llama el protagonista de Shokugeki no Soma?", ["Soma Yukihira", "Takumi Aldini", "Joichiro Saiba", "Megumi Tadokoro"], 0],
    ["¿Qué habilidad es central en los desafíos de la serie?", ["Cocina", "Magia", "Carreras", "Combate con espadas"], 0]
  ],
  "KonoSuba": [
    ["¿Cómo se llama el protagonista de KonoSuba?", ["Kazuma Satou", "Subaru Natsuki", "Rudeus Greyrat", "Kirito"], 0],
    ["¿Qué diosa acompaña a Kazuma?", ["Aqua", "Eris", "Hestia", "Athena"], 0],
    ["¿Cuál es la especialidad mágica de Megumin?", ["Curación", "Explosión", "Agua", "Hielo"], 1]
  ],
  "Naruto": [
    ["¿Cuál es el sueño de Naruto Uzumaki?", ["Ser Hokage", "Ser Kazekage", "Ser samurái", "Ser médico"], 0],
    ["¿Cómo se llama el equipo de Naruto, Sasuke y Sakura?", ["Equipo 7", "Equipo 8", "Equipo 10", "Equipo Guy"], 0],
    ["¿Quién selló al Zorro de Nueve Colas dentro de Naruto?", ["Kakashi", "Minato", "Jiraiya", "Hiruzen"], 1]
  ],
  "Black Clover": [
    ["¿Qué quiere llegar a ser Asta?", ["Rey Mago", "Rey de los Piratas", "Hokage", "Caballero Sagrado"], 0],
    ["¿Qué distingue la magia de Asta?", ["Controla el tiempo", "Usa anti-magia", "Controla el agua", "Lee mentes"], 1]
  ],
  "Plunderer": [
    ["¿Cómo se llama la protagonista que busca a un legendario as?", ["Hina", "Licht", "Jail", "Lynn"], 0],
    ["¿Qué elemento numérico es importante en el mundo de Plunderer?", ["Los conteos", "Las cartas", "Las monedas", "Los colores"], 0]
  ],
  "Tokyo Revengers": [
    ["¿Quién es el protagonista de Tokyo Revengers?", ["Takemichi Hanagaki", "Mikey", "Draken", "Chifuyu"], 0],
    ["¿Cómo se llama la banda de Mikey?", ["Valhalla", "Toman", "Black Dragon", "Tenjiku"], 1],
    ["¿Qué capacidad permite a Takemichi intentar cambiar el futuro?", ["Viajar en el tiempo", "Volar", "Leer mentes", "Volverse invisible"], 0]
  ],
  "Fullmetal Alchemist: Brotherhood": [
    ["¿Cómo se llaman los dos hermanos protagonistas?", ["Edward y Alphonse", "Roy y Riza", "Ling y Lan Fan", "Scar y Yoki"], 0],
    ["¿Qué pierna pierde Edward durante el intento de transmutación humana?", ["La derecha", "La izquierda", "Ambas piernas", "Ninguna"], 0],
    ["¿Qué principio rige la alquimia en la serie?", ["Equivalencia de intercambio", "Destino inevitable", "Magia sin límites", "Poder de la amistad"], 0]
  ],
  "One Piece": [
    ["¿Cuál es el sueño de Monkey D. Luffy?", ["Ser Hokage", "Ser Rey de los Piratas", "Ser almirante", "Encontrar las Esferas del Dragón"], 1],
    ["¿Cómo se llama el espadachín de los Sombrero de Paja?", ["Sanji", "Usopp", "Roronoa Zoro", "Franky"], 2],
    ["¿Qué fruta comió Luffy al principio de la historia original?", ["Mera Mera no Mi", "Gomu Gomu no Mi", "Hie Hie no Mi", "Ope Ope no Mi"], 1]
  ],
  "Demon Slayer": [
    ["¿Cómo se llama la hermana de Tanjiro?", ["Kanao", "Mitsuri", "Nezuko", "Shinobu"], 2],
    ["¿Qué arma utilizan principalmente los cazadores de demonios?", ["Katana Nichirin", "Arco mágico", "Lanza de hierro", "Hacha de piedra"], 0],
    ["¿Quién entrena a Tanjiro al comienzo?", ["Urokodaki", "Rengoku", "Tengen", "Sanemi"], 0]
  ],
  "Death Note": [
    ["¿Quién encuentra el cuaderno Death Note al comienzo?", ["L", "Light Yagami", "Near", "Misa"], 1],
    ["¿Cómo se llama el shinigami que acompaña a Light?", ["Rem", "Ryuk", "Sidoh", "Gelus"], 1],
    ["¿Qué necesita escribir el usuario para que el cuaderno funcione?", ["El nombre de una persona", "Una dirección", "Una contraseña", "Un número de teléfono"], 0]
  ],
  "My Hero Academia": [
    ["¿Cómo se llama el protagonista de My Hero Academia?", ["Katsuki Bakugo", "Izuku Midoriya", "Shoto Todoroki", "Tenya Iida"], 1],
    ["¿Quién le transmite One For All a Izuku?", ["All Might", "Endeavor", "Aizawa", "Hawks"], 0]
  ],
  "Hunter x Hunter": [
    ["¿Qué busca Gon Freecss durante gran parte de la historia?", ["A su padre", "Una espada legendaria", "El One Piece", "Las Esferas del Dragón"], 0],
    ["¿Cómo se llama el mejor amigo de Gon?", ["Kurapika", "Leorio", "Killua", "Hisoka"], 2]
  ],
  "Bleach": [
    ["¿Cómo se llama el protagonista de Bleach?", ["Ichigo Kurosaki", "Renji Abarai", "Uryu Ishida", "Byakuya Kuchiki"], 0],
    ["¿Qué tipo de ser se convierte Ichigo al inicio?", ["Shinigami sustituto", "Demonio completo", "Titán", "Saiyajin"], 0]
  ],
  "Chainsaw Man": [
    ["¿Cómo se llama el protagonista de Chainsaw Man?", ["Denji", "Aki", "Kishibe", "Beam"], 0],
    ["¿Qué demonio está ligado a Denji?", ["Demonio Zorro", "Pochita, demonio motosierra", "Demonio Sangre", "Demonio Futuro"], 1]
  ],
  "Spy x Family": [
    ["¿Cuál es el nombre clave del espía Loid?", ["Twilight", "Nightfall", "Garden", "Handler"], 0],
    ["¿Qué habilidad especial tiene Anya?", ["Leer mentes", "Volar", "Controlar el fuego", "Viajar en el tiempo"], 0]
  ],
  "Haikyuu!!": [
    ["¿Qué deporte practican los protagonistas?", ["Baloncesto", "Voleibol", "Fútbol", "Béisbol"], 1],
    ["¿Cómo se llama el protagonista de baja estatura?", ["Tobio Kageyama", "Shoyo Hinata", "Kei Tsukishima", "Yu Nishinoya"], 1]
  ],
  "Blue Lock": [
    ["¿Qué deporte busca dominar el proyecto Blue Lock?", ["Voleibol", "Baloncesto", "Fútbol", "Rugby"], 2],
    ["¿Cómo se llama el protagonista?", ["Yoichi Isagi", "Meguru Bachira", "Rin Itoshi", "Seishiro Nagi"], 0]
  ],
  "Sword Art Online": [
    ["¿Cuál es el nombre de jugador de Kirito?", ["Kirito", "Klein", "Agil", "Heathcliff"], 0],
    ["¿Qué sucede con los jugadores atrapados al principio?", ["No pueden cerrar sesión libremente", "Pierden sus recuerdos", "Se convierten en monstruos", "Pierden sus poderes"], 0]
  ],
  "Frieren": [
    ["¿Qué tipo de ser es Frieren?", ["Elfa", "Humana", "Enana", "Dragón"], 0],
    ["¿Qué destaca especialmente en la percepción del tiempo de Frieren?", ["Su vida muy larga", "Su velocidad al correr", "Su fuerza física", "Su memoria perfecta"], 0]
  ],
  "Sailor Moon": [
    ["¿Cuál es la identidad civil de Sailor Moon?", ["Usagi Tsukino", "Rei Hino", "Ami Mizuno", "Makoto Kino"], 0],
    ["¿Qué objeto suele usar para transformarse?", ["Broche de transformación", "Libro de alquimia", "Anillo maldito", "Espada sagrada"], 0]
  ],
  "Cardcaptor Sakura": [
    ["¿Cómo se llama la protagonista?", ["Sakura Kinomoto", "Tomoyo Daidouji", "Nadeshiko", "Meiling"], 0],
    ["¿Qué cartas debe capturar Sakura?", ["Cartas Clow", "Cartas del Tarot", "Cartas Pokémon", "Cartas de duelo"], 0]
  ],
  "JoJo's Bizarre Adventure": [
    ["¿Qué nombre recibe una manifestación especial de poder en varias partes de JoJo?", ["Stand", "Quirk", "Nen", "Chakra"], 0],
    ["¿Qué familia está en el centro de la historia?", ["Joestar", "Uchiha", "Zoldyck", "Elric"], 0]
  ],
  "Mob Psycho 100": [
    ["¿Cómo se llama el protagonista conocido como Mob?", ["Shigeo Kageyama", "Reigen Arataka", "Ritsu Kageyama", "Teruki Hanazawa"], 0],
    ["¿Qué tipo de poder posee Mob?", ["Psíquico", "Alquimia", "Anti-magia", "Control del tiempo"], 0]
  ],
  "Re:Zero": [
    ["¿Cómo se llama el protagonista de Re:Zero?", ["Subaru Natsuki", "Kazuma Satou", "Kirito", "Shiki Granbell"], 0],
    ["¿Qué habilidad especial afecta la vida de Subaru?", ["Regresar tras morir", "Leer mentes", "Detener el tiempo a voluntad", "Clonar objetos"], 0]
  ],
  "Dr. Stone": [
    ["¿Cómo se llama el protagonista científico?", ["Senku Ishigami", "Taiju Oki", "Gen Asagiri", "Chrome"], 0],
    ["¿Qué le ocurre a gran parte de la humanidad al inicio?", ["Se petrifica", "Se vuelve invisible", "Se convierte en titanes", "Pierde la memoria"], 0]
  ],
  "Vinland Saga": [
    ["¿Cómo se llama el protagonista de la primera parte?", ["Thorfinn", "Canute", "Askeladd", "Thorkell"], 0],
    ["¿En qué contexto histórico se desarrolla la historia?", ["Época vikinga", "Imperio romano", "Japón moderno", "Antiguo Egipto"], 0]
  ],
  "Tokyo Ghoul": [
    ["¿Cómo se llama el protagonista de Tokyo Ghoul?", ["Ken Kaneki", "Hide Nagachika", "Koutarou Amon", "Nishiki Nishio"], 0],
    ["¿Qué criaturas aparecen en el centro de la historia?", ["Ghouls", "Titanes", "Hollows", "Demonios"], 0]
  ],
  "Steins;Gate": [
    ["¿Cómo se llama el protagonista que se hace llamar científico loco?", ["Rintaro Okabe", "Itaru Hashida", "Shuichi Akai", "Kaito Kuroba"], 0],
    ["¿Qué tema científico es central en la historia?", ["Viajes en el tiempo", "Alquimia medieval", "Clonación de dragones", "Magia elemental"], 0]
  ],
  "Code Geass": [
    ["¿Cuál es el nombre del protagonista?", ["Lelouch Lamperouge", "Suzaku Kururugi", "Schneizel", "Jeremiah"], 0],
    ["¿Qué poder recibe Lelouch?", ["Geass", "Nen", "Quirk", "Bankai"], 0]
  ],
  "The Promised Neverland": [
    ["¿Cómo se llama la protagonista de cabello naranja?", ["Emma", "Norman", "Ray", "Isabella"], 0],
    ["¿Dónde viven los niños al comienzo?", ["Grace Field House", "Academia U.A.", "Aldea de Konoha", "Ciudad Z"], 0]
  ],
  "Assassination Classroom": [
    ["¿Cómo se llama el profesor amarillo de la clase?", ["Koro-sensei", "All Might", "Kakashi", "Saitama"], 0],
    ["¿Qué tarea especial tienen sus alumnos?", ["Intentar asesinar a su profesor", "Encontrar un tesoro", "Cazar demonios", "Ganar un torneo de fútbol"], 0]
  ],
  "Oshi no Ko": [
    ["¿Qué industria ocupa un lugar central en la historia?", ["Entretenimiento e idol", "Piratería", "Fútbol profesional", "Alquimia"], 0],
    ["¿Cómo se llama la idol madre de Aqua y Ruby?", ["Ai Hoshino", "Kana Arima", "Akane Kurokawa", "MEM-cho"], 0]
  ],
  "Solo Leveling": [
    ["¿Cómo se llama el protagonista de Solo Leveling?", ["Sung Jinwoo", "Cha Hae-In", "Yoo Jinho", "Go Gunhee"], 0],
    ["¿Qué le permite crecer en poder de una manera especial?", ["Un sistema de niveles", "Una fruta del diablo", "Un cuaderno mágico", "Un Stand"], 0]
  ],
  "Neon Genesis Evangelion": [
    ["¿Cómo se llama el piloto principal del EVA-01?", ["Shinji Ikari", "Gendo Ikari", "Kaworu Nagisa", "Toji Suzuhara"], 0],
    ["¿Qué tipo de máquinas pilotean los protagonistas?", ["Unidades Evangelion", "Gundam", "Titanes", "Mechas de Blue Lock"], 0]
  ],
  "Inuyasha": [
    ["¿Qué tipo de ser es Inuyasha?", ["Medio demonio", "Vampiro", "Saiyajin", "Alquimista"], 0],
    ["¿Cómo se llama la protagonista que viaja al Japón feudal?", ["Kagome Higurashi", "Sango", "Kikyo", "Rin"], 0]
  ],
  "Detective Conan": [
    ["¿Cuál es el nombre real de Conan?", ["Shinichi Kudo", "Heiji Hattori", "Kaito Kuroba", "Kogoro Mouri"], 0],
    ["¿Qué le sucede a Shinichi al comienzo?", ["Se transforma en un niño", "Pierde la memoria", "Se vuelve invisible", "Viaja al futuro"], 0]
  ],
  "Fruits Basket": [
    ["¿Cómo se llama la protagonista de Fruits Basket?", ["Tohru Honda", "Kyo Sohma", "Yuki Sohma", "Arisa Uotani"], 0],
    ["¿Qué característica mágica afecta a algunos miembros de la familia Sohma?", ["Se transforman en animales del zodiaco", "Se convierten en dragones", "Pueden leer mentes", "Viajan en el tiempo"], 0]
  ],
  "Toradora!": [
    ["¿Cómo se llama la protagonista conocida como Tigre de Bolsillo?", ["Taiga Aisaka", "Minori Kushieda", "Ami Kawashima", "Yasuko Takasu"], 0],
    ["¿Cómo se llama el protagonista masculino?", ["Ryuuji Takasu", "Yusaku Kitamura", "Inko", "Hisamitsu Noto"], 0]
  ],
  "The Apothecary Diaries": [
    ["¿Cómo se llama la protagonista experta en medicina y venenos?", ["Maomao", "Jinshi", "Gyokuyou", "Lihua"], 0],
    ["¿Dónde trabaja Maomao durante buena parte de la historia?", ["Palacio imperial", "Escuela de héroes", "Barco pirata", "Hospital espacial"], 0]
  ],
  "Dandadan": [
    ["¿Cómo se llama la protagonista de Dandadan?", ["Momo Ayase", "Aira Shiratori", "Seiko", "Vamola"], 0],
    ["¿Qué temas sobrenaturales mezcla la serie?", ["Espíritus y extraterrestres", "Solo dragones", "Solo vampiros", "Solo robots"], 0]
  ],
  "Seven Deadly Sins": [
    ["¿Cómo se llama el capitán de los Siete Pecados Capitales?", ["Meliodas", "Ban", "King", "Gowther"], 0],
    ["¿Qué pecado representa Diane?", ["Envidia", "Ira", "Envidia", "Pereza"], 1]
  ],
  "Hellsing Ultimate": [
    ["¿Cómo se llama el poderoso vampiro que sirve a Hellsing?", ["Alucard", "Anderson", "Walter", "Pip"], 0],
    ["¿Qué organización combate amenazas sobrenaturales?", ["Hellsing", "Akatsuki", "Toman", "Black Bulls"], 0]
  ],
  "Mushoku Tensei": [
    ["¿Cómo se llama el protagonista reencarnado?", ["Rudeus Greyrat", "Kazuma Satou", "Subaru Natsuki", "Kirito"], 0],
    ["¿Qué tipo de mundo aparece en la serie?", ["Mundo de fantasía con magia", "Futuro sin magia", "Solo mundo deportivo", "Mundo de detectives"], 0]
  ],
  "Kuroko's Basketball": [
    ["¿Qué deporte practican los protagonistas?", ["Baloncesto", "Fútbol", "Voleibol", "Tenis"], 0],
    ["¿Cómo se llama el jugador de presencia discreta?", ["Tetsuya Kuroko", "Taiga Kagami", "Seijuro Akashi", "Daiki Aomine"], 0]
  ],
  "Violet Evergarden": [
    ["¿En qué trabaja Violet después de la guerra?", ["Escritora de cartas", "Detective", "Cocinera", "Piloto espacial"], 0],
    ["¿Qué intenta comprender Violet?", ["El significado de las palabras de amor", "Cómo ser Hokage", "Cómo usar alquimia", "Cómo ganar un torneo"], 0]
  ],
  "Bocchi the Rock!": [
    ["¿Qué instrumento toca Hitori Gotoh?", ["Guitarra", "Batería", "Violín", "Trompeta"], 0],
    ["¿Cómo se llama el grupo musical de Hitori?", ["Kessoku Band", "Afterglow", "Roselia", "Poppin'Party"], 0]
  ],
  "Your Name": [
    ["¿Cómo se llaman los dos protagonistas principales?", ["Taki y Mitsuha", "Shinji y Asuka", "Haru y Shizuku", "Taiga y Ryuuji"], 0],
    ["¿Qué fenómeno misterioso conecta a los protagonistas?", ["Intercambio de cuerpos", "Viaje a Marte", "Invisibilidad", "Clonación"], 0]
  ],
  "Fullmetal Alchemist": [
    ["¿Quiénes son los hermanos protagonistas?", ["Edward y Alphonse", "Roy y Riza", "Ling y Lan Fan", "Scar y Yoki"], 0],
    ["¿Qué ciencia practican los protagonistas?", ["Alquimia", "Ninjutsu", "Nen", "Magia de cartas"], 0]
  ],
  "The Disastrous Life of Saiki K.": [
    ["¿Qué habilidad destaca en Kusuo Saiki?", ["Poderes psíquicos", "Alquimia", "Anti-magia", "Control de titanes"], 0],
    ["¿Qué desea Saiki principalmente?", ["Una vida tranquila", "Ser Rey de los Piratas", "Ser Hokage", "Dominar el fútbol"], 0]
  ]
};

const fallbackQuestions = [
  ["¿Qué suele significar el término 'shonen' en el mundo del manga y anime?", ["Obras dirigidas principalmente a chicos jóvenes", "Un tipo de espada", "Un género de música", "Una técnica de cocina"], 0],
  ["¿Cómo se llama la canción que aparece al inicio de muchos episodios de anime?", ["Opening", "Ending", "Trailer", "Bonus"], 0],
  ["¿Cómo se llama la canción que suele aparecer al final de un episodio?", ["Opening", "Ending", "Preview", "Remix"], 1],
  ["¿Qué es un manga?", ["Cómic japonés", "Videojuego de carreras", "Tipo de ramen", "Instrumento musical"], 0],
  ["¿Qué significa normalmente 'isekai'?", ["Historia en otro mundo", "Torneo deportivo", "Historia de detectives", "Concierto musical"], 0]
];

const state = {
  selected: new Set(),
  modeCount: 10,
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  correct: 0,
  wrong: 0,
  xp: 0,
  questionHistory: new Set()
};

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getAnimeQuestions(animeName) {
  const questions = questionBank[animeName] || fallbackQuestions;
  return questions.map((question, index) => ({
    anime: animeName,
    text: question[0],
    options: [...question[1]],
    correctAnswer: question[2],
    id: `${animeName}-${index}`
  }));
}

function renderGenres() {
  const genreSelect = $("genre-filter");
  const genres = [...new Set(animeSeed.map((anime) => anime[2]))].sort();

  genreSelect.innerHTML =
    '<option value="all">Todos los géneros</option>' +
    genres.map((genre) =>
      `<option value="${escapeHTML(genre)}">${escapeHTML(genre)}</option>`
    ).join("");
}

function renderAnimeCards() {
  const grid = $("anime-grid");
  const search = $("anime-search").value.trim().toLowerCase();
  const genre = $("genre-filter").value;

  const filtered = animeSeed.filter(([name, emoji, category]) => {
    const matchesSearch = name.toLowerCase().includes(search);
    const matchesGenre = genre === "all" || category === genre;
    return matchesSearch && matchesGenre;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-animes">No se encontraron animes. Prueba otra búsqueda.</div>';
    updateSelectedCount();
    return;
  }

  grid.innerHTML = filtered.map(([name, emoji, category]) => {
    const selected = state.selected.has(name);

    return `
      <button
        class="anime-card ${selected ? "selected" : ""}"
        type="button"
        data-anime="${escapeHTML(name)}"
        aria-pressed="${selected}"
      >
        <span class="anime-emoji">${emoji}</span>
        <span class="anime-name">${escapeHTML(name)}</span>
        <span class="anime-genre">${escapeHTML(category)}</span>
      </button>
    `;
  }).join("");

  updateSelectedCount();
}

function updateSelectedCount() {
  $("selected-count").textContent = state.selected.size;

  const totalQuestions = [...state.selected].reduce(
    (sum, anime) => sum + (questionBank[anime] || fallbackQuestions).length,
    0
  );

  const startButton = $("start-quiz");
  const enoughQuestions = totalQuestions >= state.modeCount;

  startButton.disabled = state.selected.size === 0 || !enoughQuestions;

  if (state.selected.size === 0) {
    $("setup-message").textContent = "Selecciona al menos un anime para comenzar.";
    $("setup-message").className = "message";
  } else if (!enoughQuestions) {
    $("setup-message").textContent =
      `Solo hay ${totalQuestions} preguntas disponibles. Selecciona más animes para jugar ${state.modeCount} preguntas.`;
    $("setup-message").className = "message error";
  } else {
    $("setup-message").textContent =
      `¡Listo! Hay ${totalQuestions} preguntas disponibles para tu desafío.`;
    $("setup-message").className = "message success";
  }
}

function toggleAnime(name) {
  if (state.selected.has(name)) {
    state.selected.delete(name);
  } else {
    state.selected.add(name);
  }

  renderAnimeCards();
}

function selectAllVisible() {
  const search = $("anime-search").value.trim().toLowerCase();
  const genre = $("genre-filter").value;

  const visible = animeSeed.filter(([name, emoji, category]) => {
    return name.toLowerCase().includes(search) &&
      (genre === "all" || category === genre);
  });

  const allSelected = visible.length > 0 &&
    visible.every(([name]) => state.selected.has(name));

  visible.forEach(([name]) => {
    if (allSelected) {
      state.selected.delete(name);
    } else {
      state.selected.add(name);
    }
  });

  $("select-all").textContent = allSelected
    ? "Seleccionar todos"
    : "Deseleccionar visibles";

  renderAnimeCards();
}

function setMode(count) {
  state.modeCount = count;

  document.querySelectorAll(".mode-card").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.count) === count
    );
  });

  updateSelectedCount();
}

function buildQuiz() {
  const allQuestions = [];

  state.selected.forEach((anime) => {
    allQuestions.push(...getAnimeQuestions(anime));
  });

  const uniqueQuestions = allQuestions.filter((question) => {
    if (state.questionHistory.has(question.id)) return false;
    state.questionHistory.add(question.id);
    return true;
  });

  let available = shuffle(uniqueQuestions);

  if (available.length < state.modeCount) {
    state.questionHistory.clear();
    available = shuffle(allQuestions);
  }

  return available.slice(0, state.modeCount).map((question) => {
    const correctText = question.options[question.correctAnswer];
    const shuffledOptions = shuffle(question.options);

    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: shuffledOptions.indexOf(correctText)
    };
  });
}

function startQuiz() {
  if (state.selected.size === 0) {
    $("setup-message").textContent = "Primero selecciona al menos un anime.";
    $("setup-message").className = "message error";
    return;
  }

  state.questions = buildQuiz();

  if (state.questions.length < state.modeCount) {
    $("setup-message").textContent =
      "No hay suficientes preguntas. Selecciona más animes.";
    $("setup-message").className = "message error";
    return;
  }

  state.index = 0;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.xp = 0;
  state.answered = false;

  $("quizSetup").classList.add("hidden");
  $("quizResult").classList.add("hidden");
  $("quizScreen").classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
  showQuestion();
}

function showQuestion() {
  const question = state.questions[state.index];
  state.answered = false;

  $("quiz-anime-label").textContent = `🎌 ${question.anime}`;
  $("question-counter").textContent =
    `Pregunta ${state.index + 1}/${state.questions.length}`;

  $("progress-bar").style.width =
    `${(state.index / state.questions.length) * 100}%`;

  $("question-category").textContent = "CULTURA ANIME";
  $("question-points").textContent = "+100 XP";
  $("question-text").textContent = question.text;
  $("answer-feedback").textContent = "";
  $("answer-feedback").className = "answer-feedback";
  $("next-question").classList.add("hidden");

  const letters = ["A", "B", "C", "D"];

  $("answers").innerHTML = question.options.map((option, index) => `
    <button class="answer-option" type="button" data-answer="${index}">
      <span class="answer-letter">${letters[index]}</span>
      <span>${escapeHTML(option)}</span>
    </button>
  `).join("");
}

function chooseAnswer(answerIndex) {
  if (state.answered) return;

  state.answered = true;

  const question = state.questions[state.index];
  const correct = answerIndex === question.correctAnswer;
  const buttons = [...$("answers").querySelectorAll(".answer-option")];

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correctAnswer) {
      button.classList.add("correct");
    }

    if (index === answerIndex && !correct) {
      button.classList.add("wrong");
    }
  });

  if (correct) {
    state.correct++;
    state.score += 100;
    state.xp += 100;

    $("answer-feedback").textContent = "¡Correcto! ¡Conoces muy bien este anime! +100 XP";
    $("answer-feedback").className = "answer-feedback good";
  } else {
    state.wrong++;

    $("answer-feedback").textContent =
      `❌ Respuesta incorrecta. La respuesta correcta es: ${question.options[question.correctAnswer]}.`;
    $("answer-feedback").className = "answer-feedback bad";
  }

  $("progress-bar").style.width =
    `${((state.index + 1) / state.questions.length) * 100}%`;

  $("next-question").textContent =
    state.index === state.questions.length - 1
      ? "Ver resultados 🏆"
      : "Siguiente pregunta ➜";

  $("next-question").classList.remove("hidden");
}

function nextQuestion() {
  if (!state.answered) return;

  state.index++;

  if (state.index >= state.questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  $("quizScreen").classList.add("hidden");
  $("quizResult").classList.remove("hidden");

  const total = state.questions.length;
  const percentage = Math.round((state.correct / total) * 100);

  $("final-score").textContent = `${state.correct}/${total}`;
  $("score-percent").textContent = `${percentage}% de aciertos`;
  $("correct-count").textContent = state.correct;
  $("wrong-count").textContent = state.wrong;
  $("xp-count").textContent = `${state.xp} XP`;

  let emoji = "😅";
  let title = "¡Sigue entrenando, Otaku!";
  let description = "Vuelve a jugar y demuestra que puedes mejorar.";

  if (percentage === 100) {
    emoji = "👑";
    title = "¡LEYENDA OTAKU!";
    description = "¡Perfecto! Respondiste todas las preguntas correctamente. ¡Impresionante!";
  } else if (percentage >= 80) {
    emoji = "🔥";
    title = "¡Verdadero Otaku!";
    description = "¡Muy buen resultado! Sabes muchísimo de anime.";
  } else if (percentage >= 60) {
    emoji = "⚡";
    title = "¡Vas por buen camino!";
    description = "Tienes buenos conocimientos. Un poco más de entrenamiento y serás una leyenda.";
  } else if (percentage < 30) {
    emoji = "🥲";
    title = "¡Modo Noob!";
    description = "¡A entrenar! Revisa tus animes favoritos y vuelve para la revancha.";
  }

  $("result-emoji").textContent = emoji;
  $("result-title").textContent = title;
  $("result-description").textContent = description;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToSetup() {
  $("quizScreen").classList.add("hidden");
  $("quizResult").classList.add("hidden");
  $("quizSetup").classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function restartQuiz() {
  returnToSetup();
  startQuiz();
}

function initializeLoader() {
  const loader = $("loader");

  window.setTimeout(() => {
    loader.classList.add("done");
  }, 5000);
}

function attachEvents() {
  $("anime-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-anime]");
    if (card) toggleAnime(card.dataset.anime);
  });

  $("anime-search").addEventListener("input", renderAnimeCards);
  $("genre-filter").addEventListener("change", renderAnimeCards);
  $("select-all").addEventListener("click", selectAllVisible);

  document.querySelectorAll(".mode-card").forEach((button) => {
    button.addEventListener("click", () => {
      setMode(Number(button.dataset.count));
    });
  });

  $("start-quiz").addEventListener("click", startQuiz);

  $("answers").addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (button) chooseAnswer(Number(button.dataset.answer));
  });

  $("next-question").addEventListener("click", nextQuestion);
  $("quit-quiz").addEventListener("click", returnToSetup);
  $("play-again").addEventListener("click", restartQuiz);
}

function initialize() {
  renderGenres();
  renderAnimeCards();
  attachEvents();
  initializeLoader();
}

document.addEventListener("DOMContentLoaded", initialize);