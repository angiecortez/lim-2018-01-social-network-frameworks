let config = {
   apiKey: "AIzaSyAlVW9H1KG7T0TVB_moqQP46KTavNTQQKY",    
    authDomain: "redsocial-6a748.firebaseapp.com",
    databaseURL: "https://redsocial-6a748.firebaseio.com",
    projectId: "redsocial-6a748",
    storageBucket: "redsocial-6a748.appspot.com",
};
firebase.initializeApp(config);

let db = firebase.database(),
    auth = firebase.auth(),
    proveedor = new firebase.auth.GoogleAuthProvider();

Vue.component('todo-list', {
    template: '#todo-template',
    data: () =>{
        return {
            nuevaTarea: null,
            editandoTarea: null,
        }
    },
    props: ['tareas', 'autentificado', 'usuarioActivo'],
    methods: {
        agregarTarea:  (tarea) =>{
            db.ref('tareas/').push({
                titulo: tarea,
                completado: false,
                nombre: vm.usuarioActivo.displayName,
                avatar: vm.usuarioActivo.photoURL,
                uid: vm.usuarioActivo.uid,
            });
            this.nuevaTarea = '';
        },
        editarTarea:  (tarea)=> {
            db.ref('tareas/' + tarea['.key']).update({
                titulo: tarea.titulo
            });
        },
        actualizarEstadoTarea:  (estado, tarea) =>{
            db.ref('tareas/' + tarea['.key']).update({
                completado: estado ? true : false,
            });
        },
        eliminarTarea: (tarea) =>{
            db.ref('tareas/' + tarea['.key']).remove();
        },
    }
});

let vm = new Vue({
    el: 'body',
    ready:  () =>{
        // RT database
        db.ref('tareas/').on('value',  (snapshot)=> {
            vm.tareas = [];
            let objeto = snapshot.val();
            for (let propiedad in objeto) {
                vm.tareas.unshift({
                    '.key': propiedad,
                    completado: objeto[propiedad].completado,
                    titulo: objeto[propiedad].titulo,
                    avatar: objeto[propiedad].avatar,
                    nombre: objeto[propiedad].nombre,
                    uid: objeto[propiedad].uid,
                });
            }
        });

        // Auth
        auth.onAuthStateChanged((user)=> {
            if (user) {
                console.info('Conectado: ', user);
                vm.autentificado = true;
                vm.usuarioActivo = user;
            } else {
                console.warn('No conectado');
                vm.autentificado = false;
                vm.usuarioActivo = null;
            }
        });
    },
    data: {
        autentificado: false,
        usuarioActivo: null,
        tareas: [],
    },
    methods: {
        conectar:  ()=> {
            firebase.auth().signInWithPopup(proveedor).catch( (error) =>{
                console.error('Error haciendo logIn: ', error);
            });
        },
        desconectar:  ()=> {
            firebase.auth().signOut().catch( (error)=> {
                console.error('Error haciendo logOut: ', error);
            });
        }
    }
});