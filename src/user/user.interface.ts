export interface User {
  id: number;
  earnings: number;
  country: string;
  name: string;
}

export interface UserCountByCountry {
  country: string;
  count: number;
}

export interface AvgEarningsByCountry {
  country: string;
  avgEarnings: number;
}
