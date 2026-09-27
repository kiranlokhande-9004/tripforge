import type { WeatherData } from './weatherService';

export interface RiskFactor {
  id: 'weather' | 'social' | 'historical' | 'structural';
  name: string;
  score: number;
  percentage: number;
  weight: number;
  contribution: number;
  label: string;
  explanation: string;
  source: string;
  sourceType:
    | 'live'
    | 'model'
    | 'fallback'
    | 'itinerary';
}

export interface RiskAssessment {
  score: number;
  percentage: number;
  level: 'low' | 'moderate' | 'high';
  levelLabel: string;
  summary: string;
  factors: RiskFactor[];
  generatedAt: string;
  destination: string;
}

export interface RiskCalculationInputs {
  destination: string;
  weather?: WeatherData | null;

  itineraryItems?: Array<{
    activity: string;
    location?: string;
    travelTime?: string;
    category?: string;
    status?: string;
  }>;

  hasActiveDisruption?: boolean;

  factorOverrides?: {
    weather?: number;
    social?: number;
    historical?: number;
    structural?: number;
  };
}

export function calculateWeightedScore(
  weather: number,
  social: number,
  historical: number,
  structural: number
): number {
  const w = Math.max(0, Math.min(1, weather));
  const s = Math.max(0, Math.min(1, social));
  const h = Math.max(0, Math.min(1, historical));
  const st = Math.max(0, Math.min(1, structural));

  return Number(
    (
      w * 0.4 +
      s * 0.25 +
      h * 0.2 +
      st * 0.15
    ).toFixed(4)
  );
}

export function getRiskLevel(score: number): {
  level: 'low' | 'moderate' | 'high';
  levelLabel: string;
} {
  const percentage =
    score <= 1
      ? Math.round(score * 100)
      : Math.round(score);

  if (percentage <= 30) {
    return {
      level: 'low',
      levelLabel: 'LOW RISK',
    };
  }

  if (percentage <= 60) {
    return {
      level: 'moderate',
      levelLabel: 'MODERATE RISK',
    };
  }

  return {
    level: 'high',
    levelLabel: 'HIGH RISK',
  };
}

function weatherRisk(
  weather?: WeatherData | null
): {
  score: number;
  explanation: string;
} {
  if (!weather?.available) {
    return {
      score: 0.2,
      explanation:
        'Live weather unavailable. Baseline weather risk used.',
    };
  }

  const code = weather.weatherCode ?? 0;
  const rain = weather.rainProbability ?? 0;
  const precipitation = weather.precipitation ?? 0;
  const wind = weather.windSpeed ?? 0;

  let score = 0.1;

  if (code >= 95) {
    score = 0.9;
  } else if (code === 65 || code === 82) {
    score = 0.82;
  } else if (
    code === 63 ||
    code === 81 ||
    rain >= 75 ||
    precipitation >= 2.5
  ) {
    score = 0.65;
  } else if (code === 45 || code === 48) {
    score = 0.55;
  } else if (
    code === 51 ||
    code === 53 ||
    code === 61 ||
    code === 80 ||
    rain >= 40
  ) {
    score = 0.32;
  }

  if (wind >= 38) {
    score = Math.max(score, 0.75);
  }

  if (weather.isDisruptionRisk) {
    score = Math.max(score, 0.72);
  }

  return {
    score,
    explanation:
      weather.disruptionReason ||
      `${weather.condition || 'Current weather'} with ${rain}% rain probability.`,
  };
}

function socialRisk(destination: string): number {
  const name = destination.toLowerCase();

  if (
    name.includes('goa') ||
    name.includes('rishikesh')
  ) {
    return 0.57;
  }

  return 0.12;
}

function historicalRisk(destination: string): number {
  const name = destination.toLowerCase();

  if (
    name.includes('goa') ||
    name.includes('rishikesh')
  ) {
    return 0.33;
  }

  if (
    name.includes('jaipur') ||
    name.includes('udaipur')
  ) {
    return 0.18;
  }

  return 0.15;
}

