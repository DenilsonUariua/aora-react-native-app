import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

type CustomButtonProps = {
  title: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`${containerStyles} ${
        isLoading ? "opacity-50" : ""
      } bg-secondary rounded-xl min-h-[62px] justify-center items-center`}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text className={`${textStyles} text-primary`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
