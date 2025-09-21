import Image from "next/image";
import { MarketplaceListing } from "@/app/Types";
import Link from "next/link";

interface MarketplaceListingCardProps {
  marketplaceListing: MarketplaceListing;
}

export default function MarketplaceListingCard({
  marketplaceListing,
}: MarketplaceListingCardProps) {
  return (
    <div>
      <Link href={`/marketplace/${marketplaceListing.id}`}>
        <h2>{marketplaceListing.title}</h2>
      </Link>
      <p>{marketplaceListing.content}</p>
      {marketplaceListing.images?.map((img, i) => (
        <Image key={i} src={img} alt="" width={120} height={120} unoptimized />
      ))}
      <p className="text-xs mt-2">Type: {marketplaceListing.type}</p>
    </div>
  );
}
