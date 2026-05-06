// v1.16 — Address lookup via RentCast API
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RENTCAST_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ address, found: false });
    }

    const cleanAddress = address.trim().replace(/\s+/g, " ");

    const response = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(cleanAddress)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Api-Key": apiKey,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // RentCast returns an array of properties
      const properties = Array.isArray(data) ? data : [data];

      if (properties.length > 0 && properties[0].addressLine1) {
        const property = properties[0];

        return NextResponse.json({
          address: property.formattedAddress || `${property.addressLine1}, ${property.city}, ${property.state} ${property.zipCode}`,
          bedrooms: property.bedrooms?.toString() || undefined,
          bathrooms: property.bathrooms?.toString() || undefined,
          sqft: property.squareFootage || undefined,
          lotSize: property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : undefined,
          yearBuilt: property.yearBuilt || undefined,
          propertyType: property.propertyType || undefined,
          found: true,
        });
      }
    }

    return NextResponse.json({ address, found: false });
  } catch (error) {
    console.error("Property lookup error:", error);
    return NextResponse.json({ address: "", found: false });
  }
}
