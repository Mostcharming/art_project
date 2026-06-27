export interface SelectedImage {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
}

export interface ArtworkForm {
  title: string;
  artist: string;
  height: string;
  width: string;
  yearOfCreation: string;
  purchasePrice: string;
}

export interface UploadedArtwork {
  id?: string;
  uri?: string;
  imageUrl?: string;
  displayOrder?: number;
  imageWidth: number;
  imageHeight: number;
  fileSize: number;
  title: string;
  artist: string;
  height: string;
  width: string;
  yearOfCreation: string;
  purchasePrice: string;
}
