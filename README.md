# MILE project website

An independent static research website for **MILE: A Mechanically Isomorphic Hand Exoskeleton and Visuotactile Robotic Hand for Data Collection in Dexterous Manipulation**.

Paper: https://arxiv.org/abs/2512.00324

## Preview

From this directory:

```sh
python -m http.server 18943 --bind 127.0.0.1
```

Open http://127.0.0.1:18943. No package installation or build is required.

## GitHub Pages

Publish the contents of this directory as the root of a dedicated repository. In **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`. `.nojekyll` disables Jekyll processing. The project URL is `https://<owner>.github.io/<repository>/`.

All assets use relative paths, so the same directory also works at a custom domain or on another static host. Only this directory belongs in the public website repository; the surrounding paper revision files and review notes do not.

## Editing

- `index.html`: text, authors, research figures, public paper links, BibTeX.
- `style.css`: responsive layout, colours, typography.
- `app.js`: video tabs, citation copy, navigation state.
- `assets/`: self-hosted images and videos (WebM with MP4 fallback). No Google Fonts, CDN scripts, YouTube, Google Drive embeds, analytics, or third-party runtime libraries.

Videos are presented with `object-fit: contain`; the original portrait, square, and landscape aspect ratios are preserved. The four complete videos use the repository's current supplementary source files and retain those files' timing and audio. The source precision video contains a 2× annotation; the website does not relabel it as real-time.

The opening is static: a descriptive human-first title, project introduction, demonstration and sensor-build links, and the 17-DoF / four-fingertip highlights. The system overview is displayed below the paper information on a light background. The four-video demonstration section and teleoperation benchmark follow the paper information, ahead of the detailed human-first design explanation. No video autoplays or loads in the hero. The four full videos in the demonstrations section load on demand through native HTML video controls. Readers can open MP4 files directly if their browser cannot play the inline video.

## Access and hosting

The self-contained assets remove a dependency on Google services. Hosting on GitHub Pages does not establish reliable access from every mainland-China network. Test on the networks of interest; the same static files can be deployed to a suitable alternative host when necessary. GitHub Pages also has hosting and bandwidth limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Scientific content

The website uses the current MILE manuscript, its four supplementary videos, and the public arXiv record. The teleoperation chart reports **mean success over the four evaluated tasks**, not autonomous-policy success. No journal acceptance status, public dataset release, or implementation repository is claimed. Figure and research-media rights remain with their respective owners.

## Original project-page completeness

The six project figures from the Google Sites page are retained without changing their image bytes: system overview, human-first design, hardware components, data collection pipeline, dataset modalities, and the full exoskeleton precision plot. The complete abstract is available in an expandable disclosure beside the paper information. Sensor release links appear both beside the paper and in the hardware section: https://github.com/jindadu00/MILE-Tactile-Sensor .

Acknowledgements preserve all 15 people; the wording follows the current manuscript at the author's direction. The bibliography uses the current paper title rather than the older title in the original Google embed.

## Sharing

`assets/mile-share-cover-qr.png` is the titled social preview, using the author-provided system overview and the title **MILE — Human-first Design for Dexterous Data Collection**. Its QR code links to https://jindadu00.github.io/MILE/ and was decoded from the exported full cover to verify the destination. Open Graph and large-image card metadata reference its absolute GitHub Pages URL. The original cover without the QR code remains available as `assets/mile-share-cover.png`. The six original research figures are retained separately and unchanged.

## Publication and profile links

The paper information names IEEE/ASME Transactions on Mechatronics with an explicit Under review label. A future opening teaser is deferred until the author confirms acceptance and selects the final promotional edit; the website does not enable one automatically. Personal-homepage links are intentionally disabled until the author confirms paper acceptance. Restore both the project-page author link and the personal-homepage project link together after that confirmation; do not infer acceptance from a date or preprint update.

The expanded human-first design explanation follows the author-provided main-paper Sections III-A–C and Supplementary Sections II–III. The claim of no online task-space retargeting applies to the calibrated exoskeleton-to-robot command mapping. The wearable remains an ergonomic approximation of the human hand.
