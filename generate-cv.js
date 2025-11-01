#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to compile Mustache-style templates
function compileTemplate(template, data) {
    let output = template;
    
    // Process sections recursively
    function processSections(templateContent, contextData) {
        let result = templateContent;
        let changed = true;
        
        while (changed) {
            changed = false;
            
            // Process sections (e.g., {{#experience}}...{{/experience}}, {{#skills}}...{{/skills}})
            result = result.replace(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/gs, (match, section, content) => {
                changed = true;
                
                const sectionData = contextData[section];
                if (sectionData === undefined || sectionData === null) {
                    return '';
                }
                
                if (Array.isArray(sectionData)) {
                    // For arrays (like experience)
                    let arrayResult = '';
                    for (const item of sectionData) {
                        let itemContent = content;
                        
                        // Replace simple variables in the item content
                        itemContent = itemContent.replace(/\{\{(\w+)\}\}/g, (varMatch, key) => {
                            return item[key] !== undefined ? item[key] : varMatch;
                        });
                        
                        // Process {{.}} for array items
                        itemContent = itemContent.replace(/\{\{\s*\.\s*\}\}/g, (varMatch) => {
                            return typeof item === 'string' ? item : varMatch;
                        });
                        
                        // Process nested sections within the item using the array item as context
                        itemContent = processSections(itemContent, item);
                        
                        arrayResult += itemContent;
                    }
                    return arrayResult;
                } else if (typeof sectionData === 'object') {
                    // For objects (like skills)
                    let itemContent = content;
                    
                    // Replace simple variables using the object's properties
                    itemContent = itemContent.replace(/\{\{(\w+)\}\}/g, (varMatch, key) => {
                        return sectionData[key] !== undefined ? sectionData[key] : varMatch;
                    });
                    
                    // Process nested sections within the object using the object as context
                    itemContent = processSections(itemContent, sectionData);
                    
                    return itemContent;
                } else {
                    // Non-array, non-object values should not have sections inside them
                    return '';
                }
            });
        }
        
        return result;
    }
    
    // Process all sections first
    output = processSections(output, data);
    
    // Replace simple variables (e.g., {{name}})
    output = output.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
    
    return output;
}

// Main function
function main() {
    // Parse command-line arguments
    const args = process.argv.slice(2);
    
    // Default values
    let jsonDataPath = 'cv-data.json';
    let templatePath = 'template-classic.html';
    let outputPath = 'cv-output.html';
    let templateName = 'classic';
    
    // Parse arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--data' && args[i + 1]) {
            jsonDataPath = args[i + 1];
            i++;
        } else if (args[i] === '--template' && args[i + 1]) {
            templateName = args[i + 1];
            i++;
        } else if (args[i] === '--output' && args[i + 1]) {
            outputPath = args[i + 1];
            i++;
        } else if (args[i] === '--help') {
            console.log(`
Usage: node generate-cv.js [options]

Options:
  --data <path>      Path to the JSON data file (default: cv-data.json)
  --template <name>  Template name: classic, modern, colorful, ocean, purple (default: classic)
  --output <path>    Output path for the generated CV (default: cv-output.html)
  --help             Show this help message
  
Examples:
  node generate-cv.js
  node generate-cv.js --data my-cv.json --template modern --output my-cv.html
            `);
            process.exit(0);
        }
    }
    
    // Determine template path based on template name
    if (['classic', 'modern', 'colorful', 'ocean', 'purple'].includes(templateName)) {
        templatePath = `template-${templateName}.html`;
    } else if (!fs.existsSync(templatePath)) {
        console.error(`Error: Template "${templateName}" not found. Use classic, modern, colorful, ocean, or purple.`);
        process.exit(1);
    }
    
    // Check if files exist
    if (!fs.existsSync(jsonDataPath)) {
        console.error(`Error: JSON data file not found at "${jsonDataPath}"`);
        process.exit(1);
    }
    
    if (!fs.existsSync(templatePath)) {
        console.error(`Error: Template file not found at "${templatePath}"`);
        process.exit(1);
    }
    
    try {
        // Read the JSON data
        const jsonData = fs.readFileSync(jsonDataPath, 'utf8');
        const data = JSON.parse(jsonData);
        
        // Flatten the data to make skills arrays and basic info available at root level
        // This is needed because templates reference {{#professional}}, {{#competent}}, {{#plus}} and basic info directly
        const flattenedData = {
            ...data,
            ...data.skills,  // This adds professional, competent, plus to the root level
            ...data.basicInfo,  // This adds name, title, email, etc. to the root level
        };
        
        // Read the template
        const template = fs.readFileSync(templatePath, 'utf8');
        
        // Compile the template with the flattened data
        const compiledHtml = compileTemplate(template, flattenedData);
        
        // Write the output
        fs.writeFileSync(outputPath, compiledHtml);
        
        console.log(`CV generated successfully: ${outputPath}`);
        console.log(`Using template: ${templatePath}`);
        console.log(`Using data: ${jsonDataPath}`);
    } catch (error) {
        console.error('Error generating CV:', error.message);
        process.exit(1);
    }
}

// Run the main function
main();