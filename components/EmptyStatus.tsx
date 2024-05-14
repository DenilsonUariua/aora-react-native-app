import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./customButton";
import { router } from "expo-router";

const EmptyStatus = ({ title = "Empty", subtitle = "No files" }) => {
  return (
    <View className="flex-col justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px] "
        resizeMode="contain"
      />
      <Text className="text-white text-2xl font-psemibold text-center mt-2">
        {title}
      </Text>
      <Text className="text-gray-100 font-pmedium text-sm">{subtitle}</Text>

      <CustomButton
        title={"Create video"}
        containerStyles="w-full my-5"
        textStyles="font-bold"
      />
    </View>
  );
};

export default EmptyStatus;
