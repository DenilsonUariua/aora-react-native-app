import {
  Query,
  Databases,
  Client,
  Account,
  ID,
  Avatars,
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

// Init your React Native SDK
export const client = new Client();

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

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
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
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
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Current User fetch error", error);
  }
};
