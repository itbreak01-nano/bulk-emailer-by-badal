/**
 * Gmail DOM Controller - Emailer Pro Suite (by Badal)
 * Coordinates composing, rich HTML injection, file attachments, and throttling.
 */
class GmailController {
  constructor() {
    this.isProcessing = false;
    this.isPaused = false;
    this.shouldAbort = false;
    this.currentIndex = 0;
    this.queue = [];
    this.logs = [];
    this.options = {
      delayMs: 4000,
      mode: 'send', // 'send' | 'draft'
      attachmentFile: null,
      onProgress: () => {},
      onComplete: () => {},
      onLog: () => {}
    };
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Abort active batch
   */
  stop() {
    this.shouldAbort = true;
    this.isProcessing = false;
  }

  /**
   * Pause active batch
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume active batch
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * Start executing mail merge
   */
  async startBatch(items, templateSubject, templateBody, options = {}) {
    this.queue = items;
    this.currentIndex = 0;
    this.isProcessing = true;
    this.isPaused = false;
    this.shouldAbort = false;
    this.logs = [];
    this.options = { ...this.options, ...options };

    for (let i = 0; i < this.queue.length; i++) {
      if (this.shouldAbort) {
        this.addLog(i + 1, 'Cancelled', 'Operation aborted by user');
        break;
      }

      while (this.isPaused) {
        await this.sleep(500);
        if (this.shouldAbort) break;
      }
      if (this.shouldAbort) break;

      this.currentIndex = i;
      const item = this.queue[i];
      const email = item.Email || item.email || '';
      const name = item.Name || item.name || email;

      if (!email || !email.includes('@')) {
        this.addLog(i + 1, 'Skipped', `Invalid email address: "${email}"`, item);
        this.options.onProgress(i + 1, this.queue.length, item, 'skipped');
        continue;
      }

      const itemData = {
        ...item,
        HasAttachment: this.options.attachmentFile ? 'true' : ''
      };
      const renderedSubject = BadalTemplateEngine.render(templateSubject, itemData, { Name: 'Professor / Researcher' });
      const renderedBody = BadalTemplateEngine.render(templateBody, itemData, { Name: 'Professor / Researcher' });

      try {
        this.options.onProgress(i + 1, this.queue.length, item, 'processing');
        const success = await this.dispatchSingleEmail(
          email, 
          renderedSubject, 
          renderedBody, 
          this.options.mode,
          this.options.attachmentFile
        );

        if (success) {
          const statusText = this.options.mode === 'draft' ? 'Draft Created' : 'Sent';
          const attachNote = this.options.attachmentFile ? ' (+ Attachment)' : '';
          this.addLog(i + 1, statusText, `Success for ${name} <${email}>${attachNote}`, item);
          this.options.onProgress(i + 1, this.queue.length, item, 'success');
        } else {
          this.addLog(i + 1, 'Failed', `Could not trigger send for ${email}`, item);
          this.options.onProgress(i + 1, this.queue.length, item, 'failed');
        }
      } catch (err) {
        console.error('[Emailer Pro Suite] Error processing row:', err);
        this.addLog(i + 1, 'Error', err.message, item);
        this.options.onProgress(i + 1, this.queue.length, item, 'error');
      }

      // Respect throttle delay before next email
      if (i < this.queue.length - 1 && !this.shouldAbort) {
        const delay = this.options.delayMs || 4000;
        await this.sleep(delay);
      }
    }

    this.isProcessing = false;
    this.options.onComplete(this.logs);
  }

  /**
   * Helper to add an entry to the execution audit log
   */
  addLog(index, status, message, data = {}) {
    const entry = {
      index,
      timestamp: new Date().toLocaleTimeString(),
      name: data.Name || data.name || '',
      email: data.Email || data.email || '',
      status,
      message
    };
    this.logs.push(entry);
    this.options.onLog(entry);
  }

  /**
   * Open Gmail Compose window and populate fields
   */
  async dispatchSingleEmail(toEmail, subject, htmlBody, mode = 'send', attachmentFile = null) {
    // 1. Click Compose button
    const composeBtn = this.findComposeButton();
    if (composeBtn) {
      composeBtn.click();
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', keyCode: 67, bubbles: true }));
    }

    // 2. Wait for active compose window
    const composeWindow = await this.waitForComposeWindow();
    if (!composeWindow) {
      throw new Error("Could not find open Gmail compose window.");
    }

    // 3. Ensure Gmail is in Rich Text mode
    await this.ensureRichTextMode(composeWindow);

    // 4. Fill 'To' field
    await this.setToField(composeWindow, toEmail);
    await this.sleep(250);

    // 5. Fill 'Subject' field
    await this.setSubjectField(composeWindow, subject);
    await this.sleep(250);

    // 6. Fill HTML Body with inline styling
    await this.setBodyField(composeWindow, htmlBody);
    await this.sleep(350);

    // 7. Attach File if specified
    if (attachmentFile) {
      await this.attachFileToCompose(composeWindow, attachmentFile);
      await this.sleep(1200);
    }

    // 8. Action: Send or Save Draft
    if (mode === 'draft') {
      const closeBtn = composeWindow.querySelector('img[aria-label="Save & close"], img[aria-label="Save and close"], div[aria-label="Save & close"], div[aria-label="Save and close"], img[alt="Close"]');
      if (closeBtn) {
        closeBtn.click();
      }
      await this.sleep(500);
      return true;
    } else {
      const sent = await this.clickSendButton(composeWindow);
      await this.sleep(800);
      return sent;
    }
  }

  /**
   * Attach file directly to Gmail compose window
   */
  async attachFileToCompose(composeWin, file) {
    if (!file) return;

    try {
      const fileInput = composeWin.querySelector('input[type="file"][name="Filedata"]') ||
                        composeWin.querySelector('input[type="file"]') ||
                        document.querySelector('input[type="file"][name="Filedata"]');

      if (fileInput) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
        await this.sleep(1500);
      } else {
        console.warn('[Emailer Pro Suite] Attachment input element not found.');
      }
    } catch (err) {
      console.warn('[Emailer Pro Suite] Error attaching file to Gmail:', err);
    }
  }

