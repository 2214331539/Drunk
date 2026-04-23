const TAG_COPY = {
  '低度数': '低负担的微醺感',
  '低成本': '点起来不心疼的爽感',
  '冷淡': '干净克制的距离感',
  '出片': '一上桌就很会出效果',
  '刺激': '会让情绪立刻起反应',
  '复杂': '层次慢慢展开的内容感',
  '奶香': '软乎乎的包裹感',
  '安神': '能把人慢慢放下来的安稳感',
  '治愈': '很会接住人的情绪',
  '平和': '没有攻击性的舒服感',
  '微苦': '收口很高级的苦感',
  '微醺': '刚刚好的轻上头',
  '快乐水': '熟悉又上头的快乐感',
  '抓马': '情绪一下就抬起来的戏剧感',
  '断电': '很容易让理智下班',
  '极简': '一眼就懂的高级感',
  '果味': '入口很友好的亲和力',
  '梦幻': '有点脱离现实的漂亮感',
  '气泡': '轻快往上冒的氛围感',
  '浓烈': '存在感特别强',
  '浪漫': '会让人自动脑补故事',
  '清淡': '不吵不闹的清透感',
  '清爽': '能把整个人降温一点',
  '烈酒': '很直接的酒精存在感',
  '爽快': '不拖泥带水的痛快感',
  '直球': '不绕弯子的直接劲儿',
  '甜水': '入口门槛很低',
  '甜腻': '会让人有满足感的甜',
  '简单粗暴': '不用想太多也能立刻开心',
  '纠结': '越喝越有回味',
  '纯粹': '干脆利落的完成度',
  '经典': '怎么点都不容易出错',
  '解压': '很会卸掉负担',
  '酸甜': '最容易讨人喜欢的平衡感',
  '颜值高': '还没入口就先赢了视觉',
  '高酒精度': '上头速度很明确'
};

const SBTI_PREFERRED_ALIASES = {
  '伪装': { tags: ['经典', '冷淡'] },
  '低复杂度': { tags: ['简单粗暴'], complexity: 1 },
  '低酒精度': { tags: ['低度数'], abv: 'low' },
  '安全': { tags: ['经典', '治愈'] },
  '安全感': { tags: ['治愈', '经典'] },
  '安慰': { tags: ['治愈', '奶香'] },
  '平和': { tags: ['清爽', '治愈'] },
  '微醺': { tags: ['低度数', '气泡'], abv: 'low' },
  '无感': { tags: ['极简', '纯粹'] },
  '浪漫': { tags: ['梦幻', '酸甜', '颜值高'] },
  '清淡': { tags: ['清爽', '极简'] },
  '狂野': { tags: ['刺激', '高酒精度', '烈酒'], abv: 'high' },
  '独处': { tags: ['极简', '治愈'] },
  '简单': { tags: ['简单粗暴'], complexity: 1 },
  '苦涩': { tags: ['微苦'], sweetness: 1 },
  '随便': { tags: ['快乐水', '简单粗暴'], complexity: 1 },
  '高调': { tags: ['出片', '颜值高', '梦幻'] }
};

const SBTI_EXCLUDED_ALIASES = {
  '傻白甜': { tags: ['甜腻', '甜水'] },
  '喧闹': { tags: ['快乐水', '气泡', '抓马'] },
  '娘娘腔': { tags: ['梦幻'] },
  '平庸': { tags: ['极简'] },
  '平淡': { tags: ['清爽', '治愈'] },
  '忧郁': { tags: ['微苦', '纠结'] },
  '拖泥带水': { tags: ['复杂'] },
  '挑战性': { tags: ['复杂', '烈酒'] },
  '提神': { tags: ['刺激'] },
  '无趣': { tags: ['极简', '纯粹'] },
  '无酒精': { tags: ['低度数'] },
  '昂贵': { tags: ['颜值高', '出片'] },
  '果味重': { tags: ['果味'] },
  '深沉': { tags: ['复杂', '微苦', '经典'] },
  '清淡': { tags: ['清爽', '极简'] },
  '温吞': { tags: ['治愈', '清爽'] },
  '温和': { tags: ['治愈', '清爽'] },
  '激情': { tags: ['抓马', '刺激'] },
  '社交': { tags: ['快乐水', '气泡', '出片'] },
  '粉红': { tags: ['梦幻', '颜值高'] },
  '粗糙': { tags: ['简单粗暴'] },
  '聚会': { tags: ['快乐水', '气泡', '出片'] },
  '花里胡哨': { tags: ['梦幻', '出片', '颜值高'] },
  '苦涩': { tags: ['微苦'] },
  '诱惑': { tags: ['抓马', '梦幻'] },
  '需要思考': { tags: ['复杂'] },
  '高定': { tags: ['颜值高'] },
  '高端': { tags: ['经典'] },
  '高调': { tags: ['出片', '颜值高', '梦幻'] }
};

