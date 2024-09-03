$(document).ready(function() {
    // Fetch the JSON file
    $.getJSON('../JSON/certificates.json', function(data) {
        // Iterate over the certificates array
        var Selector = $('#Selector');
        var list = $('#list-group');
        var getlist = '';
        $.each(data.certificates, function(index, certificate) {
            // Append each certificate to the list

            Selector.append(
                `<option class="list-group-item border border-dark">
                    ${certificate.name}
                </option>`
            );

            getlist +=
                `<li class="list-group-item border btn btn-light border-dark" id="certificate_${index+1}" 
                onclick="pdfViewer('${certificate.path}','${certificate.name}','#certificate_${index+1}');">
                    ${certificate.name}
                </li>`;
        });

        list.append(getlist);

    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading JSON data: ' + textStatus, errorThrown);
    });

  
    $('#show-pdf').click(function(){

        const pdfName = $('#Selector').val();

        $.getJSON('../JSON/certificates.json', function(data) {

            $.each(data.certificates, function(index, certificate){
                if(pdfName === certificate.name){
                    pdfViewer(certificate.path, certificate.name, null);
                }
            });

        }).fail(function(jqXHR, textStatus, errorThrown) {console.error('Error loading JSON data: ' + textStatus, errorThrown);});
    });

});

function pdfViewer(pdfName, certificateName, certificateID){        
            $('li').removeClass('active');
            $(certificateID).addClass('active');
            $('#pdf-viewer').empty();
            const url = pdfName; // Update with your PDF file path
            // Load the PDF
            pdfjsLib.getDocument(url).promise.then(function(pdf) {
                // Fetch the first page
                pdf.getPage(1).then(function(page) {
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale: scale });

                    // Prepare canvas using PDF page dimensions
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.className = 'card-img-top';

                    // Append canvas to the viewer
                    
                    $('#pdf-viewer').append(canvas);
                    $('#card-title').html(certificateName);

                    // Render PDF page into canvas context
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
            });
}

