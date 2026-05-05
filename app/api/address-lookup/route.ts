// v1.0 — Address lookup via ATTOM Data API (ported from Replit v0.x)
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

    const apiKey = process.env.ATTOM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ address, found: false });
    }

    const cleanAddress = address.trim().replace(/\s+/g, " ");
    const addressParts = cleanAddress.split(",");
    let address1 = "";
    let address2 = "";

    if (addressParts.length >= 2) {
      address1 = addressParts[0].trim();
      address2 = addressParts.slice(1).join(",").trim();
    } else {
      address1 = cleanAddress;
      address2 = "";
    }

    const endpoints = [
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`,
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`,
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`,
    ];

    for (const url of endpoints) {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          apikey: apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.property && data.property.length > 0) {
          const property = data.property[0];
          const building = property.building || {};
          const lot = property.lot || {};
          const rooms = building.rooms || {};
          const size = building.size || {};
          const summary = property.summary || {};

          return NextResponse.json({
            address: property.address?.oneLine || address,
            bedrooms:
              rooms.beds?.toString() || rooms.bedrooms?.toString() || undefined,
            bathrooms:
              rooms.bathsTotal?.toString() ||
              rooms.bathsFull?.toString() ||
              undefined,
            sqft:
              size.livingSize || size.bldgSize || size.universalSize || undefined,
            lotSize: lot.lotSize1
              ? `${lot.lotSize1} sq ft`
              : lot.depth && lot.frontage
                ? `${lot.depth}x${lot.frontage}`
                : undefined,
            yearBuilt: building.yearBuilt || summary.yearBuilt || undefined,
            propertyType: summary.proptype || summary.propClass || undefined,
            found: true,
          });
        }
      }
    }

    return NextResponse.json({ address, found: false });
  } catch (error) {
    console.error("Property lookup error:", error);
    return NextResponse.json({ address: "", found: false });
  }
}
