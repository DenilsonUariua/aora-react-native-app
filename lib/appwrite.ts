import { CreateFormProps } from "@/app/(tabs)/create";
import {
  Query,
  Databases,
  Client,
  Account,
  ID,
  Avatars,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.den.aora",
  projectId: "6641bc0b000407ac3c64",
  databaseId: "6641bef0002440ea5b87",
  userCollectionId: "6641bf4f00119b65004e",
  videoCollectionId: "6641bfa10013aca446a1",
  storageId: "6641c264001cf0b5f3df",
};

const {
  storageId,
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
} = appwriteConfig;

// Init your React Native SDK
export const client = new Client();

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    const avatarUrl = await avatars.getInitials(newAccount.username);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username: name, avatar: avatarUrl }
    );

    await signIn(email, password);
    return newUser;
  } catch (error: any) {
    console.error("Error", error);
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created", session);

    return session;
  } catch (error: any) {
    console.error("Sign in error", error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Current User fetch error", error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const searchPosts = async (query: string | undefined) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getUserPosts = async (userId: string | undefined) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error as any);
  }
};
export const likeVideo = async (
  userId: string | undefined,
  liked: string[],
  videoId: string
) => {
  try {
    liked.push(userId!);
    const result = await databases.updateDocument(
      databaseId,
      videoCollectionId,
      videoId,
      { liked }
    );

    return result;
  } catch (error) {
    console.error("Error liking video", error);
    throw new Error(error as any);
  }
};

export const getSavedPosts = async (userId: string | undefined) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.contains("liked", [userId]),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getFilePreview = async (
  fileId: string,
  fileType: "image" | "video"
) => {
  let fileUrl;
  try {
    if (fileType === "video") {
      fileUrl = await storage.getFileView(storageId, fileId);
    } else if (fileType === "image") {
      fileUrl = await storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) {
      throw new Error("No file url");
    }
    return fileUrl;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const uploadFile = async (file: any, type: "image" | "video") => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createVideo = async (form: CreateFormProps) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
};
