"use strict";

const $ = id => document.getElementById(id);

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Lista de animes
const animeList = [
    { name: "Naruto", emoji: "🍥" },
    { name: "One Piece", emoji: "🏴‍☠️" },
    { name: "Dragon Ball", emoji: "🐉" },
    { name: "Demon Slayer", emoji: "🗡️" },
    { name: "Jujutsu Kaisen", emoji: "👊" },
    { name: "Attack on Titan", emoji: "🧱" },
    { name: "My Hero Academia", emoji: "💥" },
    { name: "Death Note", emoji: "📓" },
    { name: "Spy x Family", emoji: "🕵️" },
    { name: "Hunter x Hunter", emoji: "🎣" },
    { name: "Bleach", emoji: "⚔️" },
    { name: "Tokyo Revengers", emoji: "🕰️" },
    { name: "Solo Leveling", emoji: "💫" },
    { name: "Chainsaw Man", emoji: "🪚" },
    { name: "Fullmetal Alchemist", emoji: "⚙️" }
];

// Banco de preguntas
const questions = [];

function addQ(anime, level, text, opt, correct) {
    questions.push({ anime, level, text, options: opt, correct });
}

// ============= NARUTO — FÁCIL =============
addQ("Naruto", "facil", "¿Cuál es el sueño de Naruto?", 
    ["A) Ser Hokage", "B) Encontrar el tesoro", "C) Ser el más fuerte", "D) Salvar a Sakura"], 0);
addQ("Naruto", "facil", "¿Quién es el maestro del Equipo 7?", 
    ["A) Jiraiya", "B) Kakashi", "C) Iruka", "D) Asuma"], 1);
addQ("Naruto", "facil", "¿Qué bestia vive dentro de Naruto?", 
    ["A) Shukaku", "B) Kurama", "C) Matatabi", "D) Isobu"], 1);
addQ("Naruto", "facil", "¿Cuál es la comida favorita de Naruto?", 
    ["A) Sushi", "B) Ramen", "C) Arroz", "D) Pan"], 1);
addQ("Naruto", "facil", "¿Quién es el mejor amigo y rival de Naruto?", 
    ["A) Shikamaru", "B) Sasuke", "C) Kiba", "D) Neji"], 1);
addQ("Naruto", "facil", "¿De qué aldea es Naruto?", 
    ["A) Aldea de la Arena", "B) Aldea de la Niebla", "C) Aldea de la Hoja", "D) Aldea de la Roca"], 2);
addQ("Naruto", "facil", "¿Quién mató a los padres de Naruto?", 
    ["A) Orochimaru", "B) Obito", "C) Madara", "D) Itachi"], 1);
addQ("Naruto", "facil", "¿Qué significa 'Hokage'?", 
    ["A) Rey del Fuego", "B) Sombra de Fuego", "C) Dios del Fuego", "D) Guerrero de Fuego"], 1);
addQ("Naruto", "facil", "¿Cuántas colas tiene Kurama?", 
    ["A) 7", "B) 8", "C) 9", "D) 10"], 2);
addQ("Naruto", "facil", "¿Quién es la compañera de equipo de Naruto que le gusta?", 
    ["A) Hinata", "B) Sakura", "C) Ino", "D) Tenten"], 1);
addQ("Naruto", "facil", "¿Qué símbolo lleva en la chaqueta el Cuarto Hokage?", 
    ["A) Rayo", "B) Fuego", "C) Hoja", "D) Nube"], 0);
addQ("Naruto", "facil", "¿Qué tipo de animal es Gamabunta?", 
    ["A) Serpiente", "B) Rana", "C) Águila", "D) Lobo"], 1);
addQ("Naruto", "facil", "¿Quién es el padre de Naruto?", 
    ["A) Minato Namikaze", "B) Fugaku Uchiha", "C) Hiashi Hyuga", "D) Shikaku Nara"], 0);
addQ("Naruto", "facil", "¿De qué color es el cabello de Naruto?", 
    ["A) Negro", "B) Rubio", "C) Castaño", "D) Rojo"], 1);
addQ("Naruto", "facil", "¿Qué técnica usa Naruto para crear copias?", 
    ["A) Rasengan", "B) Chidori", "C) Kage Bunshin", "D) Byakugan"], 2);

// ============= NARUTO — MEDIO =============
addQ("Naruto", "medio", "¿Quién enseñó el Rasengan a Naruto?", 
    ["A) Minato", "B) Jiraiya", "C) Kakashi", "D) Iruka"], 1);
addQ("Naruto", "medio", "¿Qué ojo tiene Shisui Uchiha?", 
    ["A) Mangekyou", "B) Sharingan", "C) Byakugan", "D) Rinnegan"], 0);
