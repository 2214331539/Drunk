import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID } from 'node:crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = normalize(join(__dirname, '..'));
const DATA_DIR = join(__dirname, 'data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const ADMIN_DIR = join(ROOT_DIR, 'admin');
const PORT = Number(process.env.PORT || 8787);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function ensureStore() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!existsSync(ORDERS_FILE)) {
    writeFileSync(ORDERS_FILE, '[]\n', 'utf8');
  }
}

function readOrders() {
  ensureStore();

  try {
    const content = readFileSync(ORDERS_FILE, 'utf8').trim();
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error('Failed to read orders store:', error);
    return [];
  }
}

function writeOrders(orders) {
  ensureStore();
  writeFileSync(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode = 204) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end();
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on('data', (chunk) => {
      size += chunk.length;

      if (size > 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });

    request.on('error', reject);
  });
}

function cleanText(value, fallback = '', maxLength = 120) {
  return String(value || fallback).trim().slice(0, maxLength);
}

function cleanDrinkPayload(drink = {}) {
  return {
    id: cleanText(drink.id, 'unknown'),
    name: cleanText(drink.name, '未命名酒品'),
    englishName: cleanText(drink.englishName),
    category: cleanText(drink.category, '推荐酒品'),
    baseLiquor: cleanText(drink.baseLiquor, '未记录'),
    priceText: cleanText(drink.priceText, '**'),
    matchScore: Number.isFinite(Number(drink.matchScore)) ? Number(drink.matchScore) : null,
    rank: Number.isFinite(Number(drink.rank)) ? Number(drink.rank) : null,
    tags: Array.isArray(drink.tags) ? drink.tags.map((tag) => cleanText(tag)).filter(Boolean).slice(0, 8) : [],
    selectedPlanId: cleanText(drink.selectedPlanId)
  };
}

function cleanRecommendationPayload(recommendation = {}) {
  return {
    mbti: cleanText(recommendation.mbti),
    mbtiName: cleanText(recommendation.mbtiName),
    selectedPlanTitle: cleanText(recommendation.selectedPlanTitle),
    reasonHeading: cleanText(recommendation.reasonHeading),
    reasonLabel: cleanText(recommendation.reasonLabel)
  };
}

function createToken() {
  return randomBytes(9).toString('hex').toUpperCase();
}

function toShortCode(token) {
  return `${token.slice(0, 4)}-${token.slice(4, 8)}-${token.slice(8, 12)}`;
}

function toPublicOrder(order) {
  return {
    id: order.id,
    token: order.token,
    shortCode: order.shortCode,
    qrPayload: order.qrPayload,
    status: order.status,
    drink: order.drink,
    recommendation: order.recommendation,
    orderedAt: order.orderedAt,
    redeemedAt: order.redeemedAt,
    redeemedBy: order.redeemedBy,
    redeemedDevice: order.redeemedDevice
  };
}

function findOrderByToken(orders, token) {
  const normalizedToken = cleanText(token).toUpperCase();

  return orders.find((order) => order.token === normalizedToken);
}

async function handleCreateOrder(request, response) {
  const body = await readBody(request);
  const drink = cleanDrinkPayload(body.drink);

  if (!drink.name || drink.name === '未命名酒品') {
    sendJson(response, 400, { message: '缺少下单酒品信息' });
    return;
  }

  const orders = readOrders();
  let token = createToken();

  while (findOrderByToken(orders, token)) {
    token = createToken();
  }

  const order = {
    id: randomUUID(),
    token,
    shortCode: toShortCode(token),
    qrPayload: `DRUNK_ORDER:${token}`,
    status: 'pending',
    drink,
    recommendation: cleanRecommendationPayload(body.recommendation),
    channel: cleanText(body.channel, 'h5-result-page'),
    orderedAt: new Date().toISOString(),
    redeemedAt: null,
    redeemedBy: null,
    redeemedDevice: null
  };

  orders.unshift(order);
  writeOrders(orders);
  sendJson(response, 201, { order: toPublicOrder(order) });
}

