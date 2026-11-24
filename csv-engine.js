/**
 * CSV Engine - Bulk Emailer by Badal
 * Handles robust RFC-4180 parsing, quotes, delimiters, and intelligent column mapping.
 */
const BadalCSV = {
  /**
   * Parse CSV string into array of objects
   */
  parse(text) {
    if (!text || !text.trim()) return [];
    
    // Normalize newlines
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const rows = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parsedRow = this.parseLine(lines[i]);
      if (parsedRow.length > 0) {
        rows.push(parsedRow);
      }
    }
    
    if (rows.length < 2) return [];
    
    const rawHeaders = rows[0].map(h => h.trim());
    const data = [];
    
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      // Skip empty row
      if (row.length === 1 && !row[0].trim()) continue;
      
      const entry = {};
      for (let c = 0; c < rawHeaders.length; c++) {
        const key = rawHeaders[c] || `Column_${c + 1}`;
        entry[key] = (row[c] !== undefined ? row[c] : '').trim();
      }
      data.push(entry);
    }
    
    return data;
  },

  /**
   * Robust line parser that respects quotes containing commas
   */
  parseLine(text) {
    const values = [];
    let curVal = '';
    let inQuotes = false;
    
    // Auto-detect delimiter (, or ;)
    const delimiter = (text.indexOf(';') > -1 && text.indexOf(',') === -1) ? ';' : ',';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          curVal += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(curVal.trim());
        curVal = '';
      } else {
        curVal += char;
      }
    }
    values.push(curVal.trim());
    return values;
  },

  /**
   * Auto-detect the best column match for email and name
   */
  detectColumns(records) {
    if (!records || records.length === 0) return { emailCol: null, nameCol: null, allCols: [] };
    
    const sample = records[0];
    const allCols = Object.keys(sample);
    
    let emailCol = allCols.find(col => /^(email|e-mail|mail|email_id|emailaddress)$/i.test(col.trim()))
      || allCols.find(col => /email|mail/i.test(col))
      || null;

    let nameCol = allCols.find(col => /^(name|fullname|full_name|professor|recipient|contact_name)$/i.test(col.trim()))
      || allCols.find(col => /name/i.test(col))
      || null;

    // Fallback: look at data values if header detection didn't hit
    if (!emailCol) {
      for (const col of allCols) {
        if (records.some(r => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r[col] || ''))) {
          emailCol = col;
          break;
        }
      }
    }

    return { emailCol, nameCol, allCols };
  },

  /**
   * Parses quick manual text input (e.g. pasted lines like "Name, Email" or just "Email")
   */
  parseManual(text) {
    if (!text || !text.trim()) return [];
    const lines = text.trim().split(/\n+/);
    const records = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      if (trimmed.includes(',') || trimmed.includes('\t')) {
        const parts = trimmed.split(/,|\t/).map(p => p.trim());
        if (parts.length >= 2) {
          // If first part has @, swap
          if (parts[0].includes('@') && !parts[1].includes('@')) {
            records.push({ Name: parts[1], Email: parts[0] });
          } else {
            records.push({ Name: parts[0], Email: parts[1] });
          }
          return;
        }
      }
      
      // Just single email
      if (trimmed.includes('@')) {
        const cleanEmail = trimmed.replace(/[<>;]/g, '').trim();
        records.push({ Name: cleanEmail.split('@')[0], Email: cleanEmail });
      }
    });

    return records;
  }
};