addQ("Naruto", "medio", "¿Quién es el líder de Akatsuki al principio?", 
    ["A) Obito", "B) Pain", "C) Itachi", "D) Kisame"], 1);
addQ("Naruto", "medio", "¿Qué clan tiene el Byakugan?", 
    ["A) Uchiha", "B) Hyuga", "C) Senju", "D) Uzumaki"], 1);
addQ("Naruto", "medio", "¿Quién creó el Chidori?", 
    ["A) Naruto", "B) Sasuke", "C) Kakashi", "D) Itachi"], 2);
addQ("Naruto", "medio", "¿Qué significa Akatsuki?", 
    ["A) Luna Roja", "B) Amanecer", "C) Noche", "D) Estrella"], 1);
addQ("Naruto", "medio", "¿Quién es la hija de Hiashi Hyuga?", 
    ["A) Hanabi", "B) Hinata", "C) Tenten", "D) Ino"], 1);
addQ("Naruto", "medio", "¿Qué elemento tiene el Chidori?", 
    ["A) Fuego", "B) Agua", "C) Rayo", "D) Viento"], 2);
addQ("Naruto", "medio", "¿Quién es el maestro de Jiraiya?", 
    ["A) Hashirama", "B) Hiruzen", "C) Minato", "D) Nagato"], 1);
addQ("Naruto", "medio", "¿Qué selló el Cuarto Hokage?", 
    ["A) A Kurama", "B) A Shukaku", "C) A sí mismo", "D) A Orochimaru"], 0);
addQ("Naruto", "medio", "¿Cuántos portadores han tenido el Kyubi?", 
    ["A) 2", "B) 3", "C) 4", "D) 5"], 1);
addQ("Naruto", "medio", "¿Qué significa el nombre 'Uzumaki'?", 
    ["A) Remolino", "B) Dragón", "C) Luna", "D) Estrella"], 0);
addQ("Naruto", "medio", "¿Quién es la madre de Naruto?", 
    ["A) Kushina", "B) Mikoto", "C) Hinata", "D) Mito"], 0);
addQ("Naruto", "medio", "¿Qué aldeas atacó Pain?", 
    ["A) Solo la Hoja", "B) Hoja y Arena", "C) Todas", "D) Ninguna"], 0);
addQ("Naruto", "medio", "¿Quién es el hermano mayor de Itachi?", 
    ["A) No tiene", "B) Sasuke", "C) Shisui", "D) Izuna"], 1);

// ============= NARUTO — DIFÍCIL =============
addQ("Naruto", "dificil", "¿Quién es el antepasado de los Uchiha?", 
    ["A) Indra", "B) Asura", "C) Hamura", "D) Hagoromo"], 0);
addQ("Naruto", "dificil", "¿Qué es el Rinnegan?", 
    ["A) Ojo de poder", "B) Ojo de la reencarnación", "C) Ojo de la verdad", "D) Ojo del tiempo"], 1);
addQ("Naruto", "dificil", "¿Quién fue el primer Jinchuriki de Kurama?", 
    ["A) Mito Uzumaki", "B) Kushina", "C) Rin", "D) Karin"], 0);
addQ("Naruto", "dificil", "¿Qué significa el nombre de 'Kaguya'?", 
    ["A) Diosa de la Luna", "B) Diosa del Sol", "C) Diosa de la Tierra", "D) Diosa del Fuego"], 0);
addQ("Naruto", "dificil", "¿Quién creó las 9 bestias con cola?", 
    ["A) Hagoromo Otsutsuki", "B) Hamura", "C) Kaguya", "D) Indra"], 0);
addQ("Naruto", "dificil", "¿Qué edad tenía Itachi cuando se graduó de la academia?", 
    ["A) 6 años", "B) 7 años", "C) 8 años", "D) 9 años"], 0);
addQ("Naruto", "dificil", "¿Cuántos años duró la Cuarta Gran Guerra Ninja?", 
    ["A) 1 día", "B) 3 días", "C) 1 semana", "D) 1 mes"], 0);
addQ("Naruto", "dificil", "¿Quién es el verdadero líder detrás de Akatsuki?", 
    ["A) Pain", "B) Obito", "C) Madara", "D) Kabuto"], 1);
addQ("Naruto", "dificil", "¿Qué poder le dio el Sabio de los Seis Caminos a Naruto?", 
    ["A) Sabiduría", "B) Fuerza y Chakra", "C) Inmortalidad", "D) Visión del futuro"], 1);
addQ("Naruto", "dificil", "¿En qué capítulo muere Itachi?", 
    ["A) 350", "B) 383", "C) 400", "D) 450"], 1);
