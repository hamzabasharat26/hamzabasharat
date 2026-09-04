# Third-party assets

## brain-human.glb

The anatomical brain mesh sampled into `public/brain-points.bin`.

- **Title:** Detailed Human Brain Model (3D)
- **Author:** Johnson J
- **Source:** https://3d.nih.gov/entries/3DPX-021161 (NIH 3D)
- **Licence:** [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Format:** glTF binary (GLB), 13.16 MB, 377,701 triangles

NIH 3D hosts user submissions under per-entry licences — this one is **not**
public domain, and attribution is required wherever the derived artwork ships.

### Derivative notice

`public/brain-points.bin` is a derivative of this mesh: 55,000 points sampled
area-weighted over its surface, reoriented, rescaled, and annotated with a
per-point fold weight. No original geometry ships to the browser.

### Re-downloading

The GLB is gitignored (13 MB). To re-bake from source:

```bash
mkdir -p assets
curl -L -o assets/brain-human.glb \
  "https://3d.nih.gov/api/download?submissionId=27696&fileIds=659758"
npm run bake:brain
```

The `/entries/download/...` page URL returns HTML, and the underlying S3 object
is not publicly readable — the `api/download` endpoint above is the one the
site's own download button calls.
