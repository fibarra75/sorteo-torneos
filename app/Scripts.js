var persistenciaLocal = true;

var aJugadores = [];

function addJugadorLista(numero, nombre, ptos, tabla)
{ 
    var table = document.getElementById(tabla);
    var row = table.insertRow();
    //var countRows = counter;
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1); 
    var cell3 = row.insertCell(2); 
    
    cell1.innerHTML = numero;
    cell2.innerHTML = nombre;
    cell3.innerHTML = ptos;
}

function addJugadorGrupo(numero, nombre, tabla)
{ 
    var table = document.getElementById(tabla); 
    var row = table.insertRow();
    //var countRows = counter;
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1); 
    
    cell1.innerHTML = numero;
    cell2.innerHTML = nombre;
}

function guardarListaJugadoresLocal() {
    let d = new Date();
    let ttl = d.getTime() + 1000*60*10;

    let oTorneo = {
        'expira' : ttl,
        'listaJugadores' : aJugadores
    };
    console.log('Guardando sTorneo localmente');
    localStorage.setItem('sTorneo', JSON.stringify(oTorneo));    
}

function obtenerDataLocalStorage() {
    let oTorneo;
    let sTorneo = localStorage.getItem('sTorneo');

    if (sTorneo) oTorneo = JSON.parse(sTorneo);

    return oTorneo;
}

function rescatarListaJugadoresLocal() {
    let oTorneo = obtenerDataLocalStorage();
    
    if (oTorneo) aJugadores = oTorneo.listaJugadores;
    console.log('Cantidad de jugadores locales: ' + aJugadores.length);
}

function expiraDataTorneo() {
    let d = new Date();

    let oTorneo = obtenerDataLocalStorage();
    
    if (oTorneo) {
        if (d.getTime() > oTorneo.expira) {
            console.log('sTorneo expiro');
            localStorage.removeItem('sTorneo');
        }
    }
}

function generarTablasJugadores() {
    let l = aJugadores.length;

    console.log('Generando tabla con jugadores locales');
    for (i = 0; i < l; i++) {
        addJugadorLista(i+1,aJugadores[i].name, aJugadores[i].puntos, 'dataJugadores');
    }
}

/*
function generarListaJugadoresLocal() {
    rescatarListaJugadoresLocal();
    generarTablasJugadores();
}
*/
function generarListaJugadores() {

    console.log('Consultando los jugadores en repositorio firebase');

    var firebaseConfig = {
        apiKey: "AIzaSyCTLZDLaSWi_G4mVNwRzXDIp8n63JuFDiw",
        authDomain: "ferro-spartano.firebaseapp.com",
        databaseURL: "https://ferro-spartano.firebaseio.com",
        projectId: "ferro-spartano",
        storageBucket: "ferro-spartano.appspot.com",
        messagingSenderId: "552159925688",
        appId: "1:552159925688:web:269b4af4227f2dcf2deb4d",
        measurementId: "G-26JLZNSPM7"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var db = firebase.firestore();
    var i = 0;
    
    db.collection("jugadores002").orderBy("puntos", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //console.log(`${doc.id} => ${doc.data()}`);            
            var j = doc.data();                    
            aJugadores[i] = j;
            i++;
            //addJugadorLista(i,j.name, j.puntos, 'dataJugadores');            
        });
        console.log('Despues de llenar la lista ...');
        guardarListaJugadoresLocal();
        generarTablasJugadores();
    });
}

function poblarTablaGrupo(grupo, tabla) {
    let largo  = grupo.length;
    let j = 1;

    for (i=0; i < largo; i++) {
        addJugadorGrupo(j,grupo[i].name, tabla);
        j++;
    }
}

function poblarTombola(tombola, i1, i2, aJugadores) {
    let j = tombola.length;
    for (i=i1; i < i2; i++) {
        tombola[j] = aJugadores[i];
        j++;
    }       
}

function agregarJugadorGrupo(tombola, grupo) {
    let r = Math.floor(Math.random() * tombola.length);
    let l = grupo.length;
    grupo[l] = tombola[r];
    tombola.splice(r,1);
}

function vaciarTabla(tabla) {
    var Parent = document.getElementById(tabla);
    while(Parent.hasChildNodes())
    {
       Parent.removeChild(Parent.firstChild);
    }
}

