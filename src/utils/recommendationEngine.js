const TAG_COPY = {
  '低度数': '低负担的微醺感',
  '低成本': '没有压力的点单门槛',
  '冷淡': '冷感但有品的距离感',
  '出片': '很适合点单发圈的氛围感',
  '刺激': '带一点冒险的刺激感',
  '复杂': '层次慢慢展开的内容感',
  '奶香': '奶香带来的安全感',
  '安神': '让人慢慢放松下来的安稳感',
  '微苦': '收口很高级的微苦感',
  '快乐水': '熟悉又上头的快乐水属性',
  '抓马': '情绪一下就起来的戏剧感',
  '断电': '迅速上头的失控感',
  '极简': '干净克制的高级感',
  '果味': '果香先行的亲和力',
  '梦幻': '带一点逃离现实的梦幻感',
  '气泡': '轻快的气泡感',
  '治愈': '被稳稳接住的治愈感',
  '浓烈': '更强烈的存在感',
  '清爽': '干净利落的清爽感',
  '烈酒': '更直接的酒精存在感',
  '爽快': '喝起来很痛快',
  '甜水': '很好入口的甜水感',
  '甜腻': '高满足度的甜口',
  '直球': '不绕弯的直给感',
  '简单粗暴': '不用思考也很爽快',
  '纠结': '越喝越有内容的回味',
  '纯粹': '干脆直接的纯粹感',
  '经典': '经典不会出错的体面',
  '解压': '卸掉压力的松弛感',
  '酸甜': '酸甜平衡的讨喜口感',
  '颜值高': '一上桌就想拍照的颜值',
  '高酒精度': '更明确的酒精存在感'
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
  '忧郁': { tags: ['微苦', '纠结'] },
  '拖泥带水': { tags: ['复杂'] },
  '挑战性': { tags: ['复杂', '烈酒'] },
  '提神': { tags: ['刺激'] },
  '无酒精': { tags: ['低度数'] },
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
  return text.replace(/[。？！!?]+$/g, '').trim();
}

function cleanTitle(title = '') {
  return title.replace(/[【】]/g, '').trim();
}

function getPriceText(costRange = []) {
  if (!Array.isArray(costRange) || costRange.length < 2) {
    return '店内酒单为准';
  }

  return `¥${costRange[0]}-${costRange[1]}`;
}

function getPricePitch(costRange = []) {
  if (!Array.isArray(costRange) || costRange.length < 2) {
    return '价格并不夸张，属于很容易被点上的那一类。';
  }

  const [low, high] = costRange;

  if (high <= 10) {
    return `再看它常见落在 ${getPriceText(costRange)} 这个区间，几乎就是想点就点的低负担快乐。`;
  }

  if (high <= 14) {
    return `而它常见价格带在 ${getPriceText(costRange)}，很容易让人觉得这杯花得值。`;
  }

  return `它常见价格带在 ${getPriceText(costRange)}，但给到的氛围和完成度，足够让这笔钱花得很甘心。`;
}

function getTagPhrase(tag) {
  return TAG_COPY[tag] || tag;
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

function buildUserProfile(answerValues, questionData) {
  const answerLookup = new Map();
  const selectedProfiles = [];
  const preferredTagWeights = new Map();
  const avoidTagWeights = new Map();
  const abvVotes = { low: 0, medium: 0, high: 0 };
  const sweetnessTargets = [];
  const complexityTargets = [];

  questionData
    .filter((question) => question.type !== 'sbti')
    .forEach((question) => {
      question.options.forEach((option) => {
        answerLookup.set(option.value, option.profile);
      });
    });

  answerValues.forEach((value) => {
    const profile = answerLookup.get(value);

    if (!profile) {
      return;
    }

    selectedProfiles.push(profile);

    profile.preferred_tags.forEach((tag) => addWeight(preferredTagWeights, tag, 1));
    profile.avoid_tags.forEach((tag) => addWeight(avoidTagWeights, tag, 0.9));

    abvVotes[profile.abv_target] += 1;
    sweetnessTargets.push(profile.sweetness_target);
    complexityTargets.push(profile.complexity_target);
  });

  return {
    preferredTagWeights,
    avoidTagWeights,
    targetAbv: getLeadingVote(abvVotes, 'medium'),
    targetSweetness: average(sweetnessTargets) || 2.5,
    targetComplexity: average(complexityTargets) || 2,
    story: {
      need: selectedProfiles[0]?.reason_phrase || '喝得更对味',
      scene: selectedProfiles[1]?.reason_phrase || '场合自然一点',
      taste: selectedProfiles[2]?.reason_phrase || '入口足够合拍',
      mood: selectedProfiles[3]?.reason_phrase || '情绪安稳一点',
      goal: selectedProfiles[4]?.reason_phrase || '最后有被接住的感觉'
    }
  };
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
    resolveSemanticToken(tag, SBTI_PREFERRED_ALIASES, availableTags, preferredTagWeights, meta, 1.4);
  });

  sbtiInfo.recommendation_profile.excluded_tags.forEach((tag) => {
    resolveSemanticToken(tag, SBTI_EXCLUDED_ALIASES, availableTags, excludedTagWeights, meta, 1.2);
  });

  return {
    preferredTagWeights,
    excludedTagWeights,
    fallbackIds: new Set(sbtiInfo.recommendation_profile.fallback_cocktails),
    targetAbv: getLeadingVote(meta.abvVotes, null),
    targetSweetness: meta.sweetnessTargets.length ? average(meta.sweetnessTargets) : null,
    targetComplexity: meta.complexityTargets.length ? average(meta.complexityTargets) : null
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

  if (distance === 1) {
    return 2;
  }

  return -3;
}

function getLevelBonus(actual, target, perfect = 6) {
  if (!target) {
    return 0;
  }

  const diff = Math.abs(actual - target);
  return Math.max(-2, perfect - diff * 2);
}

function getDisplayMatch(score) {
  return Math.max(66, Math.min(98, Math.round(score)));
}

function uniqTags(list) {
  return [...new Set(list)];
}

function buildMatchedTagText(matchedTags) {
  const phrases = uniqTags(matchedTags)
    .slice(0, 3)
    .map(getTagPhrase);

  if (!phrases.length) {
    return '整体气质和你今天状态的贴合度';
  }

  return phrases.join('、');
}

function createPersonalizedReason(cocktail, sbtiCode, sbtiInfo, userProfile, matchedTags) {
  const preferredPreview = sbtiInfo.recommendation_profile.preferred_tags.slice(0, 2).join('、');
  const matchedTagText = buildMatchedTagText(matchedTags);
  const productTitle = cleanTitle(cocktail.desc_title);
  const shortdesc = trimEndingPunctuation(sanitizeQuote(sbtiInfo.shortdesc));
  const goalText = userProfile.story.goal.replace(/^最后(最好)?还能/, '').trim();
  const shortdescText = shortdesc ? `${shortdesc} 这种气质，也会让你更吃这一挂。` : '';

  return `对 ${sbtiCode} 型的${sbtiInfo.name}来说，“${preferredPreview}”这套本来就很容易让你心动，${shortdescText}你前五题里给出的信号也很明确：想要${userProfile.story.need}，偏爱${userProfile.story.taste}，最后最好还能${goalText}。${cocktail.name} 身上的${matchedTagText}正好把这些点一起踩中，再加上它本身就是一杯“${productTitle}”式的酒，很容易让你在看到酒单的那一刻就直接想下单。${getPricePitch(cocktail.cost_range)}`;
}

function scoreCocktail(cocktail, userProfile, sbtiProfile) {
  const cocktailTags = cocktail.match_profile.tags;
  const userMatch = collectMatches(cocktailTags, userProfile.preferredTagWeights);
  const userPenalty = collectMatches(cocktailTags, userProfile.avoidTagWeights);
  const sbtiMatch = collectMatches(cocktailTags, sbtiProfile.preferredTagWeights);
  const sbtiPenalty = collectMatches(cocktailTags, sbtiProfile.excludedTagWeights);

  const effectiveAbvTarget = sbtiProfile.targetAbv || userProfile.targetAbv;
  const effectiveSweetnessTarget = sbtiProfile.targetSweetness || userProfile.targetSweetness;
  const effectiveComplexityTarget = sbtiProfile.targetComplexity || userProfile.targetComplexity;

  const totalScore = 58
    + userMatch.total * 4.6
    + sbtiMatch.total * 5.6
    - userPenalty.total * 3.8
    - sbtiPenalty.total * 4.4
    + getAbvBonus(cocktail.match_profile.abv_level, effectiveAbvTarget)
    + getLevelBonus(cocktail.match_profile.sweetness, effectiveSweetnessTarget, 5)
    + getLevelBonus(cocktail.match_profile.complexity, effectiveComplexityTarget, 4)
    + (sbtiProfile.fallbackIds.has(cocktail.id) ? 7 : 0);

  const matchedTags = [
    ...sbtiMatch.matched.map((item) => item.tag),
    ...userMatch.matched.map((item) => item.tag)
  ];

  return {
    totalScore,
    matchedTags
  };
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

export function calculateRecommendations({ answerValues, sbtiCode, questionData, sbtiMap, cocktailsMap }) {
  const sbtiInfo = sbtiMap[sbtiCode];

  if (!sbtiInfo) {
    throw new Error(`Unknown SBTI code: ${sbtiCode}`);
  }

  const cocktails = Object.values(cocktailsMap);
  const availableTags = new Set(cocktails.flatMap((item) => item.match_profile.tags));
  const userProfile = buildUserProfile(answerValues, questionData);
  const sbtiProfile = buildSbtiProfile(sbtiInfo, availableTags);

  const rankedCocktails = cocktails
    .map((cocktail) => {
      const { totalScore, matchedTags } = scoreCocktail(cocktail, userProfile, sbtiProfile);

      return {
        ...cocktail,
        totalScore,
        matchedTags
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 4)
    .map((cocktail, index) => ({
      ...cocktail,
      rank: index + 1,
      displayMatch: getDisplayMatch(cocktail.totalScore),
      reasonHeading: '你的 SBTI 专属买单理由',
      personalizedReason: createPersonalizedReason(
        cocktail,
        sbtiCode,
        sbtiInfo,
        userProfile,
        cocktail.matchedTags
      ),
      priceText: getPriceText(cocktail.cost_range),
      spotlightTitle: cleanTitle(cocktail.desc_title)
    }));

  return {
    sbti: sbtiCode,
    sbtiInfo,
    cocktails: rankedCocktails,
    topCocktail: rankedCocktails[0]
  };
}
