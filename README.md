# CV Template Generator

A Node.js-based CV generator that creates professional CVs from JSON data using customizable HTML templates.

## Features

- Three different CV templates: Classic, Modern, and Colorful
- Clean, print-friendly layouts that look consistent in browser and print
- Skills section with three levels: Professional, Competent, Plus
- Experience section with 5 project entries
- Profile section for a brief introduction
- Contact information section

## Files

- `cv-data.json`: Sample CV data in JSON format
- `template-classic.html`: Classic CV template
- `template-modern.html`: Modern two-column CV template
- `template-colorful.html`: Colorful, creative CV template
- `template-ocean.html`: Ocean-themed CV template
- `template-purple.html`: Purple-themed CV template
- `generate-cv.js`: Node.js script to generate CVs from data and templates
- `README.md`: This file

## Usage

```bash
# Generate CV with default settings (classic template)
node generate-cv.js

# Generate CV with specific template
node generate-cv.js --template modern --output my-cv.html

# Use custom data file and template
node generate-cv.js --data my-data.json --template colorful --output colorful-cv.html

# Show help
node generate-cv.js --help
```

## Template Options

- `classic`: Clean, traditional layout
- `modern`: Two-column layout with gradient accents
- `colorful`: Creative, colorful design
- `ocean`: Ocean-themed design with blue gradients
- `purple`: Purple-themed design with purple gradients

## Customization

To customize your CV:

1. Modify `cv-data.json` with your personal information
2. Run the generation script with your preferred template
3. Open the generated HTML file in a browser to review
4. Print or save as PDF for distribution

## Data Structure

The JSON data file should contain:

- `basicInfo`: Name, title, contact information
- `profile`: Brief professional summary
- `skills`: Object with `professional`, `competent`, and `plus` arrays
- `experience`: Array of job experiences with title, company, dates, etc.