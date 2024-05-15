import EmptyStatus from "@/components/EmptyStatus";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getSavedPosts, searchPosts } from "@/lib";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false)
  const { data: posts, refetch } = useAppwrite(() =>
    getSavedPosts(user?.$id as string)
  );

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
          <View className="my-4 px-4">
      
            <Text className="text-2xl font-psemibold text-white">Saved</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={""}
                placeholder="Search for a video topic..."
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyStatus
            title="No Videos Found"
            subtitle={`No videos saved`}
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

export default Bookmark;
