import { UploadedArtwork } from "@/types";
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

const getArtworkUploadFile = (uri: string, index: number) => {
  const cleanUri = uri.split("?")[0].toLowerCase();
  const extension = cleanUri.endsWith(".jpg") || cleanUri.endsWith(".jpeg")
    ? "jpg"
    : cleanUri.endsWith(".tif") || cleanUri.endsWith(".tiff")
      ? "tiff"
      : "png";

  const mimeType = extension === "jpg"
    ? "image/jpeg"
    : extension === "tiff"
      ? "image/tiff"
      : "image/png";

  return {
    uri,
    name: `artwork-${index}.${extension}`,
    type: mimeType,
  };
};

export const useCarouselApi = () => {
  const { mutate } = useApiMutate();

  const saveDraft = async (payload: CreateCarouselPayload) => {
    try {
      const formData = new FormData();
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
      const artworksData = payload.artworks.map((artwork, index) => ({
        title: artwork.title,
        artist: artwork.artist,
        height: artwork.height,
        width: artwork.width,
        yearOfCreation: artwork.yearOfCreation,
        purchasePrice: artwork.purchasePrice,
        displayOrder: index,
      }));
      formData.append("artworks", JSON.stringify(artworksData));

      for (let i = 0; i < payload.artworks.length; i++) {
        const artwork = payload.artworks[i];

        if (artwork.uri) {
          formData.append("artworkImages", getArtworkUploadFile(artwork.uri, i) as any);
        }
      }

      return await mutate("/carousels/draft", {
        method: "POST",
        dataType: "formdata",
        payload: formData,
      });
    } catch (error) {
      console.error("Save draft error:", error);
      return {
        data: null,
        error: "Failed to save carousel draft",
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
        formData.append("tag", payload.tag);
      }
      if (payload.description !== undefined) {
        formData.append("description", payload.description);
      }

      if (payload.artworks) {
        const artworksData = payload.artworks.map((artwork, index) => ({
          id: artwork.id || undefined,
          imageUrl: artwork.imageUrl || undefined,
          title: artwork.title,
          artist: artwork.artist,
          height: artwork.height,
          width: artwork.width,
          yearOfCreation: artwork.yearOfCreation,
          purchasePrice: artwork.purchasePrice,
          displayOrder: index,
        }));

        console.log("Frontend - Sending artworks:", artworksData);
        formData.append("artworks", JSON.stringify(artworksData));

        for (let i = 0; i < payload.artworks.length; i++) {
          const artwork = payload.artworks[i];

          if (artwork.uri) {
            console.log(
              `Frontend - Appending file for artwork: ${artwork.title}`
            );
            formData.append("artworkImages", getArtworkUploadFile(artwork.uri, i) as any);
          }
        }
      }

      return await mutate(`/carousels/draft/${carouselId}`, {
        method: "PATCH",
        dataType: "formdata",
        payload: formData,
      });
    } catch (error) {
      console.error("Update draft error:", error);
      return {
        data: null,
        error: "Failed to update carousel draft",
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
    return mutate(`/carousels/draft/${carouselId}`, {
      method: "DELETE",
    });
  };

  const deleteCarousel = async (carouselId: string) => {
    return mutate(`/carousels/${carouselId}`, {
      method: "DELETE",
    });
  };

  const moveToDraft = async (carouselId: string) => {
    return mutate(`/carousels/${carouselId}/move-to-draft`, {
      method: "PATCH",
    });
  };

  const publishDraft = async (carouselId: string) => {
    try {
      return await mutate(`/carousels/draft/${carouselId}/publish`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Publish draft error:", error);
      return {
        data: null,
        error: "Failed to publish carousel",
        isLoading: false,
      };
    }
  };

  const scheduleCarousel = async (
    carouselId: string,
    scheduledPublishDate: Date
  ) => {
    try {
      return await mutate(`/carousels/${carouselId}/schedule`, {
        method: "PATCH",
        payload: {
          scheduledPublishDate: scheduledPublishDate.toISOString(),
        },
      });
    } catch (error) {
      console.error("Schedule carousel error:", error);
      return {
        data: null,
        error: "Failed to schedule carousel",
        isLoading: false,
      };
    }
  };

  const publishScheduled = async (carouselId: string) => {
    try {
      return await mutate(`/carousels/${carouselId}`, {
        method: "PATCH",
        payload: {
          status: "active",
          scheduledPublishDate: null,
        },
      });
    } catch (error) {
      console.error("Publish scheduled carousel error:", error);
      return {
        data: null,
        error: "Failed to publish carousel",
        isLoading: false,
      };
    }
  };

  return {
    saveDraft,
    updateDraft,
    getDraft,
    getAllDrafts,
    deleteDraft,
    deleteCarousel,
    moveToDraft,
    publishDraft,
    scheduleCarousel,
    publishScheduled,
  };
};
