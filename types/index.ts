// v1.0 — Shared types
export interface GenerateListingRequest {
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: number;
  lotSize?: string;
  features?: string;
  locationHighlights?: string;
}

export interface GeneratedListings {
  variation1: string;
  variation2: string;
  wordCounts: {
    variation1: number;
    variation2: number;
  };
}

export interface PropertyLookupResult {
  address: string;
  bedrooms?: string;
  bathrooms?: string;
  sqft?: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType?: string;
  found: boolean;
}
