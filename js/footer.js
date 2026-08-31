(function () {

    // Find the footer placeholder
    const placeholder =
        document.getElementById("footer-placeholder");

    // Stop if this page doesn't have a footer placeholder
    if (!placeholder) return;


    // Load footer.html
    fetch("footer.html")

        .then(response => {

            // Check if footer.html exists
            if (!response.ok) {
                throw new Error(
                    `Failed to load footer.html: ${response.status}`
                );
            }

            return response.text();

        })

        .then(html => {

            // Replace the placeholder with the actual footer
            placeholder.outerHTML = html;

        })

        .catch(error => {

            console.error(
                "Footer failed to load:",
                error
            );

        });

})();