import EmptyStatus from "@/components/EmptyStatus";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { searchPosts } from "@/lib";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  FlatList,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(query as string)
  );
  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard {...item} />}
        ListHeaderComponent={() => (
          <View className="my-4 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={query as string}
                placeholder="Search for a video topic..."
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyStatus
            title="No Videos Found"
            subtitle={`No videos found for this search query: ${query}`}
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
