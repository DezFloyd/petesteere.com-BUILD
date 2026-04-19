# Training Content Portfolio

This repository contains the files for a simple, single-page website to showcase training content.

## How to Add New Content

The site is designed to be very easy to update manually.

### 1. Add Your Files

-   **Videos**: Place your `.mp4` video files inside the `assets/videos/` directory.
-   **Documents**: Place your `.pdf` or `.pptx` files inside the `assets/docs/` directory.

### 2. Edit the HTML

Open the `index.html` file. You will see a section that starts with `<!-- ITEM 1: ... -->`.

To add a new item to the page, simply **copy this entire `<section class="training-item">...</section>` block** and paste it below the existing one.

### 3. Update the Content in Your New Section

After you paste the new section, change the following details:

-   **Title**: Update the `<h2>` tag with your new topic title.
    -   `<h2>Sample Topic 2: Advanced Y</h2>`
-   **Description**: Update the `<p class="description">` with your text.
-   **Video File**: Change the `src` attribute in the `<source>` tag to point to your new video file.
    -   `<source src="assets/videos/your-new-video.mp4" type="video/mp4">`
-   **Document Links**: Update the `href` attribute in the `<a>` tags to point to your new documents.
    -   `<a href="assets/docs/your-presentation.pdf" target="_blank">Download Presentation (PDF)</a>`
    -   `<a href="assets/docs/your-worksheet.pptx" target="_blank">Download Worksheet (PowerPoint)</a>`

Save the `index.html` file, and your new content will appear on the page.
