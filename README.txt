
Medzone Supplies — Static site for Netlify
=========================================

What's included:
- index.html (responsive landing page)
- assets/css/style.css
- assets/js/main.js
- assets/images/hero.jpg (provided image or placeholder)
- admin/ (Netlify CMS entry)
  - index.html
  - config.yml
- netlify.toml
- robots.txt
- sitemap.xml
- content/ (sample content files for CMS)
- README and this ZIP

How to deploy to Netlify:
1. Create a new Git repository and push the project.
2. In Netlify, connect your repository and deploy. The site is ready as a static publish.
3. To use Netlify CMS:
   - Enable Identity service in Netlify (Settings > Identity > Enable Identity).
   - Enable Git Gateway (Identity > Services > Git Gateway) and configure.
   - Invite a user (yourself) to confirm identity to login to /admin.
4. Replace the Google Analytics Measurement ID (G-MEASUREMENT_ID) in index.html with your GA4 ID.
5. Replace the Google Search Console token in the meta tag with your verification code, or verify via Netlify domain.

Notes on SEO & Analytics:
- update <title>, <meta description>, and canonical URL to match your domain.
- Add high-quality images and alt attributes.
- Submit sitemap.xml URL to Google Search Console after deploying.

Netlify forms:
- The contact form uses Netlify Forms. After deploy, Netlify will detect the form submissions.

Replace placeholders:
- G-MEASUREMENT_ID -> your Google Analytics 4 measurement ID (G-XXXXXXXXX)
- REPLACE_WITH_GSC_TOKEN -> your Google Search Console meta token
- canonical URL -> set to your actual site URL

Download this zip and edit files locally before pushing to your git repository for Netlify deploy.
