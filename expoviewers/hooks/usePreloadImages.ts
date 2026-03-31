import { useAssets } from "expo-asset";
import { useEffect, useState } from "react";

// Cache to store loaded assets for reuse
const assetCache = new Map<string, string>();

export function usePreloadImages(imagePaths: number[]) {
  const [assets, isLoading] = useAssets(imagePaths);
  const [imageUris, setImageUris] = useState<string[]>([]);

  useEffect(() => {
    if (assets && assets.length === imagePaths.length) {
      const uris = assets.map((asset) => {
        const key = asset.uri;
        if (!assetCache.has(key)) {
          assetCache.set(key, asset.uri);
        }
        return assetCache.get(key) || asset.uri;
      });
      setImageUris(uris);
    }
  }, [assets, imagePaths.length]);

  return { imageUris, isLoading };
}