addQ("Naruto", "dificil", "¿Qué significa 'Uchiha'?", 
    ["A) Ojo", "B) Abanico", "C) Fuego", "D) Cuervo"], 1);
addQ("Naruto", "dificil", "¿Quién es el hijo mayor del Sabio de los Seis Caminos?", 
    ["A) Asura", "B) Indra", "C) Hamura", "D) Naruto"], 1);
addQ("Naruto", "dificil", "¿Qué clanes fundaron la aldea?", 
    ["A) Uchiha y Hyuga", "B) Senju y Uchiha", "C) Senju y Hyuga", "D) Uzumaki y Senju"], 1);
addQ("Naruto", "dificil", "¿Qué jutsu prohibido usó Naruto contra Haku?", 
    ["A) Rasengan", "B) Kage Bunshin", "C) Rasenshuriken", "D) Ninguno"], 1);
addQ("Naruto", "dificil", "¿Quién es el creador original del Rasengan?", 
    ["A) Jiraiya", "B) Minato", "C) Naruto", "D) Asuma"], 1);

// ============= ONE PIECE — FÁCIL =============
addQ("One Piece", "facil", "¿Quién es el protagonista?", 
    ["A) Zoro", "B) Luffy", "C) Sanji", "D) Nami"], 1);
addQ("One Piece", "facil", "¿Qué quiere encontrar Luffy?", 
    ["A) Oro", "B) El One Piece", "C) Un barco", "D) Una espada"], 1);
addQ("One Piece", "facil", "¿Qué fruta comió Luffy?", 
    ["A) Mera Mera", "B) Gomu Gomu", "C) Hito Hito", "D) Ope Ope"], 1);
addQ("One Piece", "facil", "¿Quién usa tres espadas?", 
    ["A) Sanji", "B) Zoro", "C) Usopp", "D) Jinbe"], 1);
addQ("One Piece", "facil", "¿De qué color es el cabello de Sanji?", 
    ["A) Negro", "B) Rubio", "C) Rojo", "D) Azul"], 1);
addQ("One Piece", "facil", "¿Quién es la navegante?", 
    ["A) Robin", "B) Nami", "C) Vivi", "D) Yamato"], 1);
addQ("One Piece", "facil", "¿Qué dice Luffy todo el tiempo?", 
    ["A) ¡Seré el rey de los piratas!", "B) ¡Vamos!", "C) ¡Comamos!", "D) ¡Corran!"], 0);
addQ("One Piece", "facil", "¿Quién le dio el sombrero de paja a Luffy?", 
    ["A) Ace", "B) Shanks", "C) Roger", "D) Sabo"], 1);
addQ("One Piece", "facil", "¿Cómo se llama el primer barco de Luffy?", 
    ["A) Thousand Sunny", "B) Going Merry", "C) Red Force", "D) Oro Jackson"], 1);
addQ("One Piece", "facil", "¿Qué animal es Tony Tony Chopper?", 
    ["A) Perro", "B) Reno", "C) Gato", "D) Zorro"], 1);
addQ("One Piece", "facil", "¿Quién es el cocinero?", 
    ["A) Chopper", "B) Sanji", "C) Franky", "D) Brook"], 1);
addQ("One Piece", "facil", "¿Dónde nació Luffy?", 
    ["A) Grand Line", "B) East Blue", "C) North Blue", "D) South Blue"], 1);
addQ("One Piece", "facil", "¿Quién es el capitán del barco de Shanks?", 
    ["A) Shanks", "B) Roger", "C) Buggy", "D) Rayleigh"], 0);
addQ("One Piece", "facil", "¿Cuántas hojas tiene el sombrero de paja?", 
    ["A) 4", "B) 5", "C) 6", "D) 7"], 1);
addQ("One Piece", "facil", "¿Quién es el barco actual de Luffy?", 
    ["A) Going Merry", "B) Thousand Sunny", "C) Oro Jackson", "D) Red Force"], 1);

// ============= ONE PIECE — MEDIO =============
addQ("One Piece", "medio", "¿Qué significa D. en el nombre?", 
    ["A) Dragón", "B) Voluntad", "C) Oscuridad", "D) Luz"], 1);
addQ("One Piece", "medio", "¿Quién es el padre de Luffy?", 
    ["A) Gol D. Roger", "B) Monkey D. Garp", "C) Monkey D. Dragon", "D) Shanks"], 2);
addQ("One Piece", "medio", "¿Qué es el Haki?", 
    ["A) Una espada", "B) Energía espiritual", "C) Una fruta", "D) Un barco"], 1);
addQ("One Piece", "medio", "¿Quién es el rival de Zoro?", 
    ["A) Mihawk", "B) Sanji", "C) Luffy", "D) Kuma"], 0);
