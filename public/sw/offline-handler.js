
import { logSW } from './config.js';

// Create the offline fallback response
export const createOfflineResponse = () => {
  return new Response(
    `<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Botnb - Mode Hors-ligne</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #edf3fb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            color: #334155;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 24px;
            max-width: 500px;
            width: 100%;
          }
          h1 {
            color: #0ea5e9;
            margin-bottom: 16px;
          }
          p {
            margin-bottom: 24px;
            line-height: 1.5;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 16px;
            color: #0ea5e9;
          }
          .button {
            background-color: #0ea5e9;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 16px;
          }
          .button:hover {
            background-color: #0284c7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📶</div>
          <h1>Mode Hors-ligne</h1>
          <p>Vous êtes actuellement hors-ligne. Certaines fonctionnalités peuvent être limitées jusqu'à ce que votre connexion soit rétablie.</p>
          <p>Les données en cache sont toujours accessibles, mais les nouvelles modifications ne seront pas synchronisées tant que vous ne serez pas reconnecté.</p>
          <button class="button" onclick="window.location.reload()">Réessayer</button>
        </div>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      },
      status: 200
    }
  );
};

// Check if a request is for a page (HTML)
export const isPageRequest = (request) => {
  const url = new URL(request.url);
  const hasExtension = /\.\w+$/.test(url.pathname);
  
  // A request is for a page if:
  // 1. It's a navigate request (likely to be HTML)
  // 2. There's no file extension (likely to be a route)
  // 3. It's explicitly requesting HTML
  
  const acceptHeader = request.headers.get('Accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html');
  
  return (
    request.mode === 'navigate' || 
    (!hasExtension && url.pathname !== '/') || 
    isHtmlRequest
  );
};

// Log network status changes
export const monitorNetworkStatus = () => {
  self.addEventListener('online', () => {
    logSW('Network is online');
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ 
          type: 'NETWORK_STATUS', 
          payload: { online: true } 
        });
      });
    });
  });

  self.addEventListener('offline', () => {
    logSW('Network is offline');
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ 
          type: 'NETWORK_STATUS', 
          payload: { online: false } 
        });
      });
    });
  });
};

// Initialize network monitoring
monitorNetworkStatus();
