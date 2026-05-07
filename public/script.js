console.log("script loaded");

// handle register click
$("#register").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();
    let $loginErrorMessage = $("#loginErrorMessage");
    $.post("/register/" + username + "/" + password, function () {
        console.log("user was added");
        $loginErrorMessage.text("You were successfully registered, please login");
        $loginErrorMessage.css("color", "#00ff7f");
        $loginErrorMessage.css("visibility", "visible");
    }).fail(function () {
        $loginErrorMessage.text("User name already taken");
        $loginErrorMessage.css("color", "#ff4444");
        $loginErrorMessage.css("visibility", "visible");
        setTimeout(() => {
            $loginErrorMessage.css("visibility", "hidden")
        }, 3000);
    })
});

// handle login.
function performLogin() {
    let username = $("#username").val();
    let password = $("#password").val();
    $.post("/login/" + username + "/" + password, function () {
        console.log("correct username and password");
        window.location.replace("/events");
    }).fail(function () {
        let $loginErrorMessage = $("#loginErrorMessage");
        $loginErrorMessage.text("Wrong user name or password");
        $loginErrorMessage.css("color", "#ff4444");
        $loginErrorMessage.css("visibility", "visible");
        setTimeout(() => {
            $loginErrorMessage.css("visibility", "hidden")
        }, 3000);
    });
}

$("#loginForm").submit(function (e) {
    e.preventDefault();
    performLogin();
});

$(document).ready(function () {
    $(".last-update").each(function () {
        const rawValue = $(this).attr("data-time");
        console.log("Raw attribute value:", rawValue);

        const timestamp = parseInt(rawValue, 10);
        console.log("Parsed timestamp:", timestamp);

        if (!isNaN(timestamp)) {
            const date = new Date(timestamp);
            if (!isNaN(date.getTime())) {
                $(this).text(date.toLocaleString());
            } else {
                $(this).text("Invalid date");
            }
        } else {
            $(this).text("Invalid timestamp: " + rawValue);
        }
    });
});

// Inline Edit handler
$(".edit-btn").click(function () {
    const $row = $(this).closest("tr");

    // Hide the last-update column while preserving the layout
    $row.find(".last-update").css("visibility", "hidden");

    $row.find(".editable").each(function () {
        const val = $(this).text();
        $(this).html(`<input type="text" value="${val}" class="edit-input">`);
    });
    // Add an image input field
    const $imgCell = $row.find(".img-cell");
    const imgVal = $imgCell.find('a').attr("href");
    $imgCell.html(`<input type="text" value="${imgVal}" class="edit-input">`);

    $row.find(".edit-btn").hide();
    $row.find(".save-btn").show();
});

// Inline Save handler
$(".save-btn").click(function () {
    const $row = $(this).closest("tr");
    const id = $row.data("id");
    const updatedEvent = {id: id};

    $row.find(".editable").each(function () {
        const field = $(this).data("field");
        const val = $(this).find("input").val();
        updatedEvent[field] = val;
        $(this).text(val);
    });

    // Save image field
    const $imgCell = $row.find(".img-cell");
    const imgVal = $imgCell.find("input").val();
    updatedEvent["img"] = imgVal;
    $imgCell.html(`
        <a href="${imgVal}"
           class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored img-preview-trigger"
           target="_blank">
            <div class="material-icons md-dark">image</div>
            <img src="${imgVal}" class="hover-preview" alt="Preview">
        </a>
    `);

    $.ajax({
        type: "PUT",
        url: "/item/",
        data: updatedEvent,
        success: function (result) {
            console.log("Event updated:", result);
            // Update the "Last Updated" and restore visibility
            $row.find(".last-update").text(new Date().toLocaleString()).css("visibility", "visible");
            $row.find(".edit-btn").show();
            $row.find(".save-btn").hide();
        }
    });
});

// handle delete.
$(".delete").on("click", function () {
    let id = $(this).attr("id");
    $.ajax({
        url: "/item/" + id,
        type: "DELETE",
        success: function () {
            console.log("event id " + id + " was deleted");
            location.reload();
        }
    });
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
        success: function () {
            window.location.replace("/events");
        }
    });
});
