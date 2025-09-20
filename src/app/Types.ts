export type MarketplaceListingType = "BUY" | "SELL" | "LOOKING";

export type MarketplaceListing = {
  id: string;
  title: string;
  content: string;
  type: MarketplaceListingType;
  created_at: string;
  images?: string[];
};

export type Review = {
  id: string;
  content: string;
  rating?: number;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  post_type: string;
  content: string;
  created_at: string;
};
