$(document).ready(function() {


    $(document).on("click", function() {
        $("#document-context-menu").css("display", "none");
    });



    $("#rename-modal-close").on("click", function() {
        $("#rename-modal").modal("hide");
    });
    $("#rename-modal-cancel").on("click", function() {
        $("#rename-modal").modal("hide");
    });

});