$(document).ready(function() {

    let docs = $(".document");
    docs.on("click", function() {
        $(".document").removeClass("document-active");
        $(this).addClass("document-active");
        let text = $(this).find("span").first().text();
        $("#document-name").text(text);
        $("#pages").removeClass("d-none");

        fetch("/api/get_document?id="+$(this).data("id"), {
            method: "GET",
        }).then(response => response.json())
        .then(data => {


        });

    });

    $("#go-btn").on("click", function() {
        let id = $(".document-active").data("id"); // Get the link URL
        window.open("/editor/"+id, '_blank');
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