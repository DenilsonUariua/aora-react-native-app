export type TPost = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $updatedAt: string;
  creator: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $updatedAt: string;
    accountId: string;
    avatar: string;
    email: string;
    username: string;
  };
  prompt: string;
  thumbnail: string;
  title: string;
  video: string;
};
