(function(){
    $('#navBar').append(`<div><input class="form-control" id="myInput" type="text" placeholder="Search.."></div> `);
    $('#myInput').on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $(".cardMovies").filter(function(){
            $(this).toggle($(this).find("h4").text().split(",")[0].toLowerCase().indexOf(value) > -1)
        });
    });
})();