  /**
   * Ensure Gmail compose is in Rich Text mode (disable Plain Text mode if active)
   */
  async ensureRichTextMode(composeWin) {
    try {
      const bodyBox = composeWin.querySelector('div[aria-label="Message Body"]') ||
                      composeWin.querySelector('div[role="textbox"]');

      if (!bodyBox) return;

      const computedFont = window.getComputedStyle ? window.getComputedStyle(bodyBox).fontFamily : '';
      const isPlainText = bodyBox.classList.contains('nr') || computedFont.includes('monospace');

      if (isPlainText) {
        console.log('[Emailer Pro Suite] Plain Text Mode detected. Switching to Rich Text mode...');
        const moreBtn = composeWin.querySelector('div[aria-label="More options"]') ||
                        composeWin.querySelector('div[data-tooltip="More options"]');
        if (moreBtn) {
          moreBtn.click();
          await this.sleep(250);

          const menuItems = document.querySelectorAll('div[role="menuitemcheckbox"], div[role="menuitem"]');
          for (const item of menuItems) {
            if (item.textContent.toLowerCase().includes('plain text')) {
              item.click();
              await this.sleep(250);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Emailer Pro Suite] Plain text check warning:', e);
    }
  }

  /**
   * Locate Gmail Compose button
   */
  findComposeButton() {
    return document.querySelector('div[gh="cm"]') ||
           document.querySelector('[role="button"][gh="cm"]') ||
           document.querySelector('div.T-I.T-I-KE[role="button"]') ||
           Array.from(document.querySelectorAll('div[role="button"]')).find(el => el.textContent.trim().toLowerCase() === 'compose');
  }

  /**
   * Wait for compose box to appear
   */
  async waitForComposeWindow(timeout = 6000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const composeWins = document.querySelectorAll('div[role="dialog"]');
      for (const win of composeWins) {
        if (win.querySelector('input[name="subjectbox"]') || win.querySelector('div[aria-label="Message Body"]')) {
          return win;
        }
      }
      await this.sleep(200);
    }
    return null;
  }

  /**
   * Set To field
   */
  async setToField(composeWin, email) {
    const toInput = composeWin.querySelector('input[peoplekit-id]') ||
                    composeWin.querySelector('input[aria-label="To recipients"]') ||
                    composeWin.querySelector('textarea[name="to"]') ||
                    composeWin.querySelector('input[name="to"]') ||
                    composeWin.querySelector('.vO');

    if (toInput) {
      toInput.focus();
      toInput.value = email;
      toInput.dispatchEvent(new Event('input', { bubbles: true }));
      toInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      toInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
    }
  }

  /**
   * Set Subject field
   */
  async setSubjectField(composeWin, subject) {
    const subjectBox = composeWin.querySelector('input[name="subjectbox"]') ||
                       composeWin.querySelector('input[placeholder="Subject"]') ||
                       composeWin.querySelector('input[aria-label="Subject"]');

    if (subjectBox) {
      subjectBox.focus();
      subjectBox.value = subject;
      subjectBox.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  /**
   * Inject rich HTML into Message Body
   */
  async setBodyField(composeWin, html) {
    const bodyBox = composeWin.querySelector('div[aria-label="Message Body"]') ||
                    composeWin.querySelector('div[role="textbox"][g_editable="true"]') ||
                    composeWin.querySelector('div.Am.Al.editable');

    if (bodyBox) {
      bodyBox.focus();

      let cleanHtml = html;
      if (typeof BadalTemplateEngine !== 'undefined' && BadalTemplateEngine.inlineStyles) {
        cleanHtml = BadalTemplateEngine.inlineStyles(cleanHtml);
      }

      cleanHtml = cleanHtml
        .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
        .replace(/<\/?(html|head|body)[\s\S]*?>/gi, '')
        .trim();

      bodyBox.innerHTML = '';
      await this.sleep(60);

      let inserted = false;
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(bodyBox);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        inserted = document.execCommand('insertHTML', false, cleanHtml);
      } catch (e) {
        inserted = false;
      }

      if (!inserted || !bodyBox.innerHTML.trim() || bodyBox.innerText === cleanHtml) {
        bodyBox.innerHTML = cleanHtml;
      }

      bodyBox.dispatchEvent(new Event('input', { bubbles: true }));
      bodyBox.dispatchEvent(new Event('change', { bubbles: true }));
      bodyBox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      bodyBox.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    }
  }

  /**
   * Trigger Send Button
   */
  async clickSendButton(composeWin) {
    const sendBtn = composeWin.querySelector('div[role="button"][data-tooltip*="Send"]') ||
                    composeWin.querySelector('div[role="button"][aria-label*="Send"]') ||
                    composeWin.querySelector('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3') ||
                    Array.from(composeWin.querySelectorAll('div[role="button"]')).find(b => b.textContent.trim().toLowerCase().startsWith('send'));

    if (sendBtn) {
      sendBtn.click();
      return true;
    }
    return false;
  }
}