const PERSONA_TEMPLATES = [
  '{sbtiCode}这种{sbtiName}，挑酒这件事本来就不该太普通',
  '{shortdesc}，所以真正会让你停下来的，往往不是热闹，是调性对上',
  '{planTitle}这条路子，放在{sbtiCode}身上本来就很容易成立',
  '{sbtiCode}这种人格，适合的不是随便一杯，而是第一眼就让人想下单的那种酒',
  '对{sbtiCode}来说，酒单里最值钱的不是品类多，而是有没有一杯刚好戳中自己'
];

const MATCH_TEMPLATES = [
  '{drink}身上的{tagKeywords}一起发力，几乎就是给你这套人格定制的微醺方案',
  '它最会抓人的地方，是把{tagKeywords}这几层感觉叠得很顺，基本没有犹豫成本',
  '它真正会勾人的点，不是标签堆得多，而是{tagCopyText}这些感觉全在往同一个方向发力',
  '当{spotlight}和{tagKeywords}撞在一杯里，{sbtiCode}往往很难装作没看到',
  '这杯厉害的不是花哨，而是{tagKeywords}这些点全都落在会让你心动的位置上'
];

const PRODUCT_TEMPLATES = [
  '{spotlight}这种设定，本身就比普通酒更容易让人记住',
  '{drink}的妙处在于，{descSnippet}，所以它不只是好喝，还特别会做情绪',
  '再加上它本身就是{spotlight}这一路数，气氛、画面和记忆点都替你准备好了',
  '{descSnippet}，所以这类酒很容易把“想喝一杯”直接变成“就点这一杯”'
];

const URGE_TEMPLATES = {
  visual: [
    '这种杯子最危险的地方，是连没开喝的人都会先想拍，再想点',
    '它不是单纯好看，是会让人觉得“不点就亏了今晚的镜头”的那种好看',
    '说白了，这就是那种看见就会让人自动脑补出片画面的酒'
  ],
  comfort: [
    '它很容易让人冒出一个念头：今晚就该对自己好一点',
    '这种酒最会制造一种冲动，叫“别硬撑了，就点它”',
    '买它不像消费，倒更像给情绪做一次体面安置'
  ],
  intense: [
    '它像替今晚按下快进键，所以很难不让人想立刻下单',
    '这种酒的下单逻辑很直接，看上了就会想马上拥有',
    '它不是慢热型选手，而是会把冲动当场拱出来的那一杯'
  ],
  cool: [
    '它会让人觉得，这杯点出来，整个人的风格先稳住一半',
    '有些酒负责好喝，这种酒更负责替人立住气质',
    '点它的快乐不只在入口，还在它一上桌就很像你的审美声明'
  ],
  easy: [
    '下单成本低，快乐来得快，基本属于看到就想点的类型',
    '这种杯子最适合先爽再说，几乎不会给人拖延的机会',
    '它没有太高理解门槛，所以很容易把心动立刻变成行动'
  ],
  story: [
    '这种层次感最会骗人买单，因为看起来就像“这一杯有东西”',
    '它不会只停在好喝，而是会让人觉得这杯值得被认真拥有一次',
    '有内容的酒最容易让人心动，因为它看起来像能接住一个晚上的情绪'
  ],
  default: [
    '说到底，这就是那种看完酒单会让人心里默念“就它了”的杯子',
    '它给人的感觉不是试试看，而是很容易直接进入买单流程',
    '真正会让人下单的酒，通常不是最吵的，而是最会让人确定的'
  ]
};

const COMPOSITION_PATTERNS = [
  ['persona', 'match', 'product', 'urge'],
  ['plan', 'match', 'product', 'urge'],
  ['persona', 'product', 'plan', 'urge'],
  ['product', 'match', 'urge'],
  ['persona', 'plan', 'product', 'urge'],
  ['plan', 'product', 'match', 'urge']
];

function addWeight(map, key, value) {
  map.set(key, (map.get(key) || 0) + value);
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getLeadingVote(votes, fallback = 'medium') {
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  return entries[0] && entries[0][1] > 0 ? entries[0][0] : fallback;
}

function sanitizeQuote(text = '') {
  return text.replace(/[“”"]/g, '').trim();
}

function trimEndingPunctuation(text = '') {
  return text.replace(/[。？！!?,，、；]+$/g, '').trim();
}

function cleanTitle(title = '') {
  return title.replace(/[【】]/g, '').trim();
}

function normalizeText(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

function hashString(text = '') {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getSeededIndex(length, seedSource, salt) {
  if (!length) {
    return 0;
  }

  return hashString(`${seedSource}:${salt}`) % length;
}

function pickSeeded(list, seedSource, salt) {
  if (!Array.isArray(list) || !list.length) {
    return '';
  }

  return list[getSeededIndex(list.length, seedSource, salt)];
}

function fillTemplate(template, variables) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => variables[key] || '');
}

function splitSentences(text = '') {
  return String(text)
    .split(/[。？！]/)
    .map((item) => normalizeText(trimEndingPunctuation(item)))
    .filter(Boolean);
}

function ensureSentence(text = '') {
  const normalized = normalizeText(trimEndingPunctuation(text));
  return normalized ? `${normalized}。` : '';
}

function uniqTags(list) {
  return [...new Set(list)];
}

function getPriceText() {
  return '**';
}

function getTagPhrase(tag) {
  return TAG_COPY[tag] || tag;
}

function buildTagKeywords(matchedTags, fallbackTags = []) {
  const tags = uniqTags([...matchedTags, ...(fallbackTags || [])]).slice(0, 3);
  return tags.length ? tags.join('、') : '好喝、耐看、很容易被点单';
}

function buildTagCopyText(matchedTags, fallbackTags = []) {
  const tags = uniqTags([...matchedTags, ...(fallbackTags || [])])
    .slice(0, 3)
    .map(getTagPhrase);

  return tags.length ? tags.join('、') : '很容易被点中的完成度';
}

function getDescSnippet(descBody = '') {
  const source = String(descBody || '').split('适合情绪')[0];
  const sentences = splitSentences(source);
  const normalized = sentences[0] || normalizeText(trimEndingPunctuation(source));

  if (!normalized) {
    return '它本身就很会制造记忆点';
  }

  if (normalized.length <= 24) {
    return normalized;
  }

  return `${normalized.slice(0, 22)}...`;
}

function resolveSemanticToken(token, aliasMap, availableTags, targetMap, meta, weight) {
  if (availableTags.has(token)) {
    addWeight(targetMap, token, weight);
  }

  const alias = aliasMap[token];
  if (!alias) {
    return;
  }

  if (Array.isArray(alias.tags)) {
    alias.tags.forEach((tag) => {
      if (availableTags.has(tag)) {
        addWeight(targetMap, tag, weight * 0.95);
      }
    });
  }

  if (alias.abv) {
    meta.abvVotes[alias.abv] += weight;
  }

  if (typeof alias.sweetness === 'number') {
    meta.sweetnessTargets.push(alias.sweetness);
  }

  if (typeof alias.complexity === 'number') {
    meta.complexityTargets.push(alias.complexity);
  }
}

function buildSbtiProfile(sbtiInfo, availableTags) {
  const preferredTagWeights = new Map();
  const excludedTagWeights = new Map();
  const meta = {
    abvVotes: { low: 0, medium: 0, high: 0 },
    sweetnessTargets: [],
    complexityTargets: []
  };

  sbtiInfo.recommendation_profile.preferred_tags.forEach((tag) => {
    resolveSemanticToken(tag, SBTI_PREFERRED_ALIASES, availableTags, preferredTagWeights, meta, 1.35);
  });

  sbtiInfo.recommendation_profile.excluded_tags.forEach((tag) => {
    resolveSemanticToken(tag, SBTI_EXCLUDED_ALIASES, availableTags, excludedTagWeights, meta, 1.15);
  });

  return {
    preferredTagWeights,
    excludedTagWeights,
    fallbackIds: new Set(sbtiInfo.recommendation_profile.fallback_cocktails || []),
    targetAbv: getLeadingVote(meta.abvVotes, null),
    targetSweetness: meta.sweetnessTargets.length ? average(meta.sweetnessTargets) : null,
    targetComplexity: meta.complexityTargets.length ? average(meta.complexityTargets) : null
  };
}

function buildPlanProfile(plan, availableTags) {
  const preferredTagWeights = new Map();
  const excludedTagWeights = new Map();

  (plan.focus_tags || []).forEach((tag) => {
    if (availableTags.has(tag)) {
      addWeight(preferredTagWeights, tag, 1.65);
    }
  });

  (plan.avoid_tags || []).forEach((tag) => {
    if (availableTags.has(tag)) {
      addWeight(excludedTagWeights, tag, 1.2);
    }
  });

  return {
    preferredTagWeights,
    excludedTagWeights,
    fallbackIds: new Set(plan.fallback_ids || []),
    targetAbv: plan.abv_target || null,
    targetSweetness: typeof plan.sweetness_target === 'number' ? plan.sweetness_target : null,
    targetComplexity: typeof plan.complexity_target === 'number' ? plan.complexity_target : null
  };
}

function collectMatches(cocktailTags, weightMap) {
  const matched = [];
  let total = 0;

  cocktailTags.forEach((tag) => {
    const weight = weightMap.get(tag);
    if (weight) {
      matched.push({ tag, weight });
      total += weight;
    }
  });

  matched.sort((a, b) => b.weight - a.weight);

  return {
    total,
    matched
  };
}

function getAbvBonus(actual, target) {
  if (!target) {
    return 0;
  }

  if (actual === target) {
    return 6;
  }

  const distanceMap = {
    low: { low: 0, medium: 1, high: 2 },
    medium: { low: 1, medium: 0, high: 1 },
    high: { low: 2, medium: 1, high: 0 }
  };

  const distance = distanceMap[target]?.[actual] ?? 1;
  return distance === 1 ? 2 : -3;
}

function getLevelBonus(actual, target, perfect = 6) {
  if (!target && target !== 0) {
    return 0;
  }

  const diff = Math.abs(actual - target);
  return Math.max(-2, perfect - diff * 2);
}

function getDisplayMatch(score) {
  return Math.max(68, Math.min(98, Math.round(score)));
}

function createFallbackPlan(sbtiCode, sbtiInfo) {
  const defaultTags = (sbtiInfo.recommendation_profile.preferred_tags || []).slice(0, 3);

  return {
    id: `${sbtiCode.toLowerCase()}_fallback`,
    title: '专属上头剧本',
    copy: `${sbtiCode} 这种人格，天生就该点一杯会做气氛、也会做情绪收口的酒。{drink}把 {tagKeywords} 和 {spotlight} 拧在一起，很容易从酒单里第一眼跳出来。`,
    focus_tags: defaultTags,
    fallback_ids: sbtiInfo.recommendation_profile.fallback_cocktails || []
  };
}

function pickRandomPlan(plans = []) {
  if (!plans.length) {
    return null;
  }

  return plans[Math.floor(Math.random() * plans.length)];
}

function detectMood(tags = []) {
  const tagSet = new Set(tags);

  if (['颜值高', '出片', '梦幻'].some((tag) => tagSet.has(tag))) {
    return 'visual';
  }

  if (['治愈', '奶香', '安神', '低度数'].some((tag) => tagSet.has(tag))) {
    return 'comfort';
  }

  if (['高酒精度', '烈酒', '刺激', '断电', '浓烈'].some((tag) => tagSet.has(tag))) {
    return 'intense';
  }

  if (['极简', '冷淡', '纯粹', '微苦'].some((tag) => tagSet.has(tag))) {
    return 'cool';
  }

  if (['快乐水', '气泡', '爽快', '简单粗暴', '直球'].some((tag) => tagSet.has(tag))) {
    return 'easy';
  }

  if (['复杂', '纠结', '经典', '酸甜'].some((tag) => tagSet.has(tag))) {
    return 'story';
  }

  return 'default';
}

function buildPlanSegment(plan, variables, seedSource) {
  const templateWithoutPrice = String(plan.copy || '').replace(/[，。； ]*\{pricePitch\}/g, '');
  const sentences = splitSentences(fillTemplate(templateWithoutPrice, variables));

  if (!sentences.length) {
    return '';
  }

  return pickSeeded(sentences, seedSource, 'plan');
}

function buildPersonaSegment(variables, seedSource) {
  return fillTemplate(pickSeeded(PERSONA_TEMPLATES, seedSource, 'persona'), variables);
}

function buildMatchSegment(variables, seedSource) {
  return fillTemplate(pickSeeded(MATCH_TEMPLATES, seedSource, 'match'), variables);
}

function buildProductSegment(variables, seedSource) {
  return fillTemplate(pickSeeded(PRODUCT_TEMPLATES, seedSource, 'product'), variables);
}

function buildUrgeSegment(variables, tags, seedSource) {
  const mood = detectMood(tags);
  const pool = URGE_TEMPLATES[mood] || URGE_TEMPLATES.default;
  return fillTemplate(pickSeeded(pool, seedSource, 'urge'), variables);
}

function composeReason(segments) {
  const seen = new Set();

  return segments
    .map((segment) => normalizeText(trimEndingPunctuation(segment)))
    .filter(Boolean)
    .filter((segment) => {
      const key = segment.replace(/[^0-9A-Za-z\u4e00-\u9fa5]/g, '');
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .map(ensureSentence)
    .join('');
}

function scoreCocktail(cocktail, sbtiProfile, planProfile) {
  const cocktailTags = cocktail.match_profile.tags;
  const sbtiMatch = collectMatches(cocktailTags, sbtiProfile.preferredTagWeights);
  const sbtiPenalty = collectMatches(cocktailTags, sbtiProfile.excludedTagWeights);
  const planMatch = collectMatches(cocktailTags, planProfile.preferredTagWeights);
  const planPenalty = collectMatches(cocktailTags, planProfile.excludedTagWeights);

  const effectiveAbvTarget = planProfile.targetAbv || sbtiProfile.targetAbv;
  const effectiveSweetnessTarget = planProfile.targetSweetness || sbtiProfile.targetSweetness;
  const effectiveComplexityTarget = planProfile.targetComplexity || sbtiProfile.targetComplexity;
  const sbtiFallbackHit = sbtiProfile.fallbackIds.has(cocktail.id);
  const planFallbackHit = planProfile.fallbackIds.has(cocktail.id);

  const totalScore = 60
    + sbtiMatch.total * 5.4
    + planMatch.total * 6.2
    - sbtiPenalty.total * 4.5
    - planPenalty.total * 4.1
    + getAbvBonus(cocktail.match_profile.abv_level, effectiveAbvTarget)
    + getLevelBonus(cocktail.match_profile.sweetness, effectiveSweetnessTarget, 5)
    + getLevelBonus(cocktail.match_profile.complexity, effectiveComplexityTarget, 4)
    + (sbtiFallbackHit ? 6 : 0)
    + (planFallbackHit ? 8 : 0)
    + (sbtiFallbackHit && planFallbackHit ? 3 : 0);

  return {
    totalScore,
    matchedTags: uniqTags([
      ...planMatch.matched.map((item) => item.tag),
      ...sbtiMatch.matched.map((item) => item.tag)
    ])
  };
}

function createPersonalizedReason(cocktail, sbtiCode, sbtiInfo, plan, matchedTags, variantSeed) {
  const shortdesc = trimEndingPunctuation(sanitizeQuote(sbtiInfo.shortdesc));
  const tagKeywords = buildTagKeywords(matchedTags, plan.focus_tags);
  const tagCopyText = buildTagCopyText(matchedTags, plan.focus_tags);
  const spotlight = cleanTitle(cocktail.desc_title);
  const descSnippet = getDescSnippet(cocktail.desc_body);
  const variables = {
    sbtiCode,
    sbtiName: sbtiInfo.name,
    shortdesc,
    planTitle: plan.title,
    drink: cocktail.name,
    englishName: cocktail.english_name,
    baseLiquor: cocktail.base_liquor,
    spotlight,
    descSnippet,
    tagKeywords,
    tagCopyText,
    priceText: getPriceText(cocktail.cost_range),
    pricePitch: ''
  };

  const segmentMap = {
    persona: buildPersonaSegment(variables, variantSeed),
    match: buildMatchSegment(variables, variantSeed),
    product: buildProductSegment(variables, variantSeed),
    urge: buildUrgeSegment(variables, [...matchedTags, ...cocktail.match_profile.tags], variantSeed),
    plan: buildPlanSegment(plan, variables, variantSeed)
  };

  const pattern = pickSeeded(COMPOSITION_PATTERNS, variantSeed, 'pattern');
  const segments = pattern
    .map((type) => segmentMap[type])
    .filter(Boolean);

  return composeReason(segments);
}

export function buildQuestions(questionData, sbtiMap) {
  return questionData.map((question) => {
    if (question.type !== 'sbti') {
      return question;
    }

    return {
      ...question,
      options: Object.entries(sbtiMap).map(([code, info]) => ({
        text: `${code} - ${info.name}`,
        value: code
      }))
    };
  });
}

export function calculateRecommendations({ sbtiCode, sbtiMap, cocktailsMap, answerPlanMap = {} }) {
  const sbtiInfo = sbtiMap[sbtiCode];

  if (!sbtiInfo) {
    throw new Error(`Unknown SBTI code: ${sbtiCode}`);
  }

  const cocktails = Object.values(cocktailsMap);
  const availableTags = new Set(cocktails.flatMap((item) => item.match_profile.tags));
  const sbtiProfile = buildSbtiProfile(sbtiInfo, availableTags);
  const plans = answerPlanMap[sbtiCode];
  const selectedPlan = pickRandomPlan(Array.isArray(plans) ? plans : []) || createFallbackPlan(sbtiCode, sbtiInfo);
  const planProfile = buildPlanProfile(selectedPlan, availableTags);
  const sessionSeed = `${sbtiCode}:${selectedPlan.id}:${Math.random().toString(36).slice(2, 10)}`;

  const rankedCocktails = cocktails
    .map((cocktail) => {
      const { totalScore, matchedTags } = scoreCocktail(cocktail, sbtiProfile, planProfile);

      return {
        ...cocktail,
        totalScore,
        matchedTags
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 4)
    .map((cocktail, index) => {
      const variantSeed = `${sessionSeed}:${cocktail.id}:${index + 1}`;

      return {
        ...cocktail,
        rank: index + 1,
        displayMatch: getDisplayMatch(cocktail.totalScore),
        reasonLabel: '你的 SBTI 专属推荐',
        reasonHeading: selectedPlan.title,
        personalizedReason: createPersonalizedReason(
          cocktail,
          sbtiCode,
          sbtiInfo,
          selectedPlan,
          cocktail.matchedTags,
          variantSeed
        ),
        priceText: getPriceText(cocktail.cost_range),
        spotlightTitle: cleanTitle(cocktail.desc_title),
        selectedPlanId: selectedPlan.id
      };
    });

  return {
    sbti: sbtiCode,
    sbtiInfo,
    selectedPlanTitle: selectedPlan.title,
    cocktails: rankedCocktails,
    topCocktail: rankedCocktails[0]
  };
}