function handleGetOrder(response, token) {
  const order = findOrderByToken(readOrders(), token);

  if (!order) {
    sendJson(response, 404, { message: '未找到该核销码' });
    return;
  }

  sendJson(response, 200, { order: toPublicOrder(order) });
}

async function handleRedeemOrder(request, response, token) {
  const orders = readOrders();
  const order = findOrderByToken(orders, token);

  if (!order) {
    sendJson(response, 404, { message: '未找到该核销码' });
    return;
  }

  const body = await readBody(request).catch(() => ({}));

  if (order.status === 'redeemed') {
    sendJson(response, 200, {
      alreadyRedeemed: true,
      order: toPublicOrder(order)
    });
    return;
  }

  order.status = 'redeemed';
  order.redeemedAt = new Date().toISOString();
  order.redeemedBy = cleanText(body.operator, 'merchant-admin');
  order.redeemedDevice = cleanText(body.device, request.headers['user-agent'] || 'unknown-device', 180);

  writeOrders(orders);
  sendJson(response, 200, {
    alreadyRedeemed: false,
    order: toPublicOrder(order)
  });
}

function handleListOrders(response, searchParams) {
  const status = cleanText(searchParams.get('status'));
  const orders = readOrders()
    .filter((order) => !status || order.status === status)
    .map(toPublicOrder);
  const stats = orders.reduce(
    (currentStats, order) => ({
      total: currentStats.total + 1,
      pending: currentStats.pending + (order.status === 'pending' ? 1 : 0),
      redeemed: currentStats.redeemed + (order.status === 'redeemed' ? 1 : 0)
    }),
    { total: 0, pending: 0, redeemed: 0 }
  );

  sendJson(response, 200, { orders, stats });
}

function isPathInside(parent, child) {
  const target = relative(parent, child);

  return target && !target.startsWith('..') && !target.startsWith('/') && !target.startsWith('\\');
}

function serveAdminAsset(request, response, pathname) {
  if (pathname === '/admin') {
    response.writeHead(302, { Location: '/admin/' });
    response.end();
    return true;
  }

  if (!pathname.startsWith('/admin/')) {
    return false;
  }

  const requestedPath = pathname === '/admin/'
    ? join(ADMIN_DIR, 'index.html')
    : normalize(join(ADMIN_DIR, pathname.replace(/^\/admin\//, '')));

  if (!isPathInside(ADMIN_DIR, requestedPath) || !existsSync(requestedPath)) {
    sendJson(response, 404, { message: 'Admin asset not found.' });
    return true;
  }

  const extension = extname(requestedPath).toLowerCase();

  response.writeHead(200, {
    'Content-Type': MIME_TYPES[extension] || 'application/octet-stream'
  });
  createReadStream(requestedPath).pipe(response);
  return true;
}

async function route(request, response) {
  const url = new URL(request.url || '/', 'http://localhost');
  const { pathname, searchParams } = url;

  if (request.method === 'OPTIONS') {
    sendEmpty(response);
    return;
  }

  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'drunk-order-backend' });
    return;
  }

  if (request.method === 'POST' && pathname === '/api/orders') {
    await handleCreateOrder(request, response);
    return;
  }

  const orderMatch = pathname.match(/^\/api\/orders\/([A-Za-z0-9]+)$/);
  const redeemMatch = pathname.match(/^\/api\/orders\/([A-Za-z0-9]+)\/redeem$/);

  if (request.method === 'GET' && orderMatch) {
    handleGetOrder(response, orderMatch[1]);
    return;
  }

  if (request.method === 'POST' && redeemMatch) {
    await handleRedeemOrder(request, response, redeemMatch[1]);
    return;
  }

  if (request.method === 'GET' && pathname === '/api/admin/orders') {
    handleListOrders(response, searchParams);
    return;
  }

  if (request.method === 'GET' && serveAdminAsset(request, response, pathname)) {
    return;
  }

  sendJson(response, 404, { message: 'Not found.' });
}

ensureStore();

createServer((request, response) => {
  route(request, response).catch((error) => {
    console.error(error);
    sendJson(response, 500, { message: error.message || 'Internal server error.' });
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Drunk order backend running at http://localhost:${PORT}`);
  console.log(`Admin app available at http://localhost:${PORT}/admin/`);
});
