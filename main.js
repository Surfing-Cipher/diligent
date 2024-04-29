  // Define the image upload handler callback function
const image_upload_handler_callback = (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'upload.php'); // Adjust the URL to your server-side script
    
    xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
    };
    
    xhr.onload = () => {
        if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
        }
      
        if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
        }
      
        const json = JSON.parse(xhr.responseText);
      
        if (!json || typeof json.location != 'string') {
            reject('Invalid JSON: ' + xhr.responseText);
            return;
        }
      
        resolve(json.location);
    };
    
    xhr.onerror = () => {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };
    
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    
    xhr.send(formData);
});

// Initialize TinyMCE with image upload configuration
tinymce.init({
    selector: 'textarea.rich-editor',
    plugins: 'image ' +
             'anchor autolink charmap codesample link lists media searchreplace table visualblocks wordcount linkchecker code ' +
             'your_previous_plugins_here', // Add your previous plugins here
    
    toolbar: 'undo redo | blocks fontfamily fontsize | insert | styleselect | bold italic underline strikethrough | align lineheight |  link image media table mergetags | checklist numlist bullist indent outdent |  removeformat | code ',

    // Configure the image plugin and upload functionality
    images_upload_url: 'upload.php', // Adjust the URL to your server-side script
    images_upload_handler: image_upload_handler_callback
});

tinymce.init({
       selector: '#myTextarea',
    plugins: 'image ' +
             'anchor autolink charmap codesample link lists media searchreplace table visualblocks wordcount linkchecker code ',   
    toolbar: 'undo redo | blocks fontfamily fontsize | insert | styleselect | bold italic underline strikethrough | align lineheight |  link image media table mergetags | checklist numlist bullist indent outdent |  removeformat | code ',

    // Configure the image plugin and upload functionality
    images_upload_url: 'upload.php', // Adjust the URL to your server-side script
    images_upload_handler: image_upload_handler_callback

});




















