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
- `app.js`: video tabs, excerpt playback, citation copy, navigation state.
- `assets/`: self-hosted images and videos (WebM with MP4 fallback). No Google Fonts, CDN scripts, YouTube, Google Drive embeds, analytics, or third-party runtime libraries.

Videos are presented with `object-fit: contain`; the original portrait, square, and landscape aspect ratios are preserved. The four complete videos keep their original timing and audio. The silent hero video is a 20-second excerpt (6–26 s) from Supplementary Video 1. The source precision video contains a 2× annotation; the website does not relabel it as real-time.

Autoplay is limited to a muted, visible hero excerpt. Reduced-motion and data-saving preferences disable automatic playback. The full videos load on demand through native HTML video controls. Readers can open MP4 files directly if their browser cannot play the inline video.

## Access and hosting

The self-contained assets remove a dependency on Google services. Hosting on GitHub Pages does not establish reliable access from every mainland-China network. Test on the networks of interest; the same static files can be deployed to a suitable alternative host when necessary. GitHub Pages also has hosting and bandwidth limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Scientific content

The website uses the current MILE manuscript, its four supplementary videos, and the public arXiv record. The teleoperation chart reports **mean success over the four evaluated tasks**, not autonomous-policy success. No journal acceptance status, public dataset release, or implementation repository is claimed. Figure and research-media rights remain with their respective owners.
