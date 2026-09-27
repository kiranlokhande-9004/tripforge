export interface WeatherData {
  available: boolean;
  temperature?: number;
  feelsLike?: number;
  weatherCode?: number;
  condition?: string;
  precipitation?: number;
  rainProbability?: number;
  windSpeed?: number;
  isDisruptionRisk?: boolean;
  disruptionReason?: string;
  source: 'Open-Meteo Live API' | 'Unavailable';
  updatedAt?: string;
}

const WMO_CODES: Record<
  number,
  {
    condition: string;
    disruptive: boolean;
    reason?: string;
  }
> = {
  0: { condition: 'Clear Sky', disruptive: false },
  1: { condition: 'Mainly Clear', disruptive: false },
  2: { condition: 'Partly Cloudy', disruptive: false },
  3: { condition: 'Overcast', disruptive: false },

  45: {
    condition: 'Foggy',
    disruptive: true,
    reason: 'Dense fog affecting visibility',
  },

  48: {
    condition: 'Dense Fog',
    disruptive: true,
    reason: 'Severe visibility hazard',
  },

  51: { condition: 'Light Drizzle', disruptive: false },
  53: { condition: 'Moderate Drizzle', disruptive: false },

  55: {
    condition: 'Dense Drizzle',
    disruptive: true,
    reason: 'Persistent rain affecting outdoor activities',
  },

  61: { condition: 'Slight Rain', disruptive: false },

  63: {
    condition: 'Moderate Rain',
    disruptive: true,
    reason: 'Continuous rain affecting outdoor activities',
  },

  65: {
    condition: 'Heavy Rain',
    disruptive: true,
    reason: 'Heavy rain affecting outdoor and maritime activities',
  },

  80: {
    condition: 'Slight Rain Showers',
    disruptive: false,
  },

  81: {
    condition: 'Moderate Rain Showers',
    disruptive: true,
    reason: 'Rain showers may affect outdoor schedules',
  },

  82: {
    condition: 'Violent Rain Showers',
    disruptive: true,
    reason: 'Heavy shower and flooding risk',
  },

  95: {
    condition: 'Thunderstorm',
    disruptive: true,
    reason: 'Thunderstorm and lightning hazard',
  },

  96: {
    condition: 'Thunderstorm with Hail',
    disruptive: true,
    reason: 'Thunderstorm and hail hazard',
  },

  99: {
    condition: 'Severe Thunderstorm',
    disruptive: true,
    reason: 'Severe thunderstorm hazard',
  },
};

export async function fetchLiveDestinationWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
      `&hourly=precipitation_probability` +
      `&forecast_days=1`;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const current = data.current || {};

    const weatherCode =
      typeof current.weather_code === 'number'
        ? current.weather_code
        : 0;

    const weatherInfo =
      WMO_CODES[weatherCode] || {
        condition: 'Fair Weather',
        disruptive: false,
      };

    const temperature =
      typeof current.temperature_2m === 'number'
        ? Math.round(current.temperature_2m)
        : undefined;

    const feelsLike =
      typeof current.apparent_temperature === 'number'
        ? Math.round(current.apparent_temperature)
        : temperature;

    const windSpeed =
      typeof current.wind_speed_10m === 'number'
        ? Math.round(current.wind_speed_10m)
        : 0;

    const precipitation =
      typeof current.precipitation === 'number'
        ? current.precipitation
        : 0;

    let rainProbability = 0;

    if (
      data.hourly &&
      Array.isArray(data.hourly.precipitation_probability)
    ) {
      const hour = new Date().getHours();

      rainProbability =
        data.hourly.precipitation_probability[hour] ??
        data.hourly.precipitation_probability[0] ??
        0;
    }

    const highWind = windSpeed > 38;

    const disruptionRisk =
      weatherInfo.disruptive ||
      precipitation > 1.5 ||
      rainProbability > 75 ||
      highWind;

    let disruptionReason = weatherInfo.reason;

    if (highWind) {
      disruptionReason =
        `High winds of ${windSpeed} km/h detected`;
    } else if (precipitation > 1.5) {
      disruptionReason =
        `Active rainfall of ${precipitation}mm detected`;
    }

    return {
      available: true,
      temperature,
      feelsLike,
      weatherCode,
      condition: weatherInfo.condition,
      precipitation,
      rainProbability,
      windSpeed,
      isDisruptionRisk: disruptionRisk,
      disruptionReason,
      source: 'Open-Meteo Live API',
      updatedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (error) {
    console.warn('Weather service error:', error);

    return {
      available: false,
      source: 'Unavailable',
    };
  }
}