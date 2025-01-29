$(document).ready(function() {
    // Fetch data from numbersapi.com and display it
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        success: function(response) {
            $('#fact').text(response.text);
        },
        error: function() {
            $('#fact').text('Failed to load fact.');
        }
    });

    // Drag & Drop image upload
    $('#drop-area').on('dragover', function(event) {
        event.preventDefault();
        $(this).css('border', '2px dashed #000');
    });

    $('#drop-area').on('dragleave', function(event) {
        event.preventDefault();
        $(this).css('border', '1px solid #ddd');
    });

    $('#drop-area').on('drop', function(event) {
        event.preventDefault();
        $(this).css('border', '1px solid #ddd');
        var files = event.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    });

    // File input click event
    $('#upload-btn').click(function(event) {
        event.preventDefault();
        $('#file-input').click();
    });

    // File input change event
    $('#file-input').change(function(event) {
        var files = event.target.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    });

    // Upload file function
    function uploadFile(file) {
        var formData = new FormData();
        formData.append('image', file);

        $.ajax({
            url: 'http://localhost:3000/upload',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                alert('Image uploaded successfully!');
                displayImageCard(response.filePath);
            },
            error: function() {
                alert('Failed to upload image.');
            }
        });
    }

    // Display uploaded image
    function displayImageCard(imagePath) {
        var imageUrl = 'http://localhost:3000/' + imagePath;

        var card = $('<div class="card mt-3"></div>');
        var cardImage = $('<img class="card-img-top" src="' + imageUrl + '" alt="Uploaded Image">');
        var cardBody = $('<div class="card-body"></div>');
        var cardTitle = $('<h5 class="card-title">Uploaded Image</h5>');
        var cardText = $('<p class="card-text">This is your uploaded image.</p>');

        cardBody.append(cardTitle, cardText);
        card.append(cardImage, cardBody);

        $('#image-gallery').append(card);
    }
});
