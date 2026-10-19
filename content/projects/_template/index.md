---
# Copy this folder to content/projects/<lowercase-hyphenated-slug>/index.md.
# Keep every required field. The build validates category/tag names and cross-links.
# Add or edit project content here; do not add project facts to components.
title: "[TODO: Project title]"
slug: "[TODO: lowercase-hyphenated-slug]"
category: "[TODO: One exact category from content/taxonomy.json]"
tags: [] # Any number of exact tags from content/taxonomy.json.
startDate: "2026-01" # Required format YYYY-MM.
endDate: "2026-01" # YYYY-MM or present.
role: "[TODO: Role; do not invent one]"
context: "[TODO: Course, lab, competition or other context]"
featured: false # Use true for a homepage feature.
featuredOrder: 7 # Required and unique only when featured=true.
summary: "[TODO: One factual sentence for cards and archive]"
results: [] # Supplied key numbers/results only; leave empty when none were supplied.
spec: "[TODO: A concise factual engineering spec line]"
tools: [] # Tools or methods explicitly supported by the source content.
cover: "cover.jpg" # Drop the original JPG/PNG/WebP in this folder; build creates responsive WebP.
coverAlt: "[TODO: Describe cover.jpg for screen readers]"
photos:
  - src: "photo-1.jpg" # Use local filenames only; 2–3 project photos are typical.
    alt: "[TODO: Accurate image description for screen readers]"
  - src: "photo-2.jpg"
    alt: "[TODO: Accurate image description for screen readers]"
videos:
  - src: "video-1.mp4" # Local muted/looping MP4 or an accurate YouTube/Vimeo URL.
    poster: "video-1-poster.jpg" # Required local poster when src is an MP4.
    alt: "[TODO: Describe the video content]"
# Optional exact slug relationships. Related pages populate automatically.
# experience: "research-intern-vistec"
# achievement: "ntu-hackathon-2026"
# relatedProjects: ["another-project-slug"]
overview: "[TODO: Problem/goal, using only supplied facts]"
whatIDid:
  - "[TODO: One factual contribution]"
process:
  - "[TODO: One factual process/iteration/analysis note]"
learning: "[TODO: What I learned; keep visible until supplied]"
---
<!-- This template folder is excluded from the generated site and project count. -->
