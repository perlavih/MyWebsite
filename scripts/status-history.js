const statusHistory = document.querySelector('#status-history');

if (statusHistory) {
  const feedUrl = 'https://status.cafe/users/perlavih.atom';
  const proxyUrl = `https://proxy.cors.dev/${feedUrl}`;

  function getAtomText(entry, name) {
    return entry.getElementsByTagNameNS('*', name)[0]?.textContent?.trim() ?? '';
  }

  function getStatusText(entry) {
    const rawContent = getAtomText(entry, 'content') || getAtomText(entry, 'summary') || getAtomText(entry, 'title');
    const parsedContent = new DOMParser().parseFromString(rawContent, 'text/html');
    return parsedContent.body.textContent.trim();
  }

  function formatRelativeTime(date) {
    const secondsAgo = Math.round((date.getTime() - Date.now()) / 1000);
    const units = [
      ['year', 31_536_000],
      ['month', 2_592_000],
      ['week', 604_800],
      ['day', 86_400],
      ['hour', 3_600],
      ['minute', 60],
    ];
    const [unit, secondsPerUnit] = units.find(([, seconds]) => Math.abs(secondsAgo) >= seconds) ?? ['second', 1];
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round(secondsAgo / secondsPerUnit),
      unit,
    );
  }

  function renderStatus(entry) {
    const item = document.createElement('div');
    item.className = 'statuscafe-entry';

    const titleParts = getAtomText(entry, 'title').split(/\s+/);
    const username = document.createElement('div');
    username.className = 'statuscafe-username';
    const profile = document.createElement('a');
    profile.href = 'https://status.cafe/users/perlavih';
    profile.target = '_blank';
    profile.rel = 'noopener noreferrer';
    profile.textContent = getAtomText(entry, 'name') || titleParts[0] || 'perlavih';
    username.append(profile);

    const emoji = titleParts[1] || '';
    if (emoji) username.append(document.createTextNode(` ${emoji}`));

    const dateValue = getAtomText(entry, 'published') || getAtomText(entry, 'updated');
    if (dateValue) {
      const date = new Date(dateValue);
      if (!Number.isNaN(date.valueOf())) {
        const time = document.createElement('time');
        time.className = 'statuscafe-time';
        time.dateTime = date.toISOString();
        time.textContent = formatRelativeTime(date);
        username.append(document.createTextNode(' '), time);
      }
    }
    item.append(username);

    const text = document.createElement('div');
    text.className = 'statuscafe-content';
    text.textContent = getStatusText(entry) || 'Empty status';
    item.append(text);

    return item;
  }

  fetch(proxyUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
      return response.text();
    })
    .then((xml) => {
      const feed = new DOMParser().parseFromString(xml, 'application/xml');
      if (feed.querySelector('parsererror')) throw new Error('Status Cafe returned invalid Atom feed');

      const entries = [...feed.getElementsByTagNameNS('*', 'entry')];
      if (entries.length === 0) throw new Error('No statuses found in the Atom feed');

      const list = document.createElement('div');
      list.className = 'status-history-list';
      entries.forEach((entry) => list.append(renderStatus(entry)));
      statusHistory.replaceChildren(list);
      statusHistory.setAttribute('aria-busy', 'false');
    })
    .catch((error) => {
      console.error('Could not load Status Cafe history:', error);
      const message = document.createElement('div');
      message.className = 'status-history-message';
      message.textContent = 'Could not load the status history right now.';
      statusHistory.replaceChildren(message);
      statusHistory.setAttribute('aria-busy', 'false');
    });
}
