document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
  )
    .then((response) => response.json())
    .then((data) => {
      const product = data.product;
      document.getElementById("productTitle").innerText = product.title;
      document.getElementById("vendor").innerText = product.vendor;
      document.getElementById("price").innerText = product.price;
      document.getElementById("comparePrice").innerText =
        product.compare_at_price;
      document.getElementById("discount").innerText = `${calculateDiscount(
        product.price,
        product.compare_at_price
      )}% Off`;
      document.getElementById("description").innerHTML = product.description;

      const mainImage = document.getElementById("mainImage");
      const fallbackImages = [
        "https://plus.unsplash.com/premium_photo-1690038781199-1c75a1e406c0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1690038783904-b9d3edc24992?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D8",
        "https://plus.unsplash.com/premium_photo-1690038783610-5983d023ce5e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1690038784040-709f23b1d53b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ];

      const setMainImage = (src, fallbackIndex = 0) => {
        mainImage.src = src;
        mainImage.onerror = () => {
          if (fallbackIndex < fallbackImages.length) {
            setMainImage(fallbackImages[fallbackIndex], fallbackIndex + 1);
          }
        };
      };

      setMainImage(product.images[0]?.src || fallbackImages[0]);

      const thumbnails = document.getElementById("thumbnails");
      product.images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image.src;
        img.onerror = () => {
          img.src = fallbackImages[index];
        };
        img.onclick = () => {
          mainImage.src = img.src;
          document
            .querySelectorAll(".thumbnail-images img")
            .forEach((img) => img.classList.remove("active"));
          img.classList.add("active");
        };
        if (index === 0) img.classList.add("active");
        thumbnails.appendChild(img);
      });

      const colorOptions = document.getElementById("colorOptions");
      product.options[0].values.forEach((color, index) => {
        const colorName = Object.keys(color)[0];
        const colorValue = color[colorName];
        const button = document.createElement("button");
        button.style.backgroundColor = colorValue;
        button.dataset.colorName = colorName;
        button.onclick = () => {
          document
            .querySelectorAll("#colorOptions button")
            .forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        };
        if (index === 0) button.classList.add("selected");
        colorOptions.appendChild(button);
      });

      const sizeOptions = document.getElementById("sizeOptions");
      product.options[1].values.forEach((size, index) => {
        const button = document.createElement("button");
        button.innerText = size;
        button.onclick = () => {
          document
            .querySelectorAll("#sizeOptions button")
            .forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        };
        if (index === 0) button.classList.add("selected");
        sizeOptions.appendChild(button);
      });

      document.getElementById("addToCart").onclick = () => {
        const selectedColor = document.querySelector(
          "#colorOptions button.selected"
        );
        const selectedSize = document.querySelector(
          "#sizeOptions button.selected"
        );
        const quantityInput = document.getElementById("quantity");

        if (selectedColor && selectedSize) {
          const colorName = selectedColor.dataset.colorName;
          const size = selectedSize.innerText;
          const quantity = quantityInput.value;
          const cartMessage = `${quantity} x ${product.title} with Color ${colorName} and Size ${size} added to cart`;

          document.getElementById("cartDetails").innerText = cartMessage;
          document.getElementById("cartMessage").classList.remove("hidden");
        } else {
          alert("Please select a color and size.");
        }
      };

      document.getElementById("increaseQuantity").onclick = () => {
        const quantityInput = document.getElementById("quantity");
        quantityInput.value = parseInt(quantityInput.value) + 1;
      };

      document.getElementById("decreaseQuantity").onclick = () => {
        const quantityInput = document.getElementById("quantity");
        if (quantityInput.value > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      };
    })
    .catch((error) => console.error("Error fetching product data:", error));

  function calculateDiscount(price, comparePrice) {
    const priceNum = parseFloat(price.replace("$", ""));
    const comparePriceNum = parseFloat(comparePrice.replace("$", ""));
    return Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100);
  }
});
