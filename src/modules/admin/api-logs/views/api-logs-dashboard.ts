const escapeTemplateLiteral = (value: string) => value.replace(/`/g, '\\`');

export const renderApiLogsDashboard = () => {
  const html = String.raw`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Logs Dashboard</title>
    <style>
      :root {
        --bg: #f4efe6;
        --surface: rgba(255, 250, 242, 0.92);
        --surface-strong: #fffdf8;
        --border: rgba(84, 57, 32, 0.12);
        --text: #2d2419;
        --muted: #74614b;
        --accent: #2f7d4c;
        --accent-soft: rgba(47, 125, 76, 0.14);
        --blue: #2563eb;
        --orange: #c46a19;
        --red: #b42318;
        --shadow: 0 24px 60px rgba(69, 42, 17, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(255, 194, 125, 0.38), transparent 28%),
          radial-gradient(circle at top right, rgba(108, 194, 135, 0.18), transparent 24%),
          linear-gradient(180deg, #fbf6ee 0%, #efe5d6 100%);
        font-family: Georgia, 'Times New Roman', serif;
      }

      .shell {
        width: min(1280px, calc(100% - 32px));
        margin: 24px auto;
        padding: 24px;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--surface);
        backdrop-filter: blur(12px);
        box-shadow: var(--shadow);
      }

      .hero {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 24px;
      }

      .hero h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .hero p {
        margin: 10px 0 0;
        max-width: 760px;
        color: var(--muted);
        font-size: 1rem;
      }

      .status-card {
        min-width: 220px;
        padding: 18px;
        border-radius: 18px;
        background: linear-gradient(145deg, rgba(47, 125, 76, 0.14), rgba(255, 255, 255, 0.92));
        border: 1px solid rgba(47, 125, 76, 0.18);
      }

      .status-card .label {
        display: block;
        color: var(--muted);
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .status-card strong {
        display: block;
        margin-top: 8px;
        font-size: 1.6rem;
      }

      .toolbar {
        display: grid;
        grid-template-columns: minmax(220px, 2fr) repeat(3, minmax(120px, 1fr)) auto auto;
        gap: 12px;
        align-items: end;
        margin-bottom: 18px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .field label {
        color: var(--muted);
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .field input,
      .field select,
      .field button,
      .pager button {
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: var(--surface-strong);
        color: var(--text);
        font: inherit;
      }

      .field button,
      .pager button {
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
      }

      .field button:hover,
      .pager button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(69, 42, 17, 0.1);
        border-color: rgba(47, 125, 76, 0.35);
      }

      .field button.primary {
        background: linear-gradient(135deg, #2f7d4c, #3c9360);
        color: #fff;
        border-color: transparent;
      }

      .table-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        overflow: hidden;
        background: rgba(255, 253, 248, 0.82);
      }

      .table-scroll {
        max-height: 66vh;
        overflow: auto;
      }

      table {
        width: 100%;
        min-width: 920px;
        border-collapse: separate;
        border-spacing: 0;
      }

      thead th {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 16px;
        text-align: left;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        background: rgba(255, 248, 237, 0.96);
        border-bottom: 1px solid var(--border);
      }

      tbody td {
        padding: 14px 16px;
        border-bottom: 1px solid rgba(84, 57, 32, 0.08);
        vertical-align: top;
      }

      tbody tr:hover {
        background: rgba(255, 255, 255, 0.7);
      }

      tbody tr.slow {
        background: rgba(196, 106, 25, 0.09);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 68px;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #fff;
      }

      .method-get { background: #2f7d4c; }
      .method-post { background: #2563eb; }
      .method-put { background: #7c3aed; }
      .method-patch { background: #b45309; }
      .method-delete { background: #b42318; }
      .method-other { background: #475467; }

      .status-success { background: #2f7d4c; }
      .status-client { background: #c46a19; }
      .status-server { background: #b42318; }
      .status-other { background: #475467; }

      .url-cell {
        max-width: 420px;
        word-break: break-word;
      }

      .subtle {
        color: var(--muted);
      }

      .action-button {
        border: 1px solid rgba(47, 125, 76, 0.2);
        color: var(--accent);
        background: var(--accent-soft);
      }

      .footer-bar {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        padding: 16px 0 0;
      }

      .pager {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .pager button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
        transform: none;
        box-shadow: none;
      }

      .empty-state {
        padding: 48px 16px;
        text-align: center;
        color: var(--muted);
      }

      .modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(31, 22, 13, 0.42);
      }

      .modal.open {
        display: flex;
      }

      .modal-card {
        width: min(960px, 100%);
        max-height: min(82vh, 920px);
        overflow: auto;
        border-radius: 22px;
        padding: 24px;
        background: #fffdf8;
        box-shadow: var(--shadow);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
      }

      .modal-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-top: 18px;
      }

      .json-card {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: #fff;
      }

      .json-card h3 {
        margin: 0 0 12px;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
      }

      @media (max-width: 980px) {
        .shell {
          width: min(100% - 20px, 100%);
          padding: 18px;
          border-radius: 18px;
        }

        .hero,
        .footer-bar,
        .modal-grid {
          grid-template-columns: 1fr;
          display: grid;
        }

        .toolbar {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 720px) {
        .toolbar {
          grid-template-columns: 1fr;
        }

        .status-card {
          min-width: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div>
          <h1>API Request Ledger</h1>
          <p>Monitor every request, inspect sanitized headers and bodies, and spot slow or failing endpoints without leaving the browser.</p>
        </div>
        <aside class="status-card">
          <span class="label">Refresh cadence</span>
          <strong id="refresh-indicator">Every 8 seconds</strong>
          <span class="subtle" id="last-updated">Waiting for first load...</span>
        </aside>
      </section>

      <section class="toolbar">
        <div class="field">
          <label for="url-filter">Search URL</label>
          <input id="url-filter" type="search" placeholder="/api/users, /health, /admin/api-logs" />
        </div>

        <div class="field">
          <label for="method-filter">Method</label>
          <select id="method-filter">
            <option value="">All</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="field">
          <label for="status-filter">Status</label>
          <select id="status-filter">
            <option value="">All</option>
            <option value="2xx">2xx Success</option>
            <option value="4xx">4xx Client Error</option>
            <option value="5xx">5xx Server Error</option>
            <option value="200">200</option>
            <option value="201">201</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="404">404</option>
            <option value="500">500</option>
          </select>
        </div>

        <div class="field">
          <label for="limit-filter">Rows</label>
          <select id="limit-filter">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100" selected>100</option>
          </select>
        </div>

        <div class="field">
          <label>&nbsp;</label>
          <button class="primary" id="apply-filters" type="button">Apply filters</button>
        </div>

        <div class="field">
          <label>&nbsp;</label>
          <button id="cleanup-logs" type="button">Delete logs older than 7 days</button>
        </div>
      </section>

      <section class="table-card">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Status</th>
                <th>Response Time</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="logs-table-body">
              <tr>
                <td colspan="6" class="empty-state">Loading logs...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="footer-bar">
        <div class="subtle" id="meta-summary">No data loaded yet.</div>
        <div class="pager">
          <button id="prev-page" type="button">Previous</button>
          <span id="page-label">Page 1</span>
          <button id="next-page" type="button">Next</button>
        </div>
      </section>
    </main>

    <div class="modal" id="details-modal" aria-hidden="true">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2 id="modal-title">Log details</h2>
            <p class="subtle" id="modal-subtitle"></p>
          </div>
          <button id="close-modal" type="button">Close</button>
        </div>

        <div class="modal-grid">
          <section class="json-card">
            <h3>Headers</h3>
            <pre id="headers-content">{}</pre>
          </section>
          <section class="json-card">
            <h3>Body</h3>
            <pre id="body-content">null</pre>
          </section>
        </div>
      </div>
    </div>

    <script>
      const state = {
        page: 1,
        limit: 100,
        method: '',
        status: '',
        url: '',
        totalPages: 1,
        logs: [],
      };

      const refreshIntervalMs = 8000;

      const tableBody = document.getElementById('logs-table-body');
      const metaSummary = document.getElementById('meta-summary');
      const pageLabel = document.getElementById('page-label');
      const prevPageButton = document.getElementById('prev-page');
      const nextPageButton = document.getElementById('next-page');
      const lastUpdated = document.getElementById('last-updated');
      const modal = document.getElementById('details-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalSubtitle = document.getElementById('modal-subtitle');
      const headersContent = document.getElementById('headers-content');
      const bodyContent = document.getElementById('body-content');

      const methodClass = (method) => {
        const normalized = String(method || '').toLowerCase();
        if (['get', 'post', 'put', 'patch', 'delete'].includes(normalized)) {
          return 'method-' + normalized;
        }

        return 'method-other';
      };

      const statusClass = (status) => {
        if (status >= 200 && status < 300) {
          return 'status-success';
        }

        if (status >= 400 && status < 500) {
          return 'status-client';
        }

        if (status >= 500) {
          return 'status-server';
        }

        return 'status-other';
      };

      const formatJson = (text) => {
        if (!text) {
          return 'null';
        }

        try {
          return JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          return text;
        }
      };

      const formatDate = (value) => new Date(value).toLocaleString();

      const renderRows = (logs) => {
        if (!logs.length) {
          tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No logs matched the current filters.</td></tr>';
          return;
        }

        tableBody.innerHTML = '';

        logs.forEach((log) => {
          const row = document.createElement('tr');
          if (log.responseTime > 1000) {
            row.classList.add('slow');
          }

          row.innerHTML = [
            '<td><span class="badge ' + methodClass(log.method) + '">' + log.method + '</span></td>',
            '<td class="url-cell">' + log.url + '</td>',
            '<td><span class="badge ' + statusClass(log.status) + '">' + log.status + '</span></td>',
            '<td>' + log.responseTime + ' ms' + (log.responseTime > 1000 ? ' <span class="subtle">slow</span>' : '') + '</td>',
            '<td>' + formatDate(log.createdAt) + '</td>',
            '<td><button class="action-button" type="button" data-log-id="' + log.id + '">View Details</button></td>',
          ].join('');

          tableBody.appendChild(row);
        });

        tableBody.querySelectorAll('[data-log-id]').forEach((button) => {
          button.addEventListener('click', () => {
            const logId = Number(button.getAttribute('data-log-id'));
            const log = state.logs.find((entry) => entry.id === logId);
            if (!log) {
              return;
            }

            modalTitle.textContent = log.method + ' ' + log.url;
            modalSubtitle.textContent = 'Status ' + log.status + ' • ' + log.responseTime + ' ms • ' + formatDate(log.createdAt);
            headersContent.textContent = formatJson(log.headers);
            bodyContent.textContent = formatJson(log.body);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
          });
        });
      };

      const applyMeta = (meta) => {
        state.totalPages = meta.totalPages || 1;
        pageLabel.textContent = 'Page ' + meta.page + ' of ' + state.totalPages;
        metaSummary.textContent = 'Showing ' + state.logs.length + ' logs of ' + meta.total + ' total';
        prevPageButton.disabled = meta.page <= 1;
        nextPageButton.disabled = meta.page >= state.totalPages;
      };

      const buildQuery = () => {
        const params = new URLSearchParams({
          page: String(state.page),
          limit: String(state.limit),
        });

        if (state.method) {
          params.set('method', state.method);
        }

        if (state.status) {
          params.set('status', state.status);
        }

        if (state.url) {
          params.set('url', state.url);
        }

        return params.toString();
      };

      const loadLogs = async () => {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading logs...</td></tr>';

        try {
          const response = await fetch('/admin/api-logs?' + buildQuery(), { headers: { Accept: 'application/json' } });
          const payload = await response.json();

          if (!response.ok || !payload.success) {
            throw new Error(payload.message || 'Failed to load logs');
          }

          state.logs = payload.data;
          renderRows(payload.data);
          applyMeta(payload.meta);
          lastUpdated.textContent = 'Last updated ' + new Date().toLocaleTimeString();
        } catch (error) {
          tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">' + error.message + '</td></tr>';
          metaSummary.textContent = 'Unable to load logs.';
          lastUpdated.textContent = 'Last refresh failed';
        }
      };

      document.getElementById('apply-filters').addEventListener('click', () => {
        state.page = 1;
        state.method = document.getElementById('method-filter').value;
        state.status = document.getElementById('status-filter').value;
        state.url = document.getElementById('url-filter').value.trim();
        state.limit = Number(document.getElementById('limit-filter').value);
        void loadLogs();
      });

      document.getElementById('cleanup-logs').addEventListener('click', async () => {
        const confirmed = window.confirm('Delete API logs older than 7 days?');
        if (!confirmed) {
          return;
        }

        try {
          const response = await fetch('/admin/api-logs/cleanup?olderThanDays=7', { method: 'DELETE' });
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error(payload.message || 'Cleanup failed');
          }

          window.alert('Deleted ' + payload.data.deletedCount + ' old logs.');
          state.page = 1;
          void loadLogs();
        } catch (error) {
          window.alert(error.message);
        }
      });

      prevPageButton.addEventListener('click', () => {
        if (state.page <= 1) {
          return;
        }

        state.page -= 1;
        void loadLogs();
      });

      nextPageButton.addEventListener('click', () => {
        if (state.page >= state.totalPages) {
          return;
        }

        state.page += 1;
        void loadLogs();
      });

      document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });

      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });

      void loadLogs();
      window.setInterval(() => {
        void loadLogs();
      }, refreshIntervalMs);
    </script>
  </body>
</html>`;

  return escapeTemplateLiteral(html);
};