const output = document.getElementById("output");
    const btn = document.getElementById("download-images-button");

    const images = [
      { url: "https://picsum.photos/id/237/200/300" },
      { url: "https://picsum.photos/id/238/200/300" },
      { url: "https://picsum.photos/id/239/200/300" },
    ];

    // Function to download an image
    function downloadImage(image) {
      return new Promise((resolve, reject) => {
        fetch(image.url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load image's URL: ${image.url}`);
            }
            return response.blob();
          })
          .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              URL.revokeObjectURL(imageUrl);
              resolve(img);
            };
            img.onerror = () => {
              URL.revokeObjectURL(imageUrl);
              reject(new Error(`Failed to load image's URL: ${image.url}`));
            };
            img.src = imageUrl;
          })
          .catch(error => reject(error));
      });
    }

    // Function to download all images in parallel
    function downloadAllImages(images) {
      return Promise.all(images.map(image => downloadImage(image)));
    }

    // Event listener for button click
    btn.addEventListener("click", () => {
      output.innerHTML = "Downloading images...";
      downloadAllImages(images)
        .then(downloadedImages => {
          output.innerHTML = "";
          downloadedImages.forEach(img => output.appendChild(img));
        })
        .catch(error => {
          output.innerHTML = `Error: ${error.message}`;
        });
    });