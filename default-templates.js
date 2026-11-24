/**
 * Default Templates - Emailer Pro Suite (by Badal)
 * Features official NSTC Logo (https://architecture.celnet.in/wp-content/uploads/2023/03/NSTC-Logo-png.png)
 * Supports conditional {{#if HasAttachment}}...{{/if}} so text matches attachment state.
 * All styles are 100% INLINED directly on HTML elements for bulletproof Gmail compatibility.
 */
const BadalTemplates = [
  {
    id: "ios-luxury",
    name: "Apple HIG High-End Executive Invitation",
    subject: "Academic Mentorship Invitation | NanoSchool (NSTC) — Prof. {{Name}}",
    body: `<div style="margin: 0; padding: 24px 12px; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1d1d1f; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);">
    
    <!-- Header with Official Logo -->
    <div style="padding: 28px 32px 20px 32px; background: linear-gradient(180deg, #ffffff 0%, #fafafc 100%); border-bottom: 1px solid #f0f0f2;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <div style="display: inline-block; padding: 5px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #0071e3; background-color: #e5f1fc; border-radius: 980px; margin-bottom: 10px;">ACADEMIC MENTORSHIP NETWORK</div>
            <h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.025em; color: #1d1d1f; line-height: 1.25;">Nano Science and Technology Consortium</h1>
            <p style="margin: 0; font-size: 13px; font-weight: 500; color: #86868b;">NanoSchool Deep-Science Learning Initiative</p>
          </td>
          <td style="vertical-align: middle; text-align: right; width: 130px;">
            <img src="https://architecture.celnet.in/wp-content/uploads/2023/03/NSTC-Logo-png.png" alt="NSTC Logo" width="118" height="auto" style="width: 118px; height: auto; max-width: 120px; display: block; margin-left: auto; border: 0;" />
          </td>
        </tr>
      </table>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px 32px; font-size: 15px; line-height: 1.65; color: #1d1d1f;">
      <div style="font-size: 16px; font-weight: 600; color: #1d1d1f; margin-bottom: 16px;">Respected {{Name}},</div>

      <p style="margin: 0 0 16px 0;">Greetings from the <strong>Nano Science and Technology Consortium (NSTC)</strong>.</p>

      <p style="margin: 0 0 16px 0;">We came across your esteemed academic association{{#if Institution}} with <strong>{{Institution}}</strong>{{/if}}{{#if Research_Areas}} in <em>{{Research_Areas}}</em>{{/if}}. Given your domain leadership and research contributions, we are honored to invite you to associate with <strong>NanoSchool</strong> as an academic <strong>Mentor</strong>.</p>

      <!-- Bento-style Stats Grid -->
      <div style="background-color: #fbfbfd; border: 1px solid #e5e5ea; border-radius: 16px; padding: 18px 16px; margin: 24px 0;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0071e3; margin-bottom: 12px; text-align: center;">Impact at a Glance</div>
        <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 10px;">
          <tr>
            <td style="width: 33.33%; background-color: #ffffff; border: 1px solid #ebebf0; border-radius: 12px; padding: 12px 6px; text-align: center;">
              <div style="font-size: 18px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.02em;">30,000+</div>
              <div style="font-size: 11px; font-weight: 500; color: #86868b; margin-top: 2px;">Learners</div>
            </td>
            <td style="width: 33.33%; background-color: #ffffff; border: 1px solid #ebebf0; border-radius: 12px; padding: 12px 6px; text-align: center;">
              <div style="font-size: 18px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.02em;">95+</div>
              <div style="font-size: 11px; font-weight: 500; color: #86868b; margin-top: 2px;">Countries</div>
            </td>
            <td style="width: 33.33%; background-color: #ffffff; border: 1px solid #ebebf0; border-radius: 12px; padding: 12px 6px; text-align: center;">
              <div style="font-size: 18px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.02em;">900+</div>
              <div style="font-size: 11px; font-weight: 500; color: #86868b; margin-top: 2px;">Workshops</div>
            </td>
          </tr>
        </table>
        <div style="font-size: 12.5px; color: #48484a; line-height: 1.5; text-align: center;">
          Bridging academia, research labs, and deep-tech industry in AI, Nanotechnology, and Biotechnology since 2006.
        </div>
      </div>

      <!-- Engagement Details -->
      <div style="background-color: #f9f9fb; border: 1px solid #e5e5ea; border-radius: 14px; padding: 16px 20px; margin: 20px 0; font-size: 13.5px; line-height: 1.6;">
        <div style="font-weight: 600; color: #1d1d1f; margin-bottom: 6px;">Engagement Highlights:</div>
        <ul style="margin: 0; padding-left: 18px; color: #48484a;">
          <li style="margin-bottom: 4px;"><strong>Flexible Sessions:</strong> Self-paced and tailored around your academic schedule.</li>
          <li style="margin-bottom: 4px;"><strong>Hands-On Mentoring:</strong> Guiding researchers, faculty, and industry professionals.</li>
          <li><strong>Remuneration:</strong> Aligned with your domain seniority, expertise, and contribution nature.</li>
        </ul>
      </div>

      <!-- Conditional Attachment Notice (Only displayed if attachment is enabled) -->
      {{#if HasAttachment}}
      <div style="background-color: #f0f7ff; border: 1px solid #cce3fe; border-radius: 12px; padding: 14px 18px; margin: 22px 0; font-size: 13px; color: #1d1d1f;">
        <strong>Document Attached:</strong> The official <em>NSTC Mentor Invitation &amp; Program Scope</em> is attached with this email for your comprehensive review.
      </div>
      {{/if}}

      <!-- Pill Button CTA -->
      <div style="text-align: center; margin: 30px 0 20px 0;">
        <a href="https://products.nanoschool.in/careers/mentor-apply" target="_blank" style="display: inline-block; background-color: #0071e3; color: #ffffff !important; padding: 14px 34px; font-size: 14.5px; font-weight: 600; text-decoration: none; border-radius: 980px; letter-spacing: -0.01em; box-shadow: 0 4px 14px rgba(0, 113, 227, 0.32);">
          Apply as a Mentor &rsaquo;
        </a>
      </div>

      <p style="font-size: 13px; color: #86868b; text-align: center; margin: 12px 0 0 0;">
        Direct application link: <a href="https://products.nanoschool.in/careers/mentor-apply" style="color: #0071e3; text-decoration: none;">products.nanoschool.in/careers/mentor-apply</a>
      </p>

      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #f0f0f2;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1d1d1f;">Academic Relations &amp; Mentorship Cell</p>
        <p style="margin: 2px 0 0 0; font-size: 13px; color: #86868b;">Nano Science and Technology Consortium (NSTC)</p>
      </div>
    </div>

    <!-- Minimalist iOS Footer -->
    <div style="background-color: #fafafc; padding: 22px 32px; border-top: 1px solid #f0f0f2; font-size: 12px; color: #86868b; line-height: 1.5;">
      This communication was addressed to {{Email}} regarding your scholarly contributions. If you prefer not to receive further academic outreach, please reply to this email with "Opt-out".
    </div>
  </div>
</div>`
  },
  {
    id: "nstc-mentor-invite",
    name: "NSTC NanoSchool Mentor Invitation (Executive)",
    subject: "Academic Mentorship Invitation | NanoSchool (NSTC) - Prof. {{Name}}",
    body: `<div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <!-- Header with Official Logo -->
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 30px; border-bottom: 4px solid #0284c7;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: middle;">
          <h1 style="margin: 0; color: #ffffff; font-size: 18.5px; font-weight: 700; letter-spacing: 0.3px;">Nano Science and Technology Consortium (NSTC)</h1>
          <p style="margin: 4px 0 0; color: #38bdf8; font-size: 12.5px; font-weight: 500;">NanoSchool Academic Mentorship Network</p>
        </td>
        <td style="vertical-align: middle; text-align: right; width: 120px;">
          <div style="background: #ffffff; padding: 6px 10px; border-radius: 8px; display: inline-block;">
            <img src="https://architecture.celnet.in/wp-content/uploads/2023/03/NSTC-Logo-png.png" alt="NSTC Logo" width="100" height="auto" style="width: 100px; height: auto; display: block; border: 0;" />
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div style="padding: 28px 30px; font-size: 14.5px;">
    <div style="font-size: 15.5px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">Respected {{Name}},</div>
    
    <p>Greetings from the <strong>Nano Science and Technology Consortium (NSTC)</strong>.</p>
    
    <p>We came across your esteemed academic and research association{{#if Institution}} with <strong>{{Institution}}</strong>{{/if}}{{#if Research_Areas}} in <em>{{Research_Areas}}</em>{{/if}}. Your distinguished domain experience encouraged us to reach out and explore whether you would be interested in associating with <strong>NanoSchool</strong> as an academic <strong>Mentor</strong>.</p>
    
    <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px 20px; margin: 22px 0; border-radius: 0 6px 6px 0;">
      <div style="font-weight: 700; color: #0369a1; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">About NanoSchool (Initiative of NSTC)</div>
      <div style="font-size: 13.5px; color: #334155;">
        NanoSchool is a deep-science learning platform bridging academia, research, and industry through practical, research-oriented programs. Since 2006, we have engaged <strong>30,000+ learners across 95+ countries</strong> and delivered <strong>900+ workshops</strong> across Artificial Intelligence, Nanotechnology, Biotechnology, and emerging interdisciplinary domains.
      </div>
    </div>
    
    <p><strong>Engagement Structure:</strong><br>
    This is a flexible freelance mentoring engagement. Session structure, hands-on components, and honorarium/remuneration are determined by your expertise, experience, and nature of contribution, and remain fully flexible around your academic calendar.</p>

    <!-- Conditional Attached Document Notice -->
    {{#if HasAttachment}}
    <div style="font-size: 13px; color: #0369a1; background-color: #f0f9ff; padding: 12px 16px; border-radius: 6px; margin: 20px 0; border: 1px dashed #7dd3fc;">
      <strong>Attached Document:</strong> The complete <em>Mentor Invitation &amp; Scope Document</em> is attached for your review.
    </div>
    {{/if}}

    <div style="text-align: center; margin: 26px 0;">
      <a href="https://products.nanoschool.in/careers/mentor-apply" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 13px 30px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25);">
        Register as a Mentor &rarr;
      </a>
    </div>

    <p style="margin-top: 24px;">
      Warm regards,<br>
      <strong>Academic Relations &amp; Mentorship Cell</strong><br>
      Nano Science and Technology Consortium (NSTC)<br>
      <a href="https://products.nanoschool.in" style="color: #0284c7; text-decoration: none;">products.nanoschool.in</a>
    </p>
  </div>
  
  <div style="background-color: #f8fafc; padding: 20px 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
    This invitation was generated for {{Email}}. If you prefer not to receive future academic invitations from NSTC, please reply to this email with "Unsubscribe".
  </div>
</div>`
  },
  {
    id: "clean-personal",
    name: "Clean & Simple Professional Outreach",
    subject: "Exploring collaboration with {{Name}}",
    body: `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #222222;">
  <div style="margin-bottom: 16px;">
    <img src="https://architecture.celnet.in/wp-content/uploads/2023/03/NSTC-Logo-png.png" alt="NSTC Logo" width="90" height="auto" style="width: 90px; height: auto; display: block; border: 0;" />
  </div>
  <p>Dear {{Name}},</p>
  <p>I hope this email finds you well.</p>
  <p>I am reaching out regarding potential collaboration and would love to connect with you regarding your work{{#if Institution}} at {{Institution}}{{/if}}.</p>
  {{#if HasAttachment}}
  <p>The detailed collaboration overview is attached with this email.</p>
  {{/if}}
  <p>Would you be open to a brief conversation this week?</p>
  <p>Best regards,<br>
  <strong>Academic Relations Team</strong></p>
</div>`
  }
];
