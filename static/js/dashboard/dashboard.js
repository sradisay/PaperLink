$(document).ready(function() {


    function load_documents(id){
        $("#editor").empty();

        fetch(`/api/get_document?doc_id=${id}`, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((data) => {
            for(let i = 0; i < data.deltas.length; i++){

            consume(data.deltas[i]);
        }
    });
}

    let docs = $(".document");
    docs.on("click", function() {
        $(".document").removeClass("document-active");
        $(this).addClass("document-active");
        let text = $(this).find("span").first().text();
        $("#document-name").text(text);
        $("#pages").removeClass("d-none");

        load_documents($(this).data("id"));

    });



    $("#searchbar").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $(".document").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
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
    let currentdoc = null;
    docs.on("contextmenu", function(e) {
        currentdoc = $(this);
        e.preventDefault();
        let customContextMenu = $("#document-context-menu");

        customContextMenu.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px',
            display: 'block'
        });
    });
    $("#deleteDocument").on("click", function() {
        fetch("delete?document_id="+currentdoc.data("id"), {
            method: "GET",
        }).then(response => response.json())
        .then(data => {
           window.location.replace("/dashboard/");

        });
    });
    $("#renameDocument").on("click", function() {
        $("#document-context-menu").css("display", "none");
        $("#rename-modal-label").text("Rename "+currentdoc.find("span").first().text());
        $("#rename-modal").modal("show");
    });

    $("#rename-modal-rename").on("click", function() {
        $("#rename-modal").modal("hide");
        let new_name = $("#new-name").val();

        fetch("rename?document_id="+currentdoc.data("id")+"&new_name="+new_name, {
            method: "GET",
        }).then(response => response.json())
        .then(data => {
           window.location.replace("/dashboard/");

        });



    });
});