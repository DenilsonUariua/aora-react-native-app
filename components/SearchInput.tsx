import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

type FormFieldProps = {
  title?: string;
  placeholder?: string;
  initialQuery?: string | undefined;
  otherStyles?: string;
  keyboardType?: "text" | "email-address" | "password";
};
const SearchInput = ({ title, initialQuery, placeholder }: FormFieldProps) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View className="rounded-2xl focus:border-secondary items-center flex-row border-2 border-gray-800 w-full h-16 px-4 bg-black-100">
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5 "
        value={query}
        placeholder={placeholder}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database."
            );
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else router.push(`/search/${query}`);
        }}
      >
        <Image className="contain w-5 h-5" source={icons.search} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
