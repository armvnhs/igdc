# IGDC

Persian RTL, light-only static website. Typography uses assets/fonts/Ravi-VF.ttf with regular and medium weights. No build step is required.

## Sponsor placement and wordmark alignment

Sponsors now follow About and use a light-gray background to separate the sections. The hero wordmark uses LTR layout, increased tracking and cap-height trimming for visual centering. Desktop/mobile checks confirm centered positioning and no horizontal page overflow.

## Previous membership and supporters update

Removed the homepage contact section, member range status and all-members chevron. Header subtitle now uses the club tagline. Instagram is igdc.ir, configured in Site settings and Footer social links. Statistics have more vertical space.

Membership dialog has an empty illustration area. Upload artwork through Site settings > Membership illustration; leave blank to reserve its space. No illustration was generated or copied from the references.

Sponsors stay directly before About. Logos scroll continuously, show grayscale by default and become colored on hover/focus. The rail pauses on hover or keyboard focus and supports manual horizontal scrolling. Reduced motion disables automatic movement; duplicated logo sets are hidden from assistive technology and keyboard navigation. Blank slots reserve space until sponsors are entered in Club sponsors. No test partner records or logos were saved to content.

Validated dialog/Instagram, removed controls, 320/390/768/900px layout, continuous motion, hover pause and grayscale-to-color behavior with temporary preview content. No ZIP generated.

## Previous header, statistics and sponsors update

Desktop navigation is centered independently of side content; the header has top spacing. Statistics now have no panel background, border or shadow and include Tabler icons. The statistics row matches the feature-stage width.

Club sponsors is a new English CMS section backed by content/sponsors.json, placed below members. Edit its title, description, empty-state text, sponsor names, logos and HTTPS website links. No real sponsors have been invented; the section shows its invitation until records are added. Upload the new JSON file and updated .pages.yml, HTML, CSS and JavaScript files together. No ZIP generated.

Validated: desktop navigation center within a fraction of a pixel, statistics width matches stage, and no horizontal overflow at 320/390/768/900px. Sponsor rendering and URL checks pass.

## Previous immersive design update

Visible introduction removed; taller feature stage, raised statistics panel and scroll reveal animations with reduced-motion support. Full-bleed member portraits use bottom gradients, grayscale-to-color hover/focus and configured social links. Ten editable sample members are included. Replace placeholder names, portraits and social URLs in Members.

Footer is a separate English CMS section backed by content/footer.json. Edit its headline, description, button, identity, navigation, social links and copyright. Upload this new content file, .pages.yml and modified HTML/CSS/JavaScript together. No ZIP was created for this update.

Checked: footer content changes, unsafe URL rejection, portrait hover and all four pages at 320px without horizontal overflow.

## Previous visual refresh

The existing layout and interaction scripts are preserved. Styling now uses white, neutral light/dark grays and orange, softer card corners, restrained shadows and pill buttons. All four pages embed official Tabler outline icons; their MIT license is included in assets/TABLER-LICENSE.txt. The existing Logo.png is linked as favicon and Apple touch icon. Ravi typography and the animated hero artwork are unchanged.

Responsive appearance checked at 320, 390, 768 and 1280 pixels.

## Previous functional revision

- Simplified homepage title and club description; compact statistics.
- Responsive header, layouts and forms; fixed RTL horizontal page overflow.
- Animated filled circle and diamond, replaced by an optional CMS banner.
- Two homepage events; open registration has a distinct color. Registration buttons use each event's HTTPS URL.
- Up to ten homepage members with previous/next buttons, touch scrolling and keyboard support. All members have a separate page. Missing portraits use a neutral icon.
- Border-free About icons and a two-column desktop layout.
- Membership button opens a closed-membership notice, or links to a configured application URL when enabled.
- Contact form collects name, phone, optional Telegram username, topic and message. Submission is disabled until an endpoint is configured. No email service is activated yet.
- English CMS labels.

## Deploy

Upload index.html, gallery.html, members.html, form.html, 404.html, robots.txt, sitemap.xml, assets/, content/, .pages.yml, CNAME and .nojekyll to the root of armvnhs/igdc. Keep the leading dots. Upload extracted files, not the ZIP itself.

GitHub Pages settings: deploy from main, root directory. This revision is prepared locally; no remote upload or deployment was performed.

Use a local HTTP server for preview. Opening HTML through file:// may prevent JSON content from loading.

## Pages CMS

Select armvnhs/IGDC and the branch holding these files in Pages CMS. Configuration is .pages.yml. Website text remains Persian; editor labels and descriptions are English.

### Site settings

Club name, homepage title, description, About, contact copy and three statistics are editable. Telegram username igdc_ir is for conversation; Telegram channel URL https://t.me/igdcir is for announcements. Instagram links stay hidden until a real Instagram profile URL is supplied.

Membership is open + Membership application URL: enable both to make the header button link to applications. Keep disabled for the closed-membership notice and social channel links. A missing or invalid URL also keeps membership closed.

Contact form endpoint: leave empty for now, as requested. Later add a verified HTTPS endpoint such as a Formspree form endpoint. The receiving email must be configured and verified in the service. No credentials belong in this public repository. The site displays success only after a successful service response, keeps entered data on failure and prevents duplicate sends while pending.

### Featured banner

Enable Show banner, choose an image and/or enter a title, description, destination URL and button label. This replaces the animated artwork. Disable it to restore the shapes. With no image or title, artwork remains visible.

### Gallery

Gallery is one list of albums, one album per event. Each album has Event name, Event date, Short description, Cover photo and Photos of this event (multi-image list). The cover is shown first inside the album. The homepage shows one card per event; each card links to its album on /gallery, where photos sit in a grid and open in a viewer with previous/next controls. Rendering is handled by assets/gallery.js; cms.js no longer touches the gallery.

### Clean URLs

Pages are served without .html: /gallery, /members, /form. Internal links and asset paths are root-relative, each page has a canonical tag, 404.html handles unknown addresses, and Cloudflare redirect rules send old .html addresses to the clean ones. Script URLs carry a ?v= number; raise it after changing a script so browsers and Cloudflare fetch the new file.

### Members and events

Records have English fields and named collapsed summaries. Homepage uses the first ten members and first two events in content order; collection pages show all records. Current content contains ten sample member records and three event records. No extra people or dates were invented.

Events: enable Registration open for the highlighted status, then set Registration URL to show a real external button. Missing URLs show a pending-link message without an active button. Event overview is form.html.

## Validation

Chrome checks: four pages at 320, 768 and 1280 pixels without horizontal page overflow; 390-pixel mobile overview; 320-pixel contact form; closed membership dialog; member arrows with a temporary 12-record fixture capped at ten on the homepage.

Behavior checks: home content limits, full events page, neutral portrait placeholders, banner replacement, membership activation, invalid URL rejection and contact endpoint enable/disable. Form success and failure paths were tested with mocked responses, including Persian phone normalization and preserving entered data after failure. No external form submission was sent.

Live email delivery, Instagram links and event registration links await real configuration. The selected gallery has no photos, so actual gallery image content remains to be added.


## Full audit update (2026-10-19)

Mobile body text was increased; homepage and collection gallery rows use horizontal snap scrolling. Hero slider supports multiple CMS slides with separate desktop and mobile images, right-bottom copy, buttons, dots and configurable autoplay. Events use full 3:4 poster images on mobile and show free/paid admission. Gallery collection groups images by category. Sponsor marquee speed is reduced. Pages CMS was rebuilt around current fields only; contact endpoint and obsolete site fields were removed. Font family is configurable through Site settings and applies via the site font variable.
