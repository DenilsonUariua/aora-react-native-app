import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type FormFieldProps = {
  title: string;
  placeholder?: string;
  value: string | undefined;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: "text" | "email-address" | "password";
};
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${otherStyles} space-y-2`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="rounded-2xl focus:border-secondary items-center flex-row border-2 border-gray-800 w-full h-16 px-4 bg-black-100">
        <TextInput
          className="flex-1 text-white font-pmedium text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              className="contain w-7 h-7"
              source={showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