addQ("One Piece", "medio", "¿Qué edad tiene Luffy al inicio?", 
    ["A) 16", "B) 17", "C) 18", "D) 19"], 1);
addQ("One Piece", "medio", "¿Quién mató a Ace?", 
    ["A) Akainu", "B) Aokiji", "C) Kizaru", "D) Shanks"], 0);
addQ("One Piece", "medio", "¿Qué isla es la última?", 
    ["A) Skypiea", "B) Laugh Tale", "C) Sabaody", "D) Wano"], 1);
addQ("One Piece", "medio", "¿Cómo se llama la tripulación de Barba Blanca?", 
    ["A) Los Mugiwara", "B) Los Piratas de Barba Blanca", "C) Los Revolucionarios", "D) La Marina"], 1);
addQ("One Piece", "medio", "¿Qué puede hacer la fruta de Ace?", 
    ["A) Hielo", "B) Fuego", "C) Rayos", "D) Tierra"], 1);
addQ("One Piece", "medio", "¿Quién es el médico?", 
    ["A) Chopper", "B) Brook", "C) Robin", "D) Nami"], 0);
addQ("One Piece", "medio", "¿Qué mar recorre Luffy primero?", 
    ["A) North Blue", "B) East Blue", "C) West Blue", "D) South Blue"], 1);
addQ("One Piece", "medio", "¿Qué es el Going Merry?", 
    ["A) Un barco", "B) Una espada", "C) Un cañón", "D) Una lanza"], 0);
addQ("One Piece", "medio", "¿Quién es el más fuerte de la tripulación después de Luffy?", 
    ["A) Sanji", "B) Zoro", "C) Jinbe", "D) Usopp"], 1);
addQ("One Piece", "medio", "¿Qué es la Marina?", 
    ["A) Piratas", "B) Ejército mundial", "C) Revolucionarios", "D) Mercaderes"], 1);
addQ("One Piece", "medio", "¿Quién creó el One Piece?", 
    ["A) Shanks", "B) Gol D. Roger", "C) Barba Blanca", "D) Kaido"], 1);

// ============= ONE PIECE — DIFÍCIL =============
addQ("One Piece", "dificil", "¿Qué es el siglo vacío?", 
    ["A) Un año sin historia", "B) 100 años borrados", "C) Un siglo sin reyes", "D) Una era de paz"], 1);
addQ("One Piece", "dificil", "¿Quién es Joy Boy?", 
    ["A) Luffy", "B) Roger", "C) Una persona del pasado", "D) Un pirata"], 2);
addQ("One Piece", "dificil", "¿Qué significa el nombre de 'Laugh Tale'?", 
    ["A) Isla de la risa", "B) Leyenda feliz", "C) Cuento feliz", "D) Todas"], 0);
addQ("One Piece", "dificil", "¿Cuántos caminos tiene la Grand Line?", 
    ["A) 1", "B) 2", "C) 4", "D) 6"], 2);
addQ("One Piece", "dificil", "¿Qué tipo de fruta es la más rara?", 
    ["A) Paramecia", "B) Logia", "C) Zoan", "D) Zoan Mítica"], 3);
addQ("One Piece", "dificil", "¿Quién fue el antiguo dueño de la fruta de Luffy?", 
    ["A) Ace", "B) Shanks", "C) Roger", "D) Joy Boy"], 3);
addQ("One Piece", "dificil", "¿Qué hace el Haki del Conquistador?", 
    ["A) Golpear fuerte", "B) Derribar enemigos débiles", "C) Ver el futuro", "D) Defenderse"], 1);
addQ("One Piece", "dificil", "¿Quién fue el primer portador del sombrero de paja?", 
    ["A) Shanks", "B) Roger", "C) Joy Boy", "D) Garp"], 2);
addQ("One Piece", "dificil", "¿Qué es un Poneglyph?", 
    ["A) Un libro", "B) Una piedra con historia antigua", "C) Un mapa", "D) Un tesoro"], 1);
addQ("One Piece", "dificil", "¿Quién es el gobernante oculto del mundo?", 
    ["A) Blackbeard", "B) Kaido", "C) Imu", "D) Akainu"], 2);
addQ("One Piece", "dificil", "¿Qué significa la inicial D. según la leyenda?", 
    ["A) Dragón", "B) Amanecer", "C) Oscuridad", "D) Destino"], 1);
addQ("One Piece", "dificil", "¿Cuántas frutas del diablo tiene Barbanegra?", 
    ["A) 1", "B) 2", "C) 3", "D) 4"], 1);
