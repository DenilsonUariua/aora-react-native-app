import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Client, Account, ID } from "react-native-appwrite";

import { images } from "../../constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/customButton";
import { Link, router } from "expo-router";
import { client, createUser, getCurrentUser } from "@/lib";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const account = new Account(client);

  // Register User
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    setIsSubmitting(true);
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all the fields");
      setIsSubmitting(false);
      return;
    }
    try {
      await createUser(form.email, form.password, form.username);
      const res = await getCurrentUser();
      setUser(res);
      setIsLoggedIn(true);
      setIsSubmitting(false);
      router.replace("/home");
    } catch (error: any) {
      console.log("Error", error);
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6 ">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Sign Up to Aora
          </Text>
          <FormField
            otherStyles="mt-4"
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            placeholder={""}
          />
          <FormField
            otherStyles="my-4"
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType={"email-address"}
            placeholder={""}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            keyboardType={"password"}
          />

          <CustomButton
            title={"Sign Up"}
            handlePress={submit}
            containerStyles="mt-7"
            textStyles="font-bold"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href={"/sign-in"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
