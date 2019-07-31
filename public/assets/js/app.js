

$(document).ready(function () {

    onload()
    function onload() {
        makeTable()
    }
    function makeTable() {

        $.getJSON("/articles", function (data) {
            // $.get("/articles", function (data) {
            let test = data.data;

            if (!test || (test.length === 0)) {
                console.log("nope")
            }
            else {
                console.log("yup")
                initializeRows(data.data);
            }
        })
    }
    function initializeRows(row) {

        $("#tableMain").empty()
        for (let i = 0; i < row.length; i++) {
            $("#tableMain").append(newRow(row[i]))
        }
    }
    function newRow(row) {
        let newRow = $("<tr>")
        let title = $("<td>").text(row.title)
        let summary = $("<td>").text(row.summary)
        let linkRow = $("<td>")
        let link = $("<a>").text("Link ==>")
        link.attr("href", row.link)
        linkRow.append(link)
        let editRow = $("<td>")
        let edit = $("<button>"); edit.addClass("commentButton"); edit.attr("data-toggle", "modal"); edit.attr("data-target", "#comment"); edit.val(row.id); edit.text("Edit"); edit.attr("data", JSON.stringify(row))
        editRow.append(edit)
        newRow.append(title, summary, linkRow, editRow)
        return newRow
    }
    $(document.body).on("click", ".commentButton", function () {
        let entry = JSON.parse($(this).attr("data"))
        const target = entry._id
        $("#titleinput").empty();
        $("#bodyinput").empty();
        $("#commentSubmit").val(target)
        $.ajax({
            method: "GET",
            url: "/loadComments/" + target
        }).then(function (results) {
            $("#commentHead").text("Commenting on: " + entry.title)
            console.log(results)
            if (results.comment) {
                $("#titleinput").text(results.comment.title);
                $("#bodyinput").text(results.comment.body);
            }
        })
    })

    $(document).on("click", "#commentSubmit", function () {
        // Grab the id associated with the article from the submit button
        let target = $("#commentSubmit").val()
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/postComment/" + target,
            data: {
                title: $("#newCommentTitle").val(),
                body: $("#newCommentBody").val()
            }
        })
            .then(function (data) {
            });

        $("#newCommentTitle").val("");
        $("#newCommentBody").val("");

    });


})