addQ("One Piece", "dificil", "¿Qué es la Red Line?", 
    ["A) Un mar", "B) Un continente que divide los mares", "C) Una isla", "D) Un barco"], 1);
addQ("One Piece", "dificil", "¿Quién es la emperatriz pirata enamorada de Luffy?", 
    ["A) Nami", "B) Boa Hancock", "C) Robin", "D) Vivi"], 1);
addQ("One Piece", "dificil", "¿Qué es el Nuevo Mundo?", 
    ["A) East Blue", "B) Primera mitad de Grand Line", "C) Segunda mitad de Grand Line", "D) El Mar del Norte"], 2);

// ============= DRAGON BALL — FÁCIL =============
addQ("Dragon Ball", "facil", "¿Quién es el protagonista?", 
    ["A) Vegeta", "B) Goku", "C) Gohan", "D) Piccolo"], 1);
addQ("Dragon Ball", "facil", "¿De dónde viene Goku?", 
    ["A) Tierra", "B) Planeta Vegeta", "C) Namek", "D) Marte"], 1);
addQ("Dragon Ball", "facil", "¿Cuántas esferas del dragón hay?", 
    ["A) 6", "B) 7", "C) 8", "D) 9"], 1);
addQ("Dragon Ball", "facil", "¿Quién es el príncipe de los Saiyajin?", 
    ["A) Raditz", "B) Nappa", "C) Vegeta", "D) Broly"], 2);
addQ("Dragon Ball", "facil", "¿Quién es el maestro de Goku?", 
    ["A) Maestro Roshi", "B) Piccolo", "C) Kami", "D) Sr. Popo"], 0);
addQ("Dragon Ball", "facil", "¿Cómo se llama la técnica de energía de Goku?", 
    ["A) Galick Ho", "B) Kamehameha", "C) Final Flash", "D) Makankosappo"], 1);
addQ("Dragon Ball", "facil", "¿Quién es la esposa de Goku?", 
    ["A) Bulma", "B) Milk", "C) Androide 18", "D) Videl"], 1);
addQ("Dragon Ball", "facil", "¿Cuál es el nombre del abuelo adoptivo de Goku?", 
    ["A) Bardock", "B) Gohan", "C) Ox-Sama", "D) Krilin"], 1);
addQ("Dragon Ball", "facil", "¿Quién es el mejor amigo humano de Goku?", 
    ["A) Yamcha", "B) Krilin", "C) Ten Shin Han", "D) Mr. Satán"], 1);
addQ("Dragon Ball", "facil", "¿Qué color de cabello tiene Goku en Super Saiyajin?", 
    ["A) Negro", "B) Rubio", "C) Rojo", "D) Azul"], 1);
addQ("Dragon Ball", "facil", "¿Quién es el hijo mayor de Goku?", 
    ["A) Goten", "B) Gohan", "C) Trunks", "D) Pan"], 1);
addQ("Dragon Ball", "facil", "¿Qué animal es Shenlong?", 
    ["A) Fénix", "B) Dragón", "C) Tigre", "D) Lobo"], 1);
addQ("Dragon Ball", "facil", "¿Quién creó las Esferas del Dragón de la Tierra?", 
    ["A) Dende", "B) Kami", "C) Porunga", "D) Shenlong"], 1);
addQ("Dragon Ball", "facil", "¿Qué significa Saiyajin?", 
    ["A) Guerrero del espacio", "B) Persona de la selva", "C) Luchador fuerte", "D) Guerrero"], 1);
addQ("Dragon Ball", "facil", "¿Cómo se llama el hijo menor de Goku?", 
    ["A) Trunks", "B) Goten", "C) Gohan", "D) Pan"], 1);

// ============= DRAGON BALL — MEDIO =============
addQ("Dragon Ball", "medio", "¿Cuál es el nombre de nacimiento de Goku?", 
    ["A) Kakarotto", "B) Bardock", "C) Goku", "D) Raditz"], 0);
addQ("Dragon Ball", "medio", "¿Quién destruyó el planeta Vegeta?", 
    ["A) Vegeta", "B) Freezer", "C) Raditz", "D) Bardock"], 1);
addQ("Dragon Ball", "medio", "¿Quién es el dios de la destrucción?", 
    ["A) Whis", "B) Bills", "C) Sr. Popo", "D) Kaiosama"], 1);
addQ("Dragon Ball", "medio", "¿Qué es la Sala del Tiempo?", 
    ["A) 1 día = 1 año", "B) 1 día = 1 mes", "C) No existe", "D) Un lugar lento"], 0);
addQ("Dragon Ball", "medio", "¿Quién es la hija de Gohan?", 
    ["A) Pan", "B) Bra", "C) Videl", "D) Bulma"], 0);
addQ("Dragon Ball", "medio", "¿Quién es la esposa de Vegeta?", 
    ["A) Bulma", "B) Milk", "C) Androide 18", "D) Videl"], 0);
addQ("Dragon Ball", "medio", "¿Qué transformación tiene el cabello largo?", 
    ["A) Super Saiyajin", "B) Super Saiyajin 2", "C) Super Saiyajin 3", "D) Dios"], 2);
addQ("Dragon Ball", "medio", "¿Quién entrenó a Goku en el más allá?", 
    ["A) Kaiosama del Norte", "B) Kaiosama del Sur", "C) Kaiosama del Este", "D) Kaiosama del Oeste"], 0);
addQ("Dragon Ball", "medio", "¿Qué es Porunga?", 
    ["A) El dragón de Namek", "B) Un dragón pequeño", "C) Una esfera", "D) Un guerrero"], 0);
addQ("Dragon Ball", "medio", "¿Quién es el padre de Piccolo?", 
    ["A) Piccolo Daimaku", "B) Kami", "C) Nail", "D) Guru"], 0);
addQ("Dragon Ball", "medio", "¿Qué es el Ki?", 
    ["A) Dinero", "B) Energía vital", "C) Fuerza física", "D) Magia"], 1);
addQ("Dragon Ball", "medio", "¿Cuántos deseos concede Shenlong?", 
    ["A) 1", "B) 2", "C) 3", "D) 7"], 0);
addQ("Dragon Ball", "medio", "¿Quién es el creador de Dragon Ball?", 
    ["A) Masashi Kishimoto", "B) Akira Toriyama", "C) Eiichiro Oda", "D) Tite Kubo"], 1);
addQ("Dragon Ball", "medio", "¿Qué significa 'Kame'?", 
    ["A) Tortuga", "B) Dragón", "C) Sol", "D) Luna"], 0);
addQ("Dragon Ball", "medio", "¿Qué es el Ultra Instinto?", 
    ["A) Moverse sin pensar", "B) Ser muy rápido", "C) No sentir dolor", "D) Volar"], 0);

// ============= DRAGON BALL — DIFÍCIL =============
addQ("Dragon Ball", "dificil", "¿Quién es el ángel de Bills?", 
    ["A) Vados", "B) Whis", "C) Marcarita", "D) Kusu"], 1);
addQ("Dragon Ball", "dificil", "¿Cuántos universos existen?", 
    ["A) 8", "B) 10", "C) 12", "D) 14"], 2);
addQ("Dragon Ball", "dificil", "¿Quién fue el primer Super Saiyajin de la historia?", 
    ["A) Bardock", "B) Yamoshi", "C) Vegeta I", "D) Kakarotto"], 1);
addQ("Dragon Ball", "dificil", "¿Qué es el Torneo del Poder?", 
    ["A) Un juego", "B) Batalla entre universos", "C) Una fiesta", "D) Un entrenamiento"], 1);
addQ("Dragon Ball", "dificil", "¿Quién es el guerrero más fuerte del Universo 11?", 
    ["A) Goku", "B) Vegeta", "C) Jiren", "D) Toppo"], 2);
addQ("Dragon Ball", "dificil", "¿Cuánto tiempo dura la vida de un Saiyajin adulto?", 
    ["A) 50 años", "B) 70 años", "C) 80-100 años", "D) 200 años"], 2);
addQ("Dragon Ball", "dificil", "¿Qué significa 'Shenlong'?", 
    ["A) Dragón Divino", "B) Dragón de Fuego", "C) Dragón Azul", "D) Dragón de la Suerte"], 0);
addQ("Dragon Ball", "dificil", "¿Quién es el antepasado de todos los Saiyajin?", 
    ["A) Bardock", "B) Yamoshi", "C) Vegeta", "D) Kakarotto"], 1);
addQ("Dragon Ball", "dificil", "¿En qué año salió el primer capítulo de Dragon Ball?", 
    ["A) 1980", "B) 1984", "C) 1986", "D) 1989"], 1);
addQ("Dragon Ball", "dificil", "¿Quién es el padre de Bardock?", 
    ["A) Goku", "B) Bardock es el padre de Goku", "C) Vegeta", "D) No tiene padre"], 1);
addQ("Dragon Ball", "dificil", "¿Qué es el Zeno-sama?", 
    ["A) El rey de todo", "B) Un dios", "C) Un guerrero", "D) Un Saiyajin"], 0);
addQ("Dragon Ball", "dificil", "¿Cuántos deseos concede Porunga?", 
    ["A) 1", "B) 2", "C) 3", "D) 4"], 2);
