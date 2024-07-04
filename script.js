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
      const placeholderImage =
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      mainImage.src = placeholderImage;

      const thumbnails = document.getElementById("thumbnails");
      product.images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = placeholderImage;
        img.onclick = () => {
          mainImage.src = placeholderImage;
          document
            .querySelectorAll(".thumbnail-images img")
            .forEach((img) => img.classList.remove("active"));
          img.classList.add("active");
        };
        if (index === 0) img.classList.add("active");
        thumbnails.appendChild(img);
      });

      const colorOptions = document.getElementById("colorOptions");
      product.options[0].values.forEach((color) => {
        const button = document.createElement("button");
        button.style.backgroundColor = Object.values(color)[0];
        button.onclick = () => {
          document
            .querySelectorAll("#colorOptions button")
            .forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        };
        colorOptions.appendChild(button);
      });

      const sizeOptions = document.getElementById("sizeOptions");
      product.options[1].values.forEach((size) => {
        const button = document.createElement("button");
        button.innerText = size;
        button.onclick = () => {
          document
            .querySelectorAll("#sizeOptions button")
            .forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        };
        sizeOptions.appendChild(button);
      });

      document.getElementById("addToCart").onclick = () => {
        const selectedColor = document.querySelector(
          "#colorOptions button.selected"
        );
        const selectedSize = document.querySelector(
          "#sizeOptions button.selected"
        );
        const quantity = document.getElementById("quantity").value;

        if (selectedColor && selectedSize) {
          const color = selectedColor.style.backgroundColor;
          const size = selectedSize.innerText;
          document.getElementById(
            "cartDetails"
          ).innerText = `${quantity} x ${product.title} (Color: ${color}, Size: ${size})`;
          document.getElementById("cartMessage").classList.remove("hidden");
        } else {
          alert("Please select a color and size.");
        }
      };
    });

  function calculateDiscount(price, comparePrice) {
    const priceNum = parseFloat(price.replace("$", ""));
    const comparePriceNum = parseFloat(comparePrice.replace("$", ""));
    return Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100);
  }

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
});
