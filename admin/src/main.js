const API_BASE_KEY = 'drunk.admin.apiBase';

const defaultApiBase = window.location.protocol.startsWith('http')
  ? window.location.origin
  : 'http://localhost:8787';

const state = {
  apiBase: localStorage.getItem(API_BASE_KEY) || defaultApiBase,
  detector: null,
  stream: null,
  scanning: false,
  selectedOrder: null
};

const elements = {
  serviceStatus: document.querySelector('#serviceStatus'),
  apiBase: document.querySelector('#apiBase'),
  saveApiBase: document.querySelector('#saveApiBase'),
  refreshOrders: document.querySelector('#refreshOrders'),
  scanVideo: document.querySelector('#scanVideo'),
  scannerHint: document.querySelector('#scannerHint'),
  startScan: document.querySelector('#startScan'),
  stopScan: document.querySelector('#stopScan'),
  manualToken: document.querySelector('#manualToken'),
  manualLookup: document.querySelector('#manualLookup'),
  redeemPanel: document.querySelector('#redeemPanel'),
  redeemDrinkName: document.querySelector('#redeemDrinkName'),
  redeemStatus: document.querySelector('#redeemStatus'),
  redeemCategory: document.querySelector('#redeemCategory'),
  redeemOrderedAt: document.querySelector('#redeemOrderedAt'),
  redeemCode: document.querySelector('#redeemCode'),
  confirmRedeem: document.querySelector('#confirmRedeem'),
  redeemMessage: document.querySelector('#redeemMessage'),
  statTotal: document.querySelector('#statTotal'),
  statPending: document.querySelector('#statPending'),
  statRedeemed: document.querySelector('#statRedeemed'),
  ordersList: document.querySelector('#ordersList')
};

function setServiceStatus(text, tone = '') {
  elements.serviceStatus.textContent = text;
  elements.serviceStatus.className = `status-pill ${tone}`.trim();
}

function setScannerHint(text) {
  elements.scannerHint.textContent = text;
}

function setRedeemMessage(text, isError = false) {
  elements.redeemMessage.textContent = text;
  elements.redeemMessage.classList.toggle('is-error', isError);
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function extractToken(rawValue) {
  const value = String(rawValue || '').trim();
  const directMatch = value.match(/^DRUNK_ORDER:([A-Fa-f0-9]{18})$/);

  if (directMatch) {
    return directMatch[1].toUpperCase();
  }

  const compact = value.replace(/[^A-Fa-f0-9]/g, '');

  if (compact.length === 18) {
    return compact.toUpperCase();
  }

  try {
    const url = new URL(value);
    const token = url.searchParams.get('token') || url.pathname.split('/').filter(Boolean).pop();

    if (/^[A-Fa-f0-9]{18}$/.test(token || '')) {
      return token.toUpperCase();
    }
  } catch {
    return null;
  }

  return null;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${state.apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || '请求失败');
  }

  return payload;
}

function renderSelectedOrder(order) {
  state.selectedOrder = order;
  elements.redeemPanel.classList.remove('is-hidden');
  elements.redeemDrinkName.textContent = order.drink.name;
  elements.redeemStatus.textContent = order.status === 'redeemed' ? '已核销' : '待核销';
  elements.redeemStatus.className = `status-pill ${order.status === 'redeemed' ? 'is-warning' : 'is-ok'}`;
  elements.redeemCategory.textContent = order.drink.category || '-';
  elements.redeemOrderedAt.textContent = formatDateTime(order.orderedAt);
  elements.redeemCode.textContent = order.shortCode;
  elements.confirmRedeem.disabled = order.status === 'redeemed';
  setRedeemMessage(order.status === 'redeemed'
    ? `该订单已于 ${formatDateTime(order.redeemedAt)} 核销`
    : '订单有效，确认后会写入核销时间。');
}

async function lookupToken(token) {
  if (!token) {
    setRedeemMessage('没有识别到有效核销码', true);
    return;
  }

  try {
    const { order } = await apiFetch(`/api/orders/${token}`);
    renderSelectedOrder(order);
  } catch (error) {
    elements.redeemPanel.classList.remove('is-hidden');
    elements.redeemDrinkName.textContent = '未找到订单';
    elements.redeemStatus.textContent = '无效';
    elements.redeemStatus.className = 'status-pill is-warning';
    elements.redeemCategory.textContent = '-';
    elements.redeemOrderedAt.textContent = '-';
    elements.redeemCode.textContent = token;
    elements.confirmRedeem.disabled = true;
    setRedeemMessage(error.message, true);
  }
}

async function confirmRedeem() {
  if (!state.selectedOrder) {
    return;
  }

  elements.confirmRedeem.disabled = true;
  setRedeemMessage('核销中...');

  try {
    const { order, alreadyRedeemed } = await apiFetch(`/api/orders/${state.selectedOrder.token}/redeem`, {
      method: 'POST',
      body: JSON.stringify({
        operator: 'merchant-admin',
        device: navigator.userAgent
      })
    });

    renderSelectedOrder(order);
    setRedeemMessage(alreadyRedeemed ? '该订单此前已核销' : '核销成功，记录已保存');
    await loadOrders();
  } catch (error) {
    elements.confirmRedeem.disabled = false;
    setRedeemMessage(error.message, true);
  }
}

function renderOrders(orders) {
  if (!orders.length) {
    elements.ordersList.innerHTML = '<div class="empty-state">还没有订单记录</div>';
    return;
  }

  elements.ordersList.innerHTML = orders.map((order) => {
    const statusLabel = order.status === 'redeemed' ? '已核销' : '待核销';
    const statusClass = order.status === 'redeemed' ? 'is-warning' : 'is-ok';
    const redeemedText = order.redeemedAt ? `核销 ${formatDateTime(order.redeemedAt)}` : '尚未核销';
    const drinkName = escapeHtml(order.drink.name);
    const category = escapeHtml(order.drink.category || '推荐酒品');
    const shortCode = escapeHtml(order.shortCode);
    const mbti = escapeHtml(order.recommendation?.mbti || '-');
    const matchScore = escapeHtml(order.drink.matchScore || '-');

    return `
      <article class="order-item">
        <div class="order-item-head">
          <div>
            <h3>${drinkName}</h3>
            <p>${category} · ${shortCode}</p>
          </div>
          <span class="status-pill ${statusClass}">${statusLabel}</span>
        </div>
        <div class="order-meta">
          <span>下单 ${formatDateTime(order.orderedAt)}</span>
          <span>${redeemedText}</span>
          <span>MBTI ${mbti}</span>
          <span>匹配度 ${matchScore}%</span>
        </div>
      </article>
    `;
  }).join('');
}

async function loadOrders() {
  try {
    const { orders, stats } = await apiFetch('/api/admin/orders');

    elements.statTotal.textContent = stats.total;
    elements.statPending.textContent = stats.pending;
    elements.statRedeemed.textContent = stats.redeemed;
    renderOrders(orders);
    setServiceStatus('已连接', 'is-ok');
  } catch (error) {
    setServiceStatus('连接失败', 'is-warning');
    elements.ordersList.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

async function ensureDetector() {
  if (!('BarcodeDetector' in window)) {
    throw new Error('当前浏览器不支持扫码，请使用 Chrome Android 或手动输入核销码。');
  }

  if (!state.detector) {
    state.detector = new BarcodeDetector({ formats: ['qr_code'] });
  }

  return state.detector;
}

function stopScan() {
  state.scanning = false;

  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }

  elements.scanVideo.srcObject = null;
  elements.startScan.disabled = false;
  setScannerHint('扫码已停止，可再次开始或手动输入核销码。');
}

async function scanLoop() {
  if (!state.scanning || !state.detector) {
    return;
  }

  try {
    if (elements.scanVideo.readyState >= 2) {
      const codes = await state.detector.detect(elements.scanVideo);
      const rawValue = codes[0]?.rawValue;
      const token = extractToken(rawValue);

      if (token) {
        stopScan();
        setScannerHint(`已识别 ${token}`);
        await lookupToken(token);
        return;
      }
    }
  } catch (error) {
    setScannerHint(error.message);
  }

  window.requestAnimationFrame(scanLoop);
}

async function startScan() {
  elements.startScan.disabled = true;
  setScannerHint('正在启动摄像头...');

  try {
    await ensureDetector();
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' }
      },
      audio: false
    });
    elements.scanVideo.srcObject = state.stream;
    await elements.scanVideo.play();
    state.scanning = true;
    setScannerHint('对准 H5 下单二维码，识别后会自动停下。');
    window.requestAnimationFrame(scanLoop);
  } catch (error) {
    elements.startScan.disabled = false;
    setScannerHint(error.message);
  }
}

function saveApiBase() {
  state.apiBase = elements.apiBase.value.replace(/\/+$/, '');
  localStorage.setItem(API_BASE_KEY, state.apiBase);
  loadOrders();
}

function bindEvents() {
  elements.saveApiBase.addEventListener('click', saveApiBase);
  elements.refreshOrders.addEventListener('click', loadOrders);
  elements.startScan.addEventListener('click', startScan);
  elements.stopScan.addEventListener('click', stopScan);
  elements.confirmRedeem.addEventListener('click', confirmRedeem);
  elements.manualLookup.addEventListener('click', () => {
    const token = extractToken(elements.manualToken.value);
    lookupToken(token);
  });
  elements.manualToken.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const token = extractToken(elements.manualToken.value);
      lookupToken(token);
    }
  });
}

function init() {
  elements.apiBase.value = state.apiBase;
  bindEvents();
  loadOrders();
}

init();
