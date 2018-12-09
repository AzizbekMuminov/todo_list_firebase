let userId;

function render(){
    $("#loading").addClass("loading")
    firebase.database().ref(`todoes/${userId}`).on("value", function (snapshot){
    $("#loading").removeClass("loading")        
        var html = '';
        var todo_list = $("#todo-list");

        var todoes = snapshot.val();
        for(var id in todoes){
            var todo = todoes[id];
            html += `
                <li class="list-group-item" style="display: flex; align-items: center; justify-content: space-between;">
                    <input data-todo-id='${id}' data-action="edit-todo" data-id="todo-done" type="checkbox" ${todo.done ? "checked": "" }>
                    <input data-todo-id='${id}' data-action="edit-todo" data-id="todo-name" value="${todo.name}"  style="border: 0px;">
                    <button class="btn btn-danger" onClick="remove('${id}')">REMOVE</button>
                </li> 
            `
        }
        todo_list.html(html);
    });
}


firebase.auth().onAuthStateChanged(function (user){
    $("#loading").removeClass("loading")
   
    if(user){
        var email = user.email;
        var verificated = user.emailVerified;
        userId = user.uid;


        render();
        $("#signed-in").show();
        $("#signed-out").hide();
    }else{
        $("#signed-in").hide();
        $("#signed-out").show();
    }
});

$(document).on('click', "#sign-in-btn", function (){

    var email = $('[type="email"]').val();
    var password = $('[type="password"]').val();

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error){
        var err = error.code;
        var err_msg = error.message;
        alert(err, err_msg);
    }).then(function (dt){
        console.log("success !");
        verificate();
    });

});

$(document).on('click', "#todo-add", function (){
    var todo_name = $("#todo-label").val();
    var todo_done = $("#todo-done").prop("checked");
    var todoId = Math.ceil(Math.random() * 10000);

    firebase.database().ref(`todoes/${userId}/${todoId}`).set({
        done: todo_done,
        name: todo_name,
    });
});

$(document).on('change', '[data-action="edit-todo"]', function (){
    var todo_name = $(this).parent().children("[data-id='todo-name']").val();
    var todo_done = $(this).parent().children("[data-id='todo-done']").prop('checked'); 
    var todoId = $(this).attr("data-todo-id");

    firebase.database().ref(`todoes/${userId}/${todoId}`).update({
        done: todo_done,
        name: todo_name,
    });
})

function remove(id){
    console.log(id);
    firebase.database().ref(`todoes/${userId}/${id}`).remove();
}

function verificate(){
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function () {
        console.log(" It work's ! ");
    }).catch(function ( error ) {
        alert( " false ")
    });
}


$(document).on('click', '#sign-out-btn', function (){
    firebase.auth().signOut().then(function(){
        console.log(" Hello world ");
    }).catch(function ( error ) {
       alert( error ); 
    });
});


$(document).on('click', "#sign-inning-btn", function (){
    var email = $('[type="email"]').val();
    var password = $('[type="password"]').val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user){
        console.log(" hello world ! ");
    }).catch( function(){
        alert( "Error" );
    } )
})