import { create } from "zustand";
import axios from "axios";
import { Platform } from "react-native";
import { BASE_URL } from "../api/apiClient";
import { getToken } from "../utils/storage";

const useFileUploadStore = create((set, get) => ({
  uploadedFiles: [],
  fileIdMap: {},
  uploading: false,

  // Add file to state with initial progress
  addFiles: (newFiles) => {
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, ...newFiles],
      uploading: true,
    }));
  },

  // Update file progress
  updateFileProgress: (fileName, progress) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.name === fileName ? { ...file, progress } : file
      ),
    }));
  },

  // Update file status and ID after successful upload
  setFileSuccess: (fileName, fileId, uri) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.name === fileName
          ? { ...file, status: "success", progress: 100, fileId }
          : file
      ),
      fileIdMap: {
        ...state.fileIdMap,
        [fileName]: { id: fileId, uri },
      },
    }));
  },

  // Set file error status
  setFileError: (fileName) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.name === fileName
          ? { ...file, status: "error", progress: 0 }
          : file
      ),
    }));
  },

  // Remove file from state only
  removeFile: (fileName) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter(
        (file) => file.name !== fileName
      ),
    }));
  },

  // API Actions
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      const token = await getToken();
      let fileToUpload;

      // Handle file preparation based on platform
      if (Platform?.OS !== "web") {
        const fileExtension = file.uri.split(".").pop();
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";

        fileToUpload = {
          uri:
            Platform.OS === "android"
              ? file.uri
              : file.uri.replace("file://", ""),
          type: mimeType,
          name: file.name,
        };
      } else {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        fileToUpload = blob;
      }

      formData.append("files", fileToUpload);

      // Base headers for all requests
      const headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      };

      // Add authorization header only if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers,
      });

      if (response.status === 200) {
        const fileId = response.data[0].id;

        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((f) =>
            f.name === file.name
              ? { ...f, status: "success", progress: 100, fileId }
              : f
          ),
          fileIdMap: {
            ...state.fileIdMap,
            [file.name]: { id: fileId, uri: file.uri },
          },
          uploading: false,
        }));

        return fileId;
      } else {
        get().setFileError(file.name);
        set({ uploading: false });
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      get().setFileError(file.name);
      set({ uploading: false });
      return null;
    }
  },

  deleteFile: async (fileId) => {
    try {
      const token = await getToken();

      // Base headers for all requests
      const headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };

      // Add authorization header only if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("Delete request URL:", `${BASE_URL}/upload/files/${fileId}`);

      const response = await axios.delete(
        `${BASE_URL}/upload/files/${fileId}`,
        {
          headers,
          withCredentials: true,
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      return false;
    }
  },

  // Get all current file IDs
  getAllFileIds: () => {
    const { uploadedFiles } = get();
    // Only return IDs of successfully uploaded files
    return uploadedFiles
      .filter((file) => file.status === "success")
      .map((file) => file.fileId)
      .filter((id) => typeof id === "number");
  },

  // Reset store
  reset: () => {
    set({
      uploadedFiles: [],
      fileIdMap: {},
      uploading: false,
    });
  },

  clearFiles: () =>
    set({
      uploadedFiles: [],
      fileIdMap: {},
      uploading: false,
    }),

  updateFileStatus: (fileName, status) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.name === fileName ? { ...file, status } : file
      ),
    })),
}));

export default useFileUploadStore;
