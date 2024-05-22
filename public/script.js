document.addEventListener('DOMContentLoaded', function() {
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');
    const quantityValues = document.querySelectorAll('.quantity-value');

    // Load cart items from local storage when page is loaded
    loadCartItems();

    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            let currentValue = parseInt(quantityValues[index].innerText);
            quantityValues[index].innerText = currentValue + 1;
            updateCartCount();
        });
    });

    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            let currentValue = parseInt(quantityValues[index].innerText);
            if (currentValue > 0) {
                quantityValues[index].innerText = currentValue - 1;
                updateCartCount();
            }
        });
    });

    function updateCartCount() {
        const cart = [];
        quantityValues.forEach((value, index) => {
            const quantity = parseInt(value.innerText);
            if (quantity > 0) {
                const productName = document.querySelectorAll('.product h2')[index].innerText;
                cart.push({
                    product: productName,
                    quantity: quantity
                });
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart) {
            cart.forEach(item => {
                const productName = item.product;
                const productIndex = Array.from(document.querySelectorAll('.product h2')).findIndex(elem => elem.innerText === productName);
                if (productIndex !== -1) {
                    quantityValues[productIndex].innerText = item.quantity;
                }
            });
        }
    }
});
