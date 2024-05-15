import FormField from "@/components/FormField";
import CustomButton from "@/components/customButton";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createVideo } from "@/lib";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CreateFormProps = {
  title: string;
  video: { uri: string } | null;
  thumbnail: { uri: string } | null;
  prompt: string;
  userId: string;
};
const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = useState<CreateFormProps>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    userId: user?.$id as string,
  });

  const openPicker = async (fileType: "image" | "video") => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        fileType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (fileType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (fileType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      return Alert.alert("Please fill in all the fields.");
    }
    setUploading(true);
    try {
      const result = await createVideo(form);

      Alert.alert("Success", "Post uploaded successfully.");
      router.push("/home");
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
        userId: user?.$id as string,
      });
    } catch (error: any) {
      console.error("Post create error: ", error);
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          otherStyles="mt-8"
          title={"Video Title"}
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
        />

        <View className="space-y-2 mt-7">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} className="h-1/2 w-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Video
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200">
                <Image source={icons.upload} className="h-5 w-5" />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          otherStyles="mt-7"
          title={"AI Prompt"}
          value={form.prompt}
          placeholder="The prompt you used to create the video."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
        />

        <CustomButton
          isLoading={uploading}
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          textStyles="font-bold"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
