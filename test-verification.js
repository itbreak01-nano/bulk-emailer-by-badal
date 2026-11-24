// Verification script for Emailer Pro Suite
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const context = {
  console: console,
  window: {}
};
context.window = context;

const csvCode = fs.readFileSync(path.join(__dirname, 'csv-engine.js'), 'utf8') + '\n; this.BadalCSV = BadalCSV;';
const tplCode = fs.readFileSync(path.join(__dirname, 'template-engine.js'), 'utf8') + '\n; this.BadalTemplateEngine = BadalTemplateEngine;';
const defCode = fs.readFileSync(path.join(__dirname, 'default-templates.js'), 'utf8') + '\n; this.BadalTemplates = BadalTemplates;';

vm.createContext(context);
vm.runInContext(csvCode, context);
vm.runInContext(tplCode, context);
vm.runInContext(defCode, context);

const BadalCSV = context.BadalCSV;
const BadalTemplateEngine = context.BadalTemplateEngine;
const BadalTemplates = context.BadalTemplates;

console.log('--- Testing CSV Engine ---');
const sampleCSV = `Name,Email,Institution,Research_Areas
"Prof. (Dr.) Anju Rani","anju.rani@example.edu","Graphic Era University","Microbiology, Bioremediation"
"Prof. Rajesh Sharma","rajesh@example.edu","IIT Delhi","Nanotech"`;

const parsed = BadalCSV.parse(sampleCSV);
console.log(`Parsed count: ${parsed.length}`);
if (parsed.length !== 2) throw new Error('Expected 2 rows parsed');
console.log('✅ CSV Engine passed!');

console.log('--- Testing Updated NSTC Logo URL in Predefined Templates ---');
const newLogoUrl = 'https://architecture.celnet.in/wp-content/uploads/2023/03/NSTC-Logo-png.png';
const iosTpl = BadalTemplates.find(t => t.id === 'ios-luxury');
const execTpl = BadalTemplates.find(t => t.id === 'nstc-mentor-invite');

if (!iosTpl.body.includes(newLogoUrl)) {
  throw new Error('Apple iOS template missing updated NSTC logo URL');
}
if (!execTpl.body.includes(newLogoUrl)) {
  throw new Error('Executive NSTC template missing updated NSTC logo URL');
}
console.log('✅ Updated NSTC Logo URL verified in templates!');

console.log('--- Testing Conditional Attachment Notice ({{#if HasAttachment}}) ---');
// Test 1: When HasAttachment is OFF / empty -> Notice should be absent!
const renderedWithoutAttach = BadalTemplateEngine.render(iosTpl.body, { ...parsed[0], HasAttachment: '' });
if (renderedWithoutAttach.includes('Document Attached:')) {
  throw new Error('Email template falsely claims document is attached when HasAttachment is OFF!');
}
console.log('✅ Attachment notice correctly omitted when toggle is OFF!');

// Test 2: When HasAttachment is ON -> Notice should be present!
const renderedWithAttach = BadalTemplateEngine.render(iosTpl.body, { ...parsed[0], HasAttachment: 'true' });
if (!renderedWithAttach.includes('Document Attached:')) {
  throw new Error('Email template missing document attachment notice when HasAttachment is ON!');
}
console.log('✅ Attachment notice correctly included when toggle is ON!');

console.log('\n🎉 ALL LOGO & ATTACHMENT TOGGLE TESTS PASSED WITH 100% SUCCESS!');
