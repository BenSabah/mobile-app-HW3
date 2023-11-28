console.log("script loaded");

// handle register click
$("#register").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();
    $.post("/register/" + username + "/" + password, function (data, status) {
        console.log("user was added");
        $("#loginErrorMessage").text("You were successfully registered, please login");
        $("#loginErrorMessage").css("color", "#00ff7f");
        $("#loginErrorMessage").css("visibility", "visible");
    }).fail(function () {
        $("#loginErrorMessage").text("User name already taken");
        $("#loginErrorMessage").css("color", "#ff4444");
        $("#loginErrorMessage").css("visibility", "visible");
        setTimeout(() => {
            $("#loginErrorMessage").css("visibility", "hidden")
        }, 3000);
    })
});

// handle login.
$("#login").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();
    $.post("/login/" + username + "/" + password, function (data, status) {
        console.log("correct username and password");
        window.location.replace("/events");
    }).fail(function () {
        $("#loginErrorMessage").text("Wrong user name or password");
        $("#loginErrorMessage").css("color", "#ff4444");
        $("#loginErrorMessage").css("visibility", "visible");
        setTimeout(() => {
            $("#loginErrorMessage").css("visibility", "hidden")
        }, 3000);
    });
});

// handle delete.
$(".delete").on("click", () => {
    let id = event.target.id;
    $.ajax({
        url: "/item/" + id,
        type: "DELETE",
        success: function (result) {
            console.log("event id " + id + " was deleted");
            location.reload();
        }
    });
});

// handle edit.
$(".edit").on("click", () => {
    let id = event.target.id;
    window.location.replace("/edit/" + id);
});

// handle cancel.
$("#cancelBtn").on("click", () => {
    window.location.replace("/events");
});

// handle update.
$("#updateBtn").on("click", () => {
    console.log("clicked on update");
    let newEvent = {};
    newEvent.id = $("#eventId").text();
    newEvent.time = Date();
    newEvent.name = $("[name='name']").val();
    newEvent.location = $("[name='location']").val();
    newEvent.activity = $("[name='activity']").val();
    newEvent.img = $("[name='img']").val();
    console.log(newEvent);
    $.ajax({
        type: "PUT",
        url: "/item/",
        data: newEvent,
        success: function (result) {
            window.location.replace("/events");
        }
    });
});