function structuralRisk(
  items?: RiskCalculationInputs['itineraryItems']
): number {
  if (!items || items.length === 0) {
    return 0.25;
  }

  let score = 0.2;

  for (const item of items) {
    const activity =
      (item.activity || '').toLowerCase();

    const travelTime =
      (item.travelTime || '').toLowerCase();

    if (
      activity.includes('beach') ||
      activity.includes('boat') ||
      activity.includes('cruise') ||
      activity.includes('sailing') ||
      activity.includes('catamaran') ||
      activity.includes('watersport')
    ) {
      score += 0.2;
    }

    if (
      travelTime.includes('45') ||
      travelTime.includes('50') ||
      travelTime.includes('60') ||
      travelTime.includes('1h')
    ) {
      score += 0.1;
    }

    if (
      item.status === 'Rerouted' ||
      activity.includes('indoor') ||
      activity.includes('manor')
    ) {
      score -= 0.15;
    }
  }

  return Math.max(
    0,
    Math.min(1, score)
  );
}

export function assessTripRisk(
  inputs: RiskCalculationInputs
): RiskAssessment {
  const destination =
    inputs.destination || 'Goa';

  const weatherResult =
    inputs.factorOverrides?.weather !== undefined
      ? {
          score: inputs.factorOverrides.weather,
          explanation:
            'Simulated weather condition.',
        }
      : weatherRisk(inputs.weather);

  const social =
    inputs.factorOverrides?.social ??
    socialRisk(destination);

  const historical =
    inputs.factorOverrides?.historical ??
    historicalRisk(destination);

  const structural =
    inputs.factorOverrides?.structural ??
    structuralRisk(inputs.itineraryItems);

  const score = calculateWeightedScore(
    weatherResult.score,
    social,
    historical,
    structural
  );

  const percentage = Math.round(score * 100);

  const {
    level,
    levelLabel,
  } = getRiskLevel(score);

  const factors: RiskFactor[] = [
    {
      id: 'weather',
      name: 'Weather Risk',
      score: weatherResult.score,
      percentage: Math.round(
        weatherResult.score * 100
      ),
      weight: 0.4,
      contribution:
        weatherResult.score * 0.4,
      label: '40% WEIGHT',
      explanation:
        weatherResult.explanation,
      source: 'Open-Meteo Live API',
      sourceType: 'live',
    },

    {
      id: 'social',
      name: 'Social Signal',
      score: social,
      percentage: Math.round(
        social * 100
      ),
      weight: 0.25,
      contribution: social * 0.25,
      label: '25% WEIGHT',
      explanation:
        'Public travel signal estimate.',
      source: 'Public Signals',
      sourceType: 'model',
    },

    {
      id: 'historical',
      name: 'Historical Pattern',
      score: historical,
      percentage: Math.round(
        historical * 100
      ),
      weight: 0.2,
      contribution:
        historical * 0.2,
      label: '20% WEIGHT',
      explanation:
        'Seasonal destination risk baseline.',
      source: 'Pattern Model',
      sourceType: 'model',
    },

    {
      id: 'structural',
      name: 'Structural Risk',
      score: structural,
      percentage: Math.round(
        structural * 100
      ),
      weight: 0.15,
      contribution:
        structural * 0.15,
      label: '15% WEIGHT',
      explanation:
        'Itinerary dependency analysis.',
      source: 'Current Itinerary',
      sourceType: 'itinerary',
    },
  ];

  let summary = '';

  if (level === 'high') {
    summary =
      `Elevated travel risk detected for ${destination}.`;
  } else if (level === 'moderate') {
    summary =
      `Moderate travel risk detected for ${destination}.`;
  } else {
    summary =
      `Low travel risk detected for ${destination}.`;
  }

  return {
    score,
    percentage,
    level,
    levelLabel,
    summary,
    factors,
    generatedAt:
      new Date().toISOString(),
    destination,
  };
}