addQ("Dragon Ball", "dificil", "¿Quién es la hermana de Vados?", 
    ["A) Whis", "B) Marcarita", "C) Kusu", "D) No tiene hermana"], 3);
addQ("Dragon Ball", "dificil", "¿Qué raza es Piccolo?", 
    ["A) Saiyajin", "B) Namekiano", "C) Terrícola", "D) Majin"], 1);
addQ("Dragon Ball", "dificil", "¿Quién es el creador original de las Esferas del Dragón?", 
    ["A) Dende", "B) Kami", "C) Zalama", "D) Guru"], 2);

// ============= PREGUNTAS BÁSICAS PARA OTROS ANIMES =============
const otrosAnimes = [
    { name: "Demon Slayer", emoji: "🗡️", main: "Tanjiro Kamado", p2: "Nezuko", p3: "Zenitsu", p4: "Inosuke" },
    { name: "Jujutsu Kaisen", emoji: "👊", main: "Yuji Itadori", p2: "Megumi", p3: "Nobara", p4: "Gojo" },
    { name: "Attack on Titan", emoji: "🧱", main: "Eren Yeager", p2: "Mikasa", p3: "Armin", p4: "Levi" },
    { name: "My Hero Academia", emoji: "💥", main: "Izuku Midoriya", p2: "Bakugo", p3: "All Might", p4: "Shoto" },
    { name: "Death Note", emoji: "📓", main: "Light Yagami", p2: "L", p3: "Misa", p4: "Ryuk" },
    { name: "Spy x Family", emoji: "🕵️", main: "Loid Forger", p2: "Yor", p3: "Anya", p4: "Bond" },
    { name: "Hunter x Hunter", emoji: "🎣", main: "Gon Freecss", p2: "Killua", p3: "Kurapika", p4: "Leorio" },
    { name: "Bleach", emoji: "⚔️", main: "Ichigo Kurosaki", p2: "Rukia", p3: "Aizen", p4: "Uryu" },
    { name: "Tokyo Revengers", emoji: "🕰️", main: "Takemichi Hanagaki", p2: "Mikey", p3: "Draken", p4: "Hinata" },
    { name: "Solo Leveling", emoji: "💫", main: "Sung Jinwoo", p2: "Cha Hae-In", p3: "Jinho", p4: "Beru" },
    { name: "Chainsaw Man", emoji: "🪚", main: "Denji", p2: "Makima", p3: "Power", p4: "Aki" },
    { name: "Fullmetal Alchemist", emoji: "⚙️", main: "Edward Elric", p2: "Alphonse", p3: "Winry", p4: "Mustang" }
];

otrosAnimes.forEach(anime => {
    const niveles = ["facil", "medio", "dificil"];
    niveles.forEach(nivel => {
        for (let i = 0; i < 15; i++) {
            const preguntas = [
                `¿Quién es el protagonista de ${anime.name}?`,
                `¿Qué nombre recibe la historia principal de ${anime.name}?`,
                `¿Quién es el personaje más querido de ${anime.name}?`,
                `¿En qué lugar se desarrolla mayormente ${anime.name}?`,
                `¿Quién es el compañero principal de ${anime.main} en ${anime.name}?`
            ];
            const opciones = [
                `A) ${anime.main}`,
                `B) ${anime.p2}`,
                `C) ${anime.p3}`,
                `D) ${anime.p4}`
            ];
            addQ(anime.name, nivel, preguntas[i % preguntas.length], opciones, 0);
        }
    });
});

// ==================== LÓGICA DEL JUEGO ====================
let estado = {
    animeSeleccionado: null,
    nivel: "facil",
    cantidad: 15,
    preguntasSeleccionadas: [],
    indiceActual: 0,
    correctas: 0,
    errores: 0,
    respondido: false
};

function renderAnimeList() {
    const lista = $("animeList");
    lista.innerHTML = "";
    animeList.forEach(anime => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "anime-card";
        tarjeta.innerHTML = `
            <span class="anime-emoji">${anime.emoji}</span>
            <span class="anime-name">${anime.name}</span>
        `;
        tarjeta.onclick = () => seleccionarAnime(anime);
        lista.appendChild(tarjeta);
    });
}

function seleccionarAnime(anime) {
    estado.animeSeleccionado = anime;
    $("selEmoji").textContent = anime.emoji;
    $("selName").textContent = anime.name;
    mostrarPantalla("configScreen");
}

document.querySelectorAll(".level-btn").forEach(boton => {
    boton.onclick = () => {
        document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        estado.nivel = boton.dataset.level;
    };
});

$("qtySelect").onchange = () => {
    estado.cantidad = parseInt($("qtySelect").value);
};

