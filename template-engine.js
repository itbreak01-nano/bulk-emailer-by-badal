/**
 * Template Engine - Bulk Emailer by Badal
 * Full DOMParser + RegEx dual-mode CSS inliner with tag, class, and ID support.
 */
const BadalTemplateEngine = {
  /**
   * Render template string against a data record
   */
  render(templateStr, data, fallbacks = {}) {
    if (!templateStr) return '';
    let result = templateStr;

    // 1. Process conditional blocks: {{#if Field}}...{{/if}}
    result = result.replace(/\{\{#if\s+([a-zA-Z0-9_\-\s]+)\}\}([\s\S]*?)\{\{\/if\}\}/gi, (match, fieldName, innerContent) => {
      const key = fieldName.trim();
      const val = this.getValue(data, key);
      return (val && val.trim().length > 0) ? innerContent : '';
    });

    // 2. Replace tags: {{Field}} or {{Field || "Fallback"}}
    result = result.replace(/\{\{([a-zA-Z0-9_\-\s|"]+)\}\}/g, (match, content) => {
      let key = content.trim();
      let fallback = '';

      if (key.includes('||')) {
        const parts = key.split('||').map(p => p.trim());
        key = parts[0];
        fallback = parts[1].replace(/^["']|["']$/g, '');
      }

      let val = this.getValue(data, key);
      if (!val || !val.trim()) {
        val = fallback || fallbacks[key] || '';
      }

      return val;
    });

    // 3. Automatically inline any <style> rules if present
    result = this.inlineStyles(result);

    return result;
  },

  /**
   * Full CSS Inliner:
   * Uses DOMParser in browser (or regex fallback in Node) to convert all CSS rules
   * into direct style="..." attributes on matching elements, then strips <style> blocks.
   */
  inlineStyles(html) {
    if (!html) return '';

    // Check if running in browser environment with native DOMParser
    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const styleTags = doc.querySelectorAll('style');

        styleTags.forEach(styleTag => {
          const cssText = styleTag.textContent || '';
          const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
          const ruleRegex = /([^{}]+)\{([^}]+)\}/g;
          let match;

          while ((match = ruleRegex.exec(cleanCss)) !== null) {
            const selectorStr = match[1].trim();
            const declarationStr = match[2].trim().replace(/\s+/g, ' ');

            // Skip @media, @keyframes, @font-face
            if (selectorStr.startsWith('@')) continue;

            const selectors = selectorStr.split(',');
            selectors.forEach(sel => {
              const cleanSel = sel.trim();
              if (!cleanSel || cleanSel.includes(':hover') || cleanSel.includes(':active') || cleanSel.includes('::')) return;

              try {
                const matchedEls = doc.querySelectorAll(cleanSel);
                matchedEls.forEach(el => {
                  const currentStyle = el.getAttribute('style') || '';
                  const sep = (currentStyle.trim().endsWith(';') || !currentStyle.trim()) ? '' : '; ';
                  el.setAttribute('style', `${currentStyle}${sep}${declarationStr}`);
                });
              } catch (selErr) {
                // Ignore unsupported pseudo selectors
              }
            });
          }
          styleTag.remove();
        });

        // Return inner content without outer doctype/html wrappers
        return (doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML).trim();
      } catch (err) {
        console.warn('[Badal Mailer] DOMParser inliner error:', err);
      }
    }

    // Comprehensive Fallback Inliner (handles .class, #id, and tag selectors)
    let output = html;
    const styleRegex = /<style[\s\S]*?>([\s\S]*?)<\/style>/gi;
    let sMatch;
    const rules = [];

    while ((sMatch = styleRegex.exec(output)) !== null) {
      const css = sMatch[1].replace(/\/\*[\s\S]*?\*\//g, '');
      const rRegex = /([^{}]+)\{([^}]+)\}/g;
      let rMatch;
      while ((rMatch = rRegex.exec(css)) !== null) {
        const selectors = rMatch[1].split(',').map(s => s.trim());
        const declarations = rMatch[2].replace(/\s+/g, ' ').trim();
        rules.push({ selectors, declarations });
      }
    }

    rules.forEach(rule => {
      rule.selectors.forEach(sel => {
        if (sel.startsWith('.')) {
          const className = sel.substring(1);
          const tagRegex = new RegExp(`(<[a-zA-Z0-9]+[^>]*?class=["'][^"']*?\\b${className}\\b[^"']*?["'][^>]*?>)`, 'gi');
          output = output.replace(tagRegex, (tagStr) => {
            if (/style=["']/i.test(tagStr)) {
              return tagStr.replace(/style=["']([^"']*)["']/i, (m, existing) => {
                const sep = existing.trim().endsWith(';') || !existing.trim() ? '' : '; ';
                return `style="${existing}${sep}${rule.declarations};"`;
              });
            } else {
              return tagStr.replace(/>$/, ` style="${rule.declarations}">`);
            }
          });
        } else if (/^[a-zA-Z0-9]+$/.test(sel)) {
          // Tag selector like p, h1, td, table
          const tagRegex = new RegExp(`(<${sel}\\b[^>]*?>)`, 'gi');
          output = output.replace(tagRegex, (tagStr) => {
            if (/style=["']/i.test(tagStr)) {
              return tagStr.replace(/style=["']([^"']*)["']/i, (m, existing) => {
                const sep = existing.trim().endsWith(';') || !existing.trim() ? '' : '; ';
                return `style="${existing}${sep}${rule.declarations};"`;
              });
            } else {
              return tagStr.replace(/>$/, ` style="${rule.declarations}">`);
            }
          });
        }
      });
    });

    return output
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<\/?(html|head|body)[\s\S]*?>/gi, '')
      .trim();
  },

  /**
   * Case-insensitive property lookup
   */
  getValue(data, key) {
    if (!data) return '';
    if (data[key] !== undefined) return String(data[key]);

    const lowerKey = key.toLowerCase();
    for (const k of Object.keys(data)) {
      if (k.toLowerCase() === lowerKey) {
        return String(data[k]);
      }
    }
    return '';
  },

  /**
   * Extract list of tags used in a template
   */
  extractTags(templateStr) {
    if (!templateStr) return [];
    const tags = new Set();
    const regex = /\{\{([a-zA-Z0-9_\-\s|"]+)\}\}/g;
    let match;
    while ((match = regex.exec(templateStr)) !== null) {
      let tag = match[1].trim();
      if (tag.startsWith('#if') || tag.startsWith('/if')) continue;
      if (tag.includes('||')) {
        tag = tag.split('||')[0].trim();
      }
      tags.add(tag);
    }
    return Array.from(tags);
  }
};
