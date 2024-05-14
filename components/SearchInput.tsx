import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type FormFieldProps = {
  title?: string;
  placeholder?: string;
  value: string | undefined;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: "text" | "email-address" | "password";
};
const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <View className="rounded-2xl focus:border-secondary items-center flex-row border-2 border-gray-800 w-full h-16 px-4 bg-primary">
        <TextInput
          className="flex-1 text-white font-pregular text-base mt-0.5"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image className="contain w-5 h-5" source={icons.search} />
        </TouchableOpacity>
      </View>
  );
};

export default SearchInput;
