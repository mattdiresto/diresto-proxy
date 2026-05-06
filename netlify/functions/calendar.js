exports.handler = async function(event, context) {
  const FEEDS = {
    p1: {
      name: 'Modern 2BR/2BA Retreat – Birmingham',
      airbnb: 'https://www.airbnb.com/calendar/ical/1629116377953605272.ics?t=71d5920e4685465cb6e8d84c95d84105',
      vrbo:   'https://www.vrbo.com/icalendar/ac628191dbe74944994dcbdf0af07998.ics?nonTentative'
    },
    p2: {
      name: 'Cozy 2BR Near UAB – Birmingham',
      airbnb: 'https://www.airbnb.com/calendar/ical/1532108571853292438.ics?t=8b8a434965bc4ce59e9f924ed20cd400',
      vrbo:   'https://www.vrbo.com/icalendar/12f9d4474c004e03bdae47a60b69a01e.ics?nonTentative'
    },
    p3: {
      name: 'Desert Escape – Joshua Tree',
      airbnb: 'https://www.airbnb.com/calendar/ical/1539525220766103448.ics?t=4e0970985bf141f3923aeec773dbb40a',
      vrbo:   'https://www.vrbo.com/icalendar/01aa0c08dbe044d6bb638ac172a961c0.ics?nonTentative'
    }
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const prop = (event.queryStringParameters && event.queryStringParameters.prop) || 'p1';
  const feed = FEEDS[prop];

  if (!feed) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid prop' }) };
  }

  async function fetchText(url) {
    try {
      const res = await fetch(url);
      return res.ok ? await res.text() : '';
    } catch(e) { return ''; }
  }

  const [airbnb, vrbo] = await Promise.all([fetchText(feed.airbnb), fetchText(feed.vrbo)]);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ property: feed.name, airbnb, vrbo, synced: new Date().toISOString() })
  };
};
