import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyStatus from "@/components/EmptyStatus";
import { TPost } from "@/types";
import { getAllPosts, getLatestPosts } from "@/lib";
import { useAppwrite } from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatest } = useAppwrite(getLatestPosts);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard {...item} />}
        ListHeaderComponent={() => (
          <View className="my-4 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-2">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput
              value={undefined}
              placeholder="Search for a video topic..."
              handleChangeText={function (e: string): void {
                throw new Error("Function not implemented.");
              }}
            />
            <View className="w-full flex-1 pb-8">
              <Text className="text-gray-100 text-lg font-pregular ">
                Trending Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyStatus
            title="No Videos Found"
            subtitle="Be the first to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
