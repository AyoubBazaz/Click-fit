$(document).ready(function () {
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        success: function (response) {
            $('#fact').text(response.text);
        },
        error: function () {
            $('#fact').text('Failed to load fact.');
        }
    });

    $('#upload-btn').click(function (event) {
        event.preventDefault();
        $('#file-input').click();
    });

    $('#file-input').change(function (event) {
        var files = event.target.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    });

    function uploadFile(file) {
        var formData = new FormData();
        formData.append('image', file);

        $.ajax({
            url: 'http://localhost:3000/upload',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert('Image uploaded successfully!');
                displayImageCard(response.filePath);
            },
            error: function () {
                alert('Failed to upload image.');
            }
        });
    }

    function displayImageCard(imagePath) {
        var imageUrl = 'http://localhost:3000/' + imagePath;
    
        var colDiv = $('<div class="col-md-4 col-sm-6 mt-3"></div>'); // Adjust column width for 3 or 4 images per row
        var card = $('<div class="card"></div>');
        var cardImage = $('<img class="card-img-top" src="' + imageUrl + '" alt="Uploaded Image">');
        var cardBody = $('<div class="card-body"></div>');
        var cardTitle = $('<h5 class="card-title">Uploaded Image</h5>');
        var cardText = $('<p class="card-text">This is your uploaded image.</p>');
    
        cardBody.append(cardTitle, cardText);
        card.append(cardImage, cardBody);
        colDiv.append(card);  
    
        $('#image-gallery').append(colDiv);
    }
    
});