function armarGrupos() {
    let cantGrupos = 4;
    let cantJugadorGrupo = 0;
    
    let tombola1 = []; //Cabezas de serie
    let tombola2 = []; 
    let tombola3 = []; 
    let tombola4 = []; 
    let largo = aJugadores.length;

    let grupo1 = [];
    let grupo2 = [];
    let grupo3 = [];
    let grupo4 = [];

    let j = 0;
    let iter = 0;

    cantJugadorGrupo = Math.round(largo / cantGrupos);

    if (cantGrupos == 2) {
        iter = Math.round(cantJugadorGrupo/2);
        poblarTombola(tombola1,0, cantJugadorGrupo, aJugadores);
        poblarTombola(tombola2,cantJugadorGrupo, cantJugadorGrupo*2, aJugadores);
    }
    if (cantGrupos == 3) {
        iter = Math.round(cantJugadorGrupo/3);
        poblarTombola(tombola1,0, cantJugadorGrupo, aJugadores);
        poblarTombola(tombola2,cantJugadorGrupo, cantJugadorGrupo*2, aJugadores);
        poblarTombola(tombola3,cantJugadorGrupo*2, cantJugadorGrupo*3, aJugadores);
    }
    if (cantGrupos == 4) {
        iter = Math.round(cantJugadorGrupo/4);
        poblarTombola(tombola1,0, cantJugadorGrupo, aJugadores);
        poblarTombola(tombola2,cantJugadorGrupo, cantJugadorGrupo*2, aJugadores);
        poblarTombola(tombola3,cantJugadorGrupo*2, cantJugadorGrupo*3, aJugadores);
        poblarTombola(tombola4,cantJugadorGrupo*3, largo, aJugadores);
    }    
    
    for (i = 0; i < iter; i++) {
        if (cantGrupos == 2) {
            agregarJugadorGrupo(tombola1, grupo1);
            agregarJugadorGrupo(tombola1, grupo2);

            agregarJugadorGrupo(tombola2, grupo1);            
            agregarJugadorGrupo(tombola2, grupo2);            
        }
        if (cantGrupos == 3) {
            agregarJugadorGrupo(tombola1, grupo1);
            agregarJugadorGrupo(tombola1, grupo2);
            agregarJugadorGrupo(tombola1, grupo3);

            agregarJugadorGrupo(tombola2, grupo1);
            agregarJugadorGrupo(tombola2, grupo2);
            agregarJugadorGrupo(tombola2, grupo3);

            agregarJugadorGrupo(tombola3, grupo1);
            agregarJugadorGrupo(tombola3, grupo2);
            agregarJugadorGrupo(tombola3, grupo3);            
        }        
        if (cantGrupos == 4) {
            agregarJugadorGrupo(tombola1, grupo1);
            agregarJugadorGrupo(tombola1, grupo2);
            agregarJugadorGrupo(tombola1, grupo3);       
            agregarJugadorGrupo(tombola1, grupo4);

            agregarJugadorGrupo(tombola2, grupo1);
            agregarJugadorGrupo(tombola2, grupo2);
            agregarJugadorGrupo(tombola2, grupo3);       
            agregarJugadorGrupo(tombola2, grupo4);       
            
            agregarJugadorGrupo(tombola3, grupo1);
            agregarJugadorGrupo(tombola3, grupo2);
            agregarJugadorGrupo(tombola3, grupo3);       
            agregarJugadorGrupo(tombola3, grupo4);    
            
            agregarJugadorGrupo(tombola4, grupo1);
            agregarJugadorGrupo(tombola4, grupo2);
            agregarJugadorGrupo(tombola4, grupo3);       
            agregarJugadorGrupo(tombola4, grupo4);              
        }  
    }
 
    vaciarTabla('Jugadores-G1');
    vaciarTabla('Jugadores-G2');
    vaciarTabla('Jugadores-G3');
    vaciarTabla('Jugadores-G4');

    if (cantGrupos > 0) poblarTablaGrupo(grupo1, 'Jugadores-G1');
    if (cantGrupos > 1) poblarTablaGrupo(grupo2, 'Jugadores-G2');
    if (cantGrupos > 2) poblarTablaGrupo(grupo3, 'Jugadores-G3');
    if (cantGrupos > 3) poblarTablaGrupo(grupo4, 'Jugadores-G4');
}