const isViteDevPort = ['3000', '5173'].includes(window.location.port);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (isViteDevPort
    ? `${window.location.protocol}//${window.location.hostname}:8787`
    : window.location.origin);

function buildDrinkPayload(cocktail) {
  return {
    id: cocktail.id,
    name: cocktail.name,
    englishName: cocktail.english_name,
    category: cocktail.category || cocktail.type || cocktail.base_liquor || '推荐酒品',
    baseLiquor: cocktail.base_liquor,
    priceText: cocktail.priceText,
    matchScore: cocktail.displayMatch,
    rank: cocktail.rank,
    tags: cocktail.matchedTags || [],
    selectedPlanId: cocktail.selectedPlanId
  };
}

function buildOrderPayload({ cocktail, result }) {
  return {
    channel: 'h5-result-page',
    drink: buildDrinkPayload(cocktail),
    recommendation: {
      mbti: result.mbti,
      mbtiName: result.mbtiInfo?.name,
      selectedPlanTitle: result.selectedPlanTitle,
      reasonHeading: cocktail.reasonHeading,
      reasonLabel: cocktail.reasonLabel
    }
  };
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || '订单服务暂时不可用');
  }

  return payload;
}

export async function createDrinkOrder({ cocktail, result }) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildOrderPayload({ cocktail, result }))
  });

  return parseResponse(response);
}

export { API_BASE_URL };
