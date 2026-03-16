import { getBaseUrl } from "@/constants/api.config";
import { useUserStore } from "@/store/userStore";
import { UploadedArtwork } from "@/types";
import axios, { isAxiosError } from "axios";
import { useApiMutate } from "./useApiMutate";

export interface CreateCarouselPayload {
  name: string;
  tag?: string;
  country: string;
  description?: string;
  frameTimingSeconds: number;
  artworks: UploadedArtwork[];
}

export interface UpdateCarouselPayload {
  name?: string;
  tag?: string;
  country?: string;
  description?: string;
  frameTimingSeconds?: number;
  artworks?: UploadedArtwork[];
}

export const useCarouselApi = () => {
  const { mutate } = useApiMutate();
  const token = useUserStore((state) => state.token);

  // Helper function to convert image URI to Blob
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return response.blob();
  };

  const saveDraft = async (payload: CreateCarouselPayload) => {
    try {
      const formData = new FormData();

      // Add basic carousel fields
      formData.append("name", payload.name);
      formData.append("country", payload.country);
      formData.append(
        "frameTimingSeconds",
        payload.frameTimingSeconds.toString()
      );

      if (payload.tag) {
        formData.append("tag", payload.tag);
      }
      if (payload.description) {
        formData.append("description", payload.description);
      }

      // Add artworks as JSON array
      const artworksData = payload.artworks.map((artwork) => ({
        title: artwork.title,
        artist: artwork.artist,
        height: artwork.height,
        width: artwork.width,
        yearOfCreation: artwork.yearOfCreation,
        purchasePrice: artwork.purchasePrice,
      }));
      formData.append("artworks", JSON.stringify(artworksData));

      // Add image files
      for (let i = 0; i < payload.artworks.length; i++) {
        const artwork = payload.artworks[i];
        if (artwork.uri) {
          try {
            const blob = await uriToBlob(artwork.uri);
            formData.append("artworkImages", blob, `artwork-${i}.jpg`);
          } catch (error) {
            console.warn(`Failed to process image ${i}:`, error);
          }
        }
      }

      // Make API call with FormData
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/publishers/carousels/draft`;

      const response = await axios({
        method: "POST",
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      return {
        data: response.data,
        error: null,
        isLoading: false,
      };
    } catch (error) {
      let errorMessage = "Failed to save carousel draft";

      if (isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Error: ${error.response.status}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      console.error("Save draft error:", errorMessage);
      return {
        data: null,
        error: errorMessage,
        isLoading: false,
      };
    }
  };

  const updateDraft = async (
    carouselId: string,
    payload: UpdateCarouselPayload
  ) => {
    try {
      const formData = new FormData();

      if (payload.name) {
        formData.append("name", payload.name);
      }
      if (payload.country) {
        formData.append("country", payload.country);
      }
      if (payload.frameTimingSeconds) {
        formData.append(
          "frameTimingSeconds",
          payload.frameTimingSeconds.toString()
        );
      }
      if (payload.tag !== undefined) {
        formData.append("tag", payload.tag || "");
      }
      if (payload.description !== undefined) {
        formData.append("description", payload.description || "");
      }

      // Add artworks as JSON array if provided
      if (payload.artworks) {
        const artworksData = payload.artworks.map((artwork) => ({
          title: artwork.title,
          artist: artwork.artist,
          height: artwork.height,
          width: artwork.width,
          yearOfCreation: artwork.yearOfCreation,
          purchasePrice: artwork.purchasePrice,
        }));
        formData.append("artworks", JSON.stringify(artworksData));

        // Add image files
        for (let i = 0; i < payload.artworks.length; i++) {
          const artwork = payload.artworks[i];
          if (artwork.uri) {
            try {
              const blob = await uriToBlob(artwork.uri);
              formData.append("artworkImages", blob, `artwork-${i}.jpg`);
            } catch (error) {
              console.warn(`Failed to process image ${i}:`, error);
            }
          }
        }
      }

      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/publishers/carousels/draft/${carouselId}`;

      const response = await axios({
        method: "PATCH",
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      return {
        data: response.data,
        error: null,
        isLoading: false,
      };
    } catch (error) {
      let errorMessage = "Failed to update carousel draft";

      if (isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Error: ${error.response.status}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      console.error("Update draft error:", errorMessage);
      return {
        data: null,
        error: errorMessage,
        isLoading: false,
      };
    }
  };

  const getDraft = async (carouselId: string) => {
    return mutate(`/api/publishers/carousels/draft/${carouselId}`, {
      method: "GET",
    });
  };

  const getAllDrafts = async () => {
    return mutate("/api/publishers/carousels/drafts", {
      method: "GET",
    });
  };

  const deleteDraft = async (carouselId: string) => {
    return mutate(`/api/publishers/carousels/draft/${carouselId}`, {
      method: "DELETE",
    });
  };

  return {
    saveDraft,
    updateDraft,
    getDraft,
    getAllDrafts,
    deleteDraft,
  };
};
