import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { TPost } from "@/types";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

type TrendingProps = {
  posts: TPost[];
};

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: TPost;
  item: TPost;
}) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={
        (activeItem as any) === item.$id ? (zoomIn as any) : (zoomOut as any)
      }
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-xl"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.5}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: activeItem.thumbnail }}
            className="w-52 h-72 rounded-md  my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            className="w-12 h-12 absolute"
            source={icons.play}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default function Trending({ posts }: TrendingProps) {
  const [activeItem, setActiveItem] = useState(posts[0]);
  const viewableItemsChange = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 170 }}
      horizontal
    />
  );
}
