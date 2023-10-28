$(document).ready(function() {

    let docs = $(".document");
    docs.on("click", function() {
        $(".document").removeClass("document-active");
        $(this).addClass("document-active");

    });

    docs.on("dblclick", function()
    {
        let id = $(this).data("id"); // Get the link URL
        window.open("/editor/"+id, '_blank');

    });
    $("#add").on("click", function() {
        fetch("/api/create_document?name=Untitled-Document", {
            method: "GET",
        }).then(response => response.json())
        .then(data => {
            let id = data["id"];

            window.open("/editor/"+id, '_blank');
            window.location.replace("/dashboard/");

        }
        );
    });



});