$("startBtn").onclick = () => {
    if (!estado.animeSeleccionado) return;
    
    const preguntasAnime = questions.filter(
        p => p.anime === estado.animeSeleccionado.name && p.level === estado.nivel
    );
    
    estado.preguntasSeleccionadas = shuffle(preguntasAnime).slice(0, estado.cantidad);
    estado.indiceActual = 0;
    estado.correctas = 0;
    estado.errores = 0;
    
    mostrarPantalla("quizScreen");
    mostrarPregunta();
};

function mostrarPregunta() {
    const preg = estado.preguntasSeleccionadas[estado.indiceActual];
    estado.respondido = false;
    
    $("qCounter").textContent = `Pregunta ${estado.indiceActual + 1}/${estado.preguntasSeleccionadas.length}`;
    $("scoreLive").textContent = `✅ ${estado.correctas} | ❌ ${estado.errores}`;
    
    const progreso = ((estado.indiceActual) / estado.preguntasSeleccionadas.length) * 100;
    $("progressFill").style.width = `${progreso}%`;
    
    $("animeTag").textContent = estado.animeSeleccionado.name;
    $("questionText").textContent = preg.text;
    $("feedbackBox").textContent = "";
    $("feedbackBox").className = "feedback-box";
    $("nextBtn").disabled = true;
    
    const contenedor = $("optionsBox");
    contenedor.innerHTML = "";
    preg.options.forEach((opcion, indice) => {
        const boton = document.createElement("button");
        boton.className = "option-btn";
        boton.textContent = opcion;
        boton.onclick = () => elegirRespuesta(indice);
        contenedor.appendChild(boton);
    });
}

function elegirRespuesta(indice) {
    if (estado.respondido) return;
    estado.respondido = true;
    
    const preg = estado.preguntasSeleccionadas[estado.indiceActual];
    const botones = document.querySelectorAll(".option-btn");
    
    botones.forEach((b, i) => {
        b.disabled = true;
        if (i === preg.correct) b.classList.add("correct");
        else if (i === indice && i !== preg.correct) b.classList.add("incorrect");
    });
    
    if (indice === preg.correct) {
        estado.correctas++;
        $("feedbackBox").textContent = "✅ ¡Correcto!";
        $("feedbackBox").classList.add("correct");
    } else {
        estado.errores++;
        $("feedbackBox").textContent = "❌ Incorrecto";
        $("feedbackBox").classList.add("incorrect");
    }
    
    $("scoreLive").textContent = `✅ ${estado.correctas} | ❌ ${estado.errores}`;
    $("nextBtn").disabled = false;
}

$("nextBtn").onclick = () => {
    estado.indiceActual++;
    if (estado.indiceActual >= estado.preguntasSeleccionadas.length) {
        mostrarResultado();
    } else {
        mostrarPregunta();
    }
};

function mostrarResultado() {
    mostrarPantalla("resultScreen");
    
    const total = estado.preguntasSeleccionadas.length;
    const porcentaje = Math.round((estado.correctas / total) * 100);
    
    $("okCount").textContent = estado.correctas;
    $("errCount").textContent = estado.errores;
    $("percent").textContent = `${porcentaje}%`;
    
    if (estado.errores >= 7) {
        $("resultEmoji").textContent = "😅";
        $("resultTitle").textContent = "¡Ánimo!";
        $("resultMsg").textContent = "Anda a ver el anime para que respondas bien noob 😜📺";
    } else if (estado.errores >= 5) {
        $("resultEmoji").textContent = "🙂";
        $("resultTitle").textContent = "Puedes mejorar";
        $("resultMsg").textContent = "Te faltó un poco, ¡vuelve a intentarlo!";
    } else if (estado.errores >= 3) {
        $("resultEmoji").textContent = "🎉";
        $("resultTitle").textContent = "¡Bien hecho!";
        $("resultMsg").textContent = "¡Buen conocimiento del anime!";
    } else {
        $("resultEmoji").textContent = "🏆";
        $("resultTitle").textContent = "¡Excelente!";
        $("resultMsg").textContent = "¡Eres un verdadero experto en animes! 🎌✨";
    }
}

function mostrarPantalla(idPantalla) {
    document.querySelectorAll(".screen").forEach(p => {
        p.classList.add("hidden");
        p.classList.remove("active");
    });
    $(idPantalla).classList.remove("hidden");
    $(idPantalla).classList.add("active");
}

$("back1").onclick = () => mostrarPantalla("selectScreen");
$("exitBtn").onclick = () => { if (confirm("¿Salir del quiz?")) mostrarPantalla("selectScreen"); };
$("retryBtn").onclick = () => mostrarPantalla("configScreen");
$("homeBtn").onclick = () => mostrarPantalla("selectScreen");

renderAnimeList();
