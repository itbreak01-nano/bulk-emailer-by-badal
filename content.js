/**
 * Main Content Script - Emailer Pro Suite (by Badal)
 * Apple Human Interface Guidelines (HIG) Design Architecture.
 * Precise Vector SVG Icons, Dynamic Placeholder Engine, Skeleton Guide & Template Manager.
 */
(() => {
  if (window.__BADAL_MAILER_INITIALIZED__) return;
  window.__BADAL_MAILER_INITIALIZED__ = true;

  const controller = new GmailController();
  let recipients = [];
  let currentPreviewIndex = 0;
  let customPresets = [];
  let currentAttachment = null;
  let isAttachmentEnabled = false;
  let activeTemplate = BadalTemplates[0];
  let customPlaceholders = ['Name', 'Email', 'Institution', 'Research_Areas'];

  // Precision SVG Icons (SF Symbols Style, 1.8px stroke width)
  const ICONS = {
    // Fast Mail with Lightning Icon
    mailFast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5"/><polyline points="22 6 12 13 2 6"/><polygon points="12 1 8 7 12 7 11 13 16 6 12 6 12 1" fill="#0071e3" stroke="none"/></svg>`,
    // Eye Icon for Live Preview
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    // Book + Pen Icon for Template Studio
    bookPen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h9"/><path d="M6 10h5"/><path d="m14 13.5 3-3 2 2-3 3h-2v-2z"/></svg>`,
    // Users Icon for Recipients
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    // Send Icon for Dispatch
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    paperclip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
    file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`
  };

  function init() {
    loadSavedPresets();
    createLauncherButton();
    createModalContainer();
  }

  function loadSavedPresets() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['badal_custom_presets'], (res) => {
          if (res.badal_custom_presets) {
            customPresets = res.badal_custom_presets;
            renderPresetOptions();
          }
        });
      }
    } catch (e) {}
  }

  /**
   * Floating Apple Pill Launcher
   */
  function createLauncherButton() {
    if (document.getElementById('badal-mailer-launcher')) return;
    const btn = document.createElement('div');
    btn.id = 'badal-mailer-launcher';
    btn.innerHTML = `${ICONS.mailFast} <span>Emailer Pro Suite</span>`;
    btn.title = 'Open Emailer Pro Suite (by Badal)';
    btn.onclick = openModal;
    document.body.appendChild(btn);
  }

  /**
   * Apple Modal Window Architecture
   */
  function createModalContainer() {
    if (document.getElementById('badal-mailer-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'badal-mailer-modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div id="badal-mailer-modal">
        <!-- Apple Window Header -->
        <div class="bm-header">
          <div class="bm-header-brand">
            <div class="bm-header-icon">${ICONS.mailFast}</div>
            <div>
              <h2>Emailer Pro Suite</h2>
            </div>
            <span class="bm-badge">by Badal</span>
          </div>
          <button class="bm-close-btn" id="bm-close-modal" title="Close">${ICONS.close}</button>
        </div>

        <!-- Apple Segmented Control Navigation -->
        <div class="bm-nav-wrapper">
          <div class="bm-segmented-control">
            <button class="bm-tab-btn active" data-tab="recipients">${ICONS.users} <span>Recipients (<span id="bm-recipients-count">0</span>)</span></button>
            <button class="bm-tab-btn" data-tab="template">${ICONS.bookPen} <span>Template Studio</span></button>
            <button class="bm-tab-btn" data-tab="preview">${ICONS.eye} <span>Live Preview</span></button>
            <button class="bm-tab-btn" data-tab="dispatch">${ICONS.send} <span>Dispatch Console</span></button>
          </div>
        </div>

        <!-- Content Body (Full Smooth Scroll) -->
        <div class="bm-body">
          <!-- 1. RECIPIENTS VIEW -->
          <div class="bm-tab-panel active" id="bm-tab-recipients">
            <div class="bm-dropzone" id="bm-dropzone">
              <div class="bm-dropzone-icon">${ICONS.upload}</div>
              <div class="bm-dropzone-title">Upload Recipients CSV or Excel Export</div>
              <div class="bm-dropzone-sub">Drag and drop file here, or click to browse</div>
              <input type="file" id="bm-csv-input" accept=".csv,.txt" style="display:none;" />
            </div>

            <!-- Skeleton & Supported Formats Guidance Card -->
            <div class="bm-skeleton-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 13px; font-weight: 600; color: #1d1d1f;">Supported File Structure &amp; Column Skeleton</div>
                <button class="bm-btn bm-btn-secondary" id="bm-btn-download-skeleton" style="padding: 4px 12px; font-size: 11.5px;">
                  ${ICONS.download} <span>Download Skeleton CSV</span>
                </button>
              </div>
              <div style="font-size: 12px; color: #86868b; margin-top: 4px;">
                Emailer Pro Suite auto-detects <strong>Name</strong> and <strong>Email</strong>. Any additional columns (e.g., <em>Institution</em>, <em>Research_Areas</em>, <em>City</em>) automatically become dynamic placeholders:
              </div>
              <table class="bm-skeleton-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Institution (Optional)</th>
                    <th>Research_Areas (Optional)</th>
                    <th>Any_Custom_Column</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Prof. (Dr.) Anju Rani</td>
                    <td>anju.rani@example.edu</td>
                    <td>Graphic Era University</td>
                    <td>Environmental Microbiology</td>
                    <td>Custom Value 1</td>
                  </tr>
                  <tr>
                    <td>Prof. Rajesh Sharma</td>
                    <td>rajesh@example.edu</td>
                    <td>IIT Delhi</td>
                    <td>Applied Biotechnology</td>
                    <td>Custom Value 2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="bm-card">
              <label style="font-size: 12.5px; font-weight: 600; color: #1d1d1f; display: block; margin-bottom: 6px;">Manual Input (Name, Email per line):</label>
              <textarea class="bm-textarea" id="bm-manual-input" rows="2" placeholder="Prof. (Dr.) Anju Rani, anju@example.edu&#10;Prof. Rajesh Sharma, rajesh@example.edu"></textarea>
              <div style="text-align: right; margin-top: 8px;">
                <button class="bm-btn bm-btn-secondary" id="bm-btn-parse-manual" style="padding: 5px 12px; font-size: 12px;">Parse Contacts</button>
              </div>
            </div>

            <!-- Recipient Directory Table with Smooth Internal & External Scroll -->
            <div class="bm-card" style="padding: 0; overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e5e5ea;">
                <span style="font-size: 12.5px; font-weight: 600; color: #1d1d1f;">Recipient Directory (<span id="bm-recipients-subcount">0 loaded</span>)</span>
                <button class="bm-btn bm-btn-secondary" id="bm-btn-clear-recipients" style="padding: 3px 10px; font-size: 11px;">Clear All</button>
              </div>
              <div class="bm-table-container">
                <table class="bm-table">
                  <thead>
                    <tr>
                      <th style="width: 44px;">#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Attributes &amp; Columns</th>
                    </tr>
                  </thead>
                  <tbody id="bm-recipients-tbody">
                    <tr><td colspan="4" style="text-align:center; color:#86868b; padding: 28px;">No recipients loaded yet. Upload a CSV or paste contacts above.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 2. TEMPLATE STUDIO VIEW (Large Code Editor) -->
          <div class="bm-tab-panel" id="bm-tab-template">
            <div class="bm-card" style="padding: 12px 18px;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <label style="font-size: 12.5px; font-weight: 600; color: #1d1d1f;">Preset:</label>
                  <select id="bm-template-select" class="bm-select" style="width: 320px; padding: 5px 10px;">
                    <!-- Populated dynamically -->
                  </select>
                </div>
                <div style="display: flex; gap: 8px;">
                  <input type="file" id="bm-upload-template-file" accept=".html,.htm" style="display:none;" />
                  <button class="bm-btn bm-btn-secondary" id="bm-btn-upload-template" style="padding: 5px 12px; font-size: 12px;">
                    ${ICONS.file} <span>Upload .HTML File</span>
                  </button>
                  <button class="bm-btn bm-btn-secondary" id="bm-btn-save-preset" style="padding: 5px 12px; font-size: 12px;">
                    ${ICONS.plus} <span>Save As New Preset</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="bm-card">
              <label style="font-size: 12.5px; font-weight: 600; color: #1d1d1f; display: block; margin-bottom: 6px;">Subject Line:</label>
              <input type="text" class="bm-input" id="bm-template-subject" value="${activeTemplate.subject}" />
            </div>

            <!-- Dynamic Placeholder Engine -->
            <div class="bm-card">
              <div class="bm-placeholder-header" style="margin-bottom: 8px;">
                <label style="font-size: 12.5px; font-weight: 600; color: #1d1d1f;">Dynamic Placeholders (Click to Insert at Cursor):</label>
                <span style="font-size: 11.5px; color: #86868b;">Auto-detected from CSV headers</span>
              </div>
              <div class="bm-chip-bar" id="bm-tag-chips">
                <!-- Dynamically populated chips -->
              </div>
            </div>

            <!-- Spacious, Expandable HTML Code Editor -->
            <div class="bm-card" style="display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                  <label style="font-size: 12.5px; font-weight: 600; color: #1d1d1f;">Email HTML Body:</label>
                  <span style="font-size: 11.5px; color: #86868b; margin-left: 6px;">Full HTML &amp; inline CSS supported</span>
                </div>
                <button class="bm-btn bm-btn-secondary" id="bm-btn-auto-inline" style="padding: 4px 12px; font-size: 11.5px; color: #0071e3; border-color: #d1d1d6;">
                  ${ICONS.sparkle} <span>Auto-Inline CSS</span>
                </button>
              </div>
              <textarea class="bm-textarea" id="bm-template-body"></textarea>
            </div>
          </div>

          <!-- 3. LIVE PREVIEW VIEW -->
          <div class="bm-tab-panel" id="bm-tab-preview">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 10px 16px; border-radius: 10px; border: 1px solid #e5e5ea;">
              <button class="bm-btn bm-btn-secondary" id="bm-prev-preview" style="padding: 5px 14px;">Previous</button>
              <span style="font-size: 13px; font-weight: 600; color: #1d1d1f;" id="bm-preview-status">Showing Recipient 0 of 0</span>
              <button class="bm-btn bm-btn-secondary" id="bm-next-preview" style="padding: 5px 14px;">Next</button>
            </div>

            <div style="font-size: 13px; padding: 10px 16px; background: #ffffff; border: 1px solid #e5e5ea; border-radius: 10px; line-height: 1.6;">
              <div style="margin-bottom: 2px;"><strong>Subject:</strong> <span id="bm-rendered-subject" style="color: #0071e3;">--</span></div>
              <div><strong>To:</strong> <span id="bm-rendered-to" style="color: #86868b;">--</span></div>
            </div>

            <div class="bm-preview-box" id="bm-rendered-html-container">
              <div style="color: #86868b; text-align: center; padding-top: 48px;">Load recipients to preview personalized render.</div>
            </div>
          </div>

          <!-- 4. DISPATCH CONSOLE VIEW -->
          <div class="bm-tab-panel" id="bm-tab-dispatch">
            <div class="bm-card">
              <div style="font-size: 13.5px; font-weight: 600; color: #1d1d1f; margin-bottom: 12px;">Delivery Parameters</div>
              
              <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
                <div>
                  <label style="font-size: 12px; color: #86868b; font-weight: 500; display: block; margin-bottom: 4px;">Sending Mode:</label>
                  <select id="bm-dispatch-mode" class="bm-select" style="width: auto; padding: 6px 12px;">
                    <option value="send">Auto-Send Immediately</option>
                    <option value="draft">Save to Drafts Only (Review in Gmail)</option>
                  </select>
                </div>

                <div>
                  <label style="font-size: 12px; color: #86868b; font-weight: 500; display: block; margin-bottom: 4px;">Anti-Spam Safety Throttle:</label>
                  <select id="bm-delay-select" class="bm-select" style="width: auto; padding: 6px 12px;">
                    <option value="3000">3 Seconds</option>
                    <option value="4000" selected>4 Seconds (Recommended)</option>
                    <option value="6000">6 Seconds (Safer)</option>
                    <option value="10000">10 Seconds (Ultra-Safe)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Attachment Configuration Card with Apple HIG Toggle Switch -->
            <div class="bm-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #1d1d1f;">Include File Attachment</div>
                  <div style="font-size: 12px; color: #86868b;">Enable to attach PDF/Brochure &amp; automatically include attachment notice</div>
                </div>
                <label class="bm-toggle-switch" title="Toggle file attachment">
                  <input type="checkbox" id="bm-toggle-attachment">
                  <span class="bm-toggle-slider"></span>
                </label>
              </div>
              <div id="bm-attachment-controls" class="bm-disabled-zone" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #e5e5ea;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12.5px; color: #1d1d1f; font-weight: 500;">Select Document (PDF, DOCX):</span>
                  <input type="file" id="bm-attachment-input" style="display: none;" />
                  <button class="bm-btn bm-btn-secondary" id="bm-btn-choose-attachment" style="padding: 5px 12px; font-size: 12px;">
                    ${ICONS.paperclip} <span>Choose File</span>
                  </button>
                </div>
                <div id="bm-attachment-status" style="margin-top: 10px; display: none;">
                  <div style="display: inline-flex; align-items: center; gap: 8px; background: #f2f2f7; padding: 6px 12px; border-radius: 8px; font-size: 12.5px; border: 1px solid #e5e5ea;">
                    ${ICONS.file}
                    <span id="bm-attachment-name" style="font-weight: 500; color: #1d1d1f;"></span>
                    <span id="bm-attachment-size" style="color: #86868b; font-size: 11.5px;"></span>
                    <button id="bm-btn-remove-attachment" style="background: none; border: none; cursor: pointer; color: #86868b; font-size: 16px; padding: 0 4px; line-height: 1;" title="Remove attachment">&times;</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Send Test Box -->
            <div class="bm-card" style="display: flex; align-items: center; justify-content: space-between; background-color: #f7faff; border-color: #c7ddfc;">
              <div>
                <div style="font-weight: 600; color: #0071e3; font-size: 13.5px;">Send Verification Test</div>
                <div style="font-size: 12px; color: #4b6b94;">Send a single message to your own address to inspect layout before the batch.</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <input type="email" id="bm-test-email" placeholder="your-email@gmail.com" class="bm-input" style="width: 220px;" />
                <button class="bm-btn bm-btn-secondary" id="bm-btn-send-test">Send Test</button>
              </div>
            </div>

            <!-- Execution Status & Controls -->
            <div class="bm-card" style="flex: 1; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; font-weight: 600; color: #1d1d1f;">Batch Progress</span>
                <span id="bm-progress-label" style="font-size: 13px; font-weight: 600; color: #0071e3;">0 / 0</span>
              </div>
              
              <div class="bm-progress-bar-bg">
                <div class="bm-progress-bar-fill" id="bm-progress-bar"></div>
              </div>

              <div style="display: flex; gap: 10px; margin: 12px 0;">
                <button class="bm-btn bm-btn-primary" id="bm-btn-start-batch">${ICONS.play} <span>Start Mail Merge</span></button>
                <button class="bm-btn bm-btn-secondary" id="bm-btn-pause-batch" style="display: none;">${ICONS.pause} <span>Pause</span></button>
                <button class="bm-btn bm-btn-danger" id="bm-btn-abort-batch" style="display: none;">${ICONS.stop} <span>Cancel</span></button>
                <button class="bm-btn bm-btn-secondary" id="bm-btn-export-log" style="margin-left: auto;">${ICONS.download} <span>Export CSV Log</span></button>
              </div>

              <!-- Live Audit Log Table -->
              <div class="bm-table-container" style="flex: 1; max-height: 180px;">
                <table class="bm-table">
                  <thead>
                    <tr>
                      <th style="width: 70px;">Time</th>
                      <th style="width: 80px;">Status</th>
                      <th>Recipient</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody id="bm-log-tbody">
                    <tr><td colspan="4" style="text-align: center; color: #86868b; padding: 20px;">Execution logs will appear here during batch dispatch.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Apple Window Footer -->
        <div class="bm-footer">
          <span style="font-size: 12px; color: #86868b;">Emailer Pro Suite &bull; by Badal</span>
          <div style="display: flex; gap: 8px;">
            <button class="bm-btn bm-btn-secondary" id="bm-footer-close">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    renderPresetOptions();
    bindEvents();
    loadActiveTemplate();
    renderDynamicPlaceholders();
  }

  function openModal() {
    const overlay = document.getElementById('badal-mailer-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  function closeModal() {
    const overlay = document.getElementById('badal-mailer-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function renderPresetOptions() {
    const select = document.getElementById('bm-template-select');
    if (!select) return;

    let html = BadalTemplates.map(t => `
      <option value="${t.id}" ${t.id === activeTemplate.id ? 'selected' : ''}>${escapeHtml(t.name)}</option>
    `).join('');

    if (customPresets.length > 0) {
      html += `<optgroup label="Custom Presets">`;
      customPresets.forEach(cp => {
        html += `<option value="custom_${cp.id}" ${activeTemplate.id === 'custom_' + cp.id ? 'selected' : ''}>${escapeHtml(cp.name)}</option>`;
      });
      html += `</optgroup>`;
    }

    html += `<option value="custom">Custom Template (Empty)</option>`;
    select.innerHTML = html;
  }

  function loadActiveTemplate() {
    document.getElementById('bm-template-subject').value = activeTemplate.subject;
    document.getElementById('bm-template-body').value = activeTemplate.body;
  }

  /**
   * Dynamic Placeholder Engine
   * Auto-discovers every column in the dataset + custom created tags
   */
  function renderDynamicPlaceholders() {
    const chipContainer = document.getElementById('bm-tag-chips');
    if (!chipContainer) return;

    const discovered = new Set(customPlaceholders);
    if (recipients.length > 0) {
      recipients.forEach(r => {
        Object.keys(r).forEach(k => {
          if (k && k.trim()) discovered.add(k.trim());
        });
      });
    }

    const tagList = Array.from(discovered);
    chipContainer.innerHTML = tagList.map(tag => `
      <span class="bm-chip" data-tag="{{${tag}}}">${ICONS.plus} {{${tag}}}</span>
    `).join('') + `
      <input type="text" class="bm-chip-custom-input" id="bm-custom-tag-input" placeholder="+ Custom Tag" title="Type variable name and press Enter" />
    `;

    chipContainer.querySelectorAll('.bm-chip').forEach(chip => {
      chip.onclick = () => {
        const tag = chip.dataset.tag;
        insertTagAtCursor(tag);
      };
    });

    const customInput = document.getElementById('bm-custom-tag-input');
    if (customInput) {
      customInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = customInput.value.trim().replace(/[{}]/g, '');
          if (val) {
            customPlaceholders.push(val);
            renderDynamicPlaceholders();
            insertTagAtCursor(`{{${val}}}`);
          }
        }
      };
    }
  }

  function insertTagAtCursor(tag) {
    const textarea = document.getElementById('bm-template-body');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + tag + textarea.value.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + tag.length;
  }

  function bindEvents() {
    document.getElementById('bm-close-modal').onclick = closeModal;
    document.getElementById('bm-footer-close').onclick = closeModal;

    // Segmented Tab Control
    const tabs = document.querySelectorAll('.bm-tab-btn');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.bm-tab-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const target = document.getElementById(`bm-tab-${tab.dataset.tab}`);
        if (target) target.classList.add('active');

        if (tab.dataset.tab === 'preview') {
          updateLivePreview();
        }
      };
    });

    // Dropzone
    const dropzone = document.getElementById('bm-dropzone');
    const fileInput = document.getElementById('bm-csv-input');
    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const parsed = BadalCSV.parse(evt.target.result);
          handleParsedRecipients(parsed);
        };
        reader.readAsText(file);
      }
    };

    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('dragover'); };
    dropzone.ondragleave = () => dropzone.classList.remove('dragover');
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          const parsed = BadalCSV.parse(evt.target.result);
          handleParsedRecipients(parsed);
        };
        reader.readAsText(file);
      }
    };

    // Download Skeleton CSV
    document.getElementById('bm-btn-download-skeleton').onclick = () => {
      const skeletonData = `Name,Email,Institution,Research_Areas,Custom_Field
"Prof. (Dr.) Anju Rani","anju.rani@example.edu","Graphic Era University","Environmental Microbiology","Sample Value 1"
"Prof. Rajesh Sharma","rajesh@example.edu","IIT Delhi","Applied Biotechnology","Sample Value 2"`;
      const blob = new Blob([skeletonData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'emailer_pro_skeleton.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Manual Input Parsing
    document.getElementById('bm-btn-parse-manual').onclick = () => {
      const text = document.getElementById('bm-manual-input').value;
      const parsed = BadalCSV.parseManual(text);
      if (parsed.length > 0) {
        handleParsedRecipients([...recipients, ...parsed]);
        document.getElementById('bm-manual-input').value = '';
      }
    };

    // Clear Directory
    document.getElementById('bm-btn-clear-recipients').onclick = () => {
      recipients = [];
      renderRecipientsTable();
      renderDynamicPlaceholders();
    };

    // Template Selector
    document.getElementById('bm-template-select').onchange = (e) => {
      const val = e.target.value;
      if (val.startsWith('custom_')) {
        const cId = val.replace('custom_', '');
        const found = customPresets.find(p => p.id === cId);
        if (found) {
          activeTemplate = found;
          loadActiveTemplate();
          updateLivePreview();
        }
      } else {
        const selected = BadalTemplates.find(t => t.id === val);
        if (selected) {
          activeTemplate = selected;
          loadActiveTemplate();
          updateLivePreview();
        }
      }
    };

    // Upload .HTML Template File
    const uploadHtmlInput = document.getElementById('bm-upload-template-file');
    document.getElementById('bm-btn-upload-template').onclick = () => uploadHtmlInput.click();

    uploadHtmlInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const rawHtml = evt.target.result;
          const inlined = BadalTemplateEngine.inlineStyles(rawHtml);
          document.getElementById('bm-template-body').value = inlined;
          updateLivePreview();
          alert(`Successfully loaded template: "${file.name}"!`);
        };
        reader.readAsText(file);
      }
    };

    // Save As New Preset
    document.getElementById('bm-btn-save-preset').onclick = () => {
      const name = prompt('Enter a name for this template preset:', 'My Custom Template');
      if (!name || !name.trim()) return;

      const sub = document.getElementById('bm-template-subject').value;
      const body = document.getElementById('bm-template-body').value;
      const newPreset = {
        id: 'preset_' + Date.now(),
        name: name.trim(),
        subject: sub,
        body: body
      };

      customPresets.push(newPreset);
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ badal_custom_presets: customPresets });
        }
      } catch (e) {}

      renderPresetOptions();
      document.getElementById('bm-template-select').value = 'custom_' + newPreset.id;
      alert(`Preset "${name.trim()}" saved successfully!`);
    };

    // Auto-Inline CSS Button
    document.getElementById('bm-btn-auto-inline').onclick = () => {
      const textarea = document.getElementById('bm-template-body');
      const inlined = BadalTemplateEngine.inlineStyles(textarea.value);
      textarea.value = inlined;
      const btn = document.getElementById('bm-btn-auto-inline');
      const origText = btn.innerHTML;
      btn.innerHTML = `${ICONS.check} <span>All CSS Inlined</span>`;
      btn.style.color = '#34c759';
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.color = '#0071e3';
      }, 2000);
      updateLivePreview();
    };

    // Attachment Toggle Switch & File Selection
    const toggleAttach = document.getElementById('bm-toggle-attachment');
    const attachControls = document.getElementById('bm-attachment-controls');
    const attachInput = document.getElementById('bm-attachment-input');

    if (toggleAttach) {
      toggleAttach.onchange = () => {
        isAttachmentEnabled = toggleAttach.checked;
        if (isAttachmentEnabled) {
          attachControls.classList.remove('bm-disabled-zone');
        } else {
          attachControls.classList.add('bm-disabled-zone');
        }
        updateLivePreview();
      };
    }

    document.getElementById('bm-btn-choose-attachment').onclick = () => {
      if (isAttachmentEnabled) attachInput.click();
    };

    attachInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        currentAttachment = file;
        const sizeFormatted = file.size > 1024 * 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : (file.size / 1024).toFixed(1) + ' KB';
        document.getElementById('bm-attachment-name').textContent = file.name;
        document.getElementById('bm-attachment-size').textContent = `(${sizeFormatted})`;
        document.getElementById('bm-attachment-status').style.display = 'block';
        updateLivePreview();
      }
    };

    document.getElementById('bm-btn-remove-attachment').onclick = () => {
      currentAttachment = null;
      attachInput.value = '';
      document.getElementById('bm-attachment-status').style.display = 'none';
      updateLivePreview();
    };

    // Live Preview Stepper
    document.getElementById('bm-prev-preview').onclick = () => {
      if (currentPreviewIndex > 0) {
        currentPreviewIndex--;
        updateLivePreview();
      }
    };
    document.getElementById('bm-next-preview').onclick = () => {
      if (currentPreviewIndex < recipients.length - 1) {
        currentPreviewIndex++;
        updateLivePreview();
      }
    };

    // Send Test Email
    document.getElementById('bm-btn-send-test').onclick = async () => {
      const testEmail = document.getElementById('bm-test-email').value.trim();
      if (!testEmail || !testEmail.includes('@')) {
        alert('Please enter a valid test email address.');
        return;
      }

      const sampleRecipient = recipients[0] || { Name: 'Test Professor', Email: testEmail, Institution: 'Sample University' };
      const sub = document.getElementById('bm-template-subject').value;
      const body = document.getElementById('bm-template-body').value;

      const testData = {
        ...sampleRecipient,
        Email: testEmail,
        HasAttachment: (isAttachmentEnabled && currentAttachment) ? 'true' : ''
      };
      const renderedSub = BadalTemplateEngine.render(sub, testData);
      const renderedBody = BadalTemplateEngine.render(body, testData);

      const btn = document.getElementById('bm-btn-send-test');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const fileToSend = isAttachmentEnabled ? currentAttachment : null;
      try {
        await controller.dispatchSingleEmail(testEmail, `[TEST] ${renderedSub}`, renderedBody, 'send', fileToSend);
        alert(`Verification email sent successfully to ${testEmail}! Check your inbox.`);
      } catch (err) {
        alert('Error sending test email: ' + err.message);
      } finally {
        btn.textContent = 'Send Test';
        btn.disabled = false;
      }
    };

    // Dispatch Batch Actions
    const startBtn = document.getElementById('bm-btn-start-batch');
    const pauseBtn = document.getElementById('bm-btn-pause-batch');
    const abortBtn = document.getElementById('bm-btn-abort-batch');

    startBtn.onclick = () => {
      if (recipients.length === 0) {
        alert('Please load recipients first!');
        return;
      }

      const sub = document.getElementById('bm-template-subject').value;
      const body = document.getElementById('bm-template-body').value;
      const delay = parseInt(document.getElementById('bm-delay-select').value, 10);
      const mode = document.getElementById('bm-dispatch-mode').value;

      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-flex';
      abortBtn.style.display = 'inline-flex';
      document.getElementById('bm-log-tbody').innerHTML = '';

      const fileToSend = isAttachmentEnabled ? currentAttachment : null;
      controller.startBatch(recipients, sub, body, {
        delayMs: delay,
        mode,
        attachmentFile: fileToSend,
        onProgress: (current, total, item, status) => {
          document.getElementById('bm-progress-label').textContent = `${current} / ${total}`;
          const pct = Math.round((current / total) * 100);
          document.getElementById('bm-progress-bar').style.width = `${pct}%`;
        },
        onLog: (entry) => {
          appendLogEntry(entry);
        },
        onComplete: (logs) => {
          startBtn.style.display = 'inline-flex';
          pauseBtn.style.display = 'none';
          abortBtn.style.display = 'none';
          alert(`Batch completed! Processed ${logs.length} recipients.`);
        }
      });
    };

    pauseBtn.onclick = () => {
      if (controller.isPaused) {
        controller.resume();
        pauseBtn.innerHTML = `${ICONS.pause} <span>Pause</span>`;
      } else {
        controller.pause();
        pauseBtn.innerHTML = `${ICONS.play} <span>Resume</span>`;
      }
    };

    abortBtn.onclick = () => {
      if (confirm('Are you sure you want to cancel the rest of the batch?')) {
        controller.stop();
      }
    };

    // Export Sent CSV Log
    document.getElementById('bm-btn-export-log').onclick = () => {
      if (controller.logs.length === 0) {
        alert('No sent logs to export yet.');
        return;
      }
      exportLogToCSV(controller.logs);
    };
  }

  function handleParsedRecipients(list) {
    if (!list || list.length === 0) return;
    
    const seen = new Set();
    const cleanList = [];

    list.forEach(row => {
      const email = (row.Email || row.email || row.mail || '').trim().toLowerCase();
      if (email && email.includes('@') && !seen.has(email)) {
        seen.add(email);
        cleanList.push(row);
      }
    });

    recipients = cleanList;
    currentPreviewIndex = 0;
    renderRecipientsTable();
    renderDynamicPlaceholders();
    updateLivePreview();
  }

  function renderRecipientsTable() {
    document.getElementById('bm-recipients-count').textContent = recipients.length;
    const subcount = document.getElementById('bm-recipients-subcount');
    if (subcount) subcount.textContent = `${recipients.length} loaded`;

    const tbody = document.getElementById('bm-recipients-tbody');
    if (!tbody) return;

    if (recipients.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#86868b; padding: 28px;">No recipients loaded yet. Upload a CSV or paste contacts above.</td></tr>`;
      return;
    }

    tbody.innerHTML = recipients.map((r, idx) => {
      const name = r.Name || r.name || '--';
      const email = r.Email || r.email || '--';
      const extraKeys = Object.keys(r).filter(k => !/^(name|email)$/i.test(k));
      const extras = extraKeys.map(k => `${k}: ${r[k]}`).join(', ') || '--';

      return `<tr>
        <td style="color: #86868b;">${idx + 1}</td>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>${escapeHtml(email)}</td>
        <td style="color: #86868b; font-size: 11.5px;">${escapeHtml(extras)}</td>
      </tr>`;
    }).join('');
  }

  function updateLivePreview() {
    const statusEl = document.getElementById('bm-preview-status');
    const toEl = document.getElementById('bm-rendered-to');
    const subEl = document.getElementById('bm-rendered-subject');
    const htmlBox = document.getElementById('bm-rendered-html-container');

    if (!statusEl || !htmlBox) return;

    if (recipients.length === 0) {
      statusEl.textContent = 'Showing Recipient 0 of 0';
      toEl.textContent = '--';
      subEl.textContent = '--';
      htmlBox.innerHTML = '<div style="color: #86868b; text-align: center; padding-top: 48px;">Load recipients to preview personalized render.</div>';
      return;
    }

    const currentItem = recipients[currentPreviewIndex];
    statusEl.textContent = `Showing Recipient ${currentPreviewIndex + 1} of ${recipients.length}`;
    
    const subjectTpl = document.getElementById('bm-template-subject').value;
    const bodyTpl = document.getElementById('bm-template-body').value;

    const itemData = {
      ...currentItem,
      HasAttachment: (isAttachmentEnabled && currentAttachment) ? 'true' : ''
    };
    const renderedSub = BadalTemplateEngine.render(subjectTpl, itemData, { Name: 'Professor / Researcher' });
    const renderedBody = BadalTemplateEngine.render(bodyTpl, itemData, { Name: 'Professor / Researcher' });

    toEl.textContent = `${currentItem.Name || 'Recipient'} <${currentItem.Email || ''}>`;
    subEl.textContent = renderedSub;
    htmlBox.innerHTML = renderedBody;
  }

  function appendLogEntry(entry) {
    const tbody = document.getElementById('bm-log-tbody');
    if (!tbody) return;
    const tr = document.createElement('tr');
    const statusColor = entry.status === 'Sent' || entry.status === 'Draft Created' ? '#34c759' : (entry.status === 'Skipped' ? '#eab308' : '#ff3b30');

    tr.innerHTML = `
      <td style="color: #86868b; font-size: 11.5px;">${entry.timestamp}</td>
      <td><span style="font-weight: 600; color: ${statusColor}; font-size: 11px;">${entry.status}</span></td>
      <td><strong>${escapeHtml(entry.name || '')}</strong> &lt;${escapeHtml(entry.email || '')}&gt;</td>
      <td style="font-size: 11.5px; color: #48484a;">${escapeHtml(entry.message)}</td>
    `;
    tbody.prepend(tr);
  }

  function exportLogToCSV(logs) {
    const headers = ['Index', 'Timestamp', 'Name', 'Email', 'Status', 'Message'];
    const rows = logs.map(l => [
      l.index,
      `"${l.timestamp}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Emailer_Pro_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
