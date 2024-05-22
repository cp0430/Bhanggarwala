document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cart-items');
    const verifyButton = document.querySelector('.verify-button');
    const fileUpload = document.getElementById('file-upload');

    // Add event listener to the file input field
    function deleteImage(imageElement, deleteButton) {
        // Remove the image and associated delete button
        imageElement.parentNode.removeChild(imageElement);
        deleteButton.parentNode.removeChild(deleteButton);
    }

    // Add event listener to the file input field
    fileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // Display the selected image on the page
            const imageUrl = URL.createObjectURL(file);
            const image = document.createElement('img');
            image.src = imageUrl;
            image.style.width = '150px';
            image.style.height = '150px';
            image.style.marginRight = '10px';
            cartItems.appendChild(image);

            // Create a delete button for the image
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.marginRight = '10px';
            deleteButton.addEventListener('click', function() {
                deleteImage(image, deleteButton);
            });
            cartItems.appendChild(deleteButton);
        }
    });


    // Dummy functionality for the verify button (do nothing)
 
});
document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cart-items');
    const clearCartButton = document.getElementById('clear-cart');
  
    // Load cart items from local storage
    loadCartItems();
  
    // Clear cart button event listener
    clearCartButton.addEventListener('click', function() {
        localStorage.removeItem('cart');
        cartItems.innerHTML = '';
    });
  
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart) {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.product} - Quantity: ${item.quantity}`;
                cartItems.appendChild(li);
            });
        }
    }
  });
  // cart.js

document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('file-upload');
    const verifyButton = document.querySelector('.verify-button');

    // Add event listener to the file input field
    fileUpload.addEventListener('change', function(event) {
        // Logic for displaying the selected image (same as before)
    });

    // Handle click event on the Verify button
    verifyButton.addEventListener('click', function() {
        const file = fileUpload.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(result => {
                alert(result); // Show success message
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        } else {
            alert('Please select an image before verifying.');
        }
    });
});

document.getElementById('verifyButton').addEventListener('click', async function() {
            try {
                const canvas = document.getElementById('canvas');
                const encryptedImageData = canvas.toDataURL(); // Get encrypted image data from canvas
                const response = await fetch('/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: encryptedImageData })
                });
                if (response.ok) {
                    alert('Image uploaded successfully');
                } else {
                    alert('Error uploading image');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });