import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/customButton";
import { Link, router } from "expo-router";
import { createUser, signIn } from "@/lib";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();


  const submit = async () => {
    setIsSubmitting(true);
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await signIn(form.email, form.password);
      setUser(res)
      setIsLoggedIn(true)
      console.log("Sign In result:", res);
      
      setIsSubmitting(false);
      router.replace("/home");
    } catch (error: any) {
      console.error("Error", error);
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
      setForm({ email: "", password: "" });
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
            Log into Aora
          </Text>
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
            title={"Sign In"}
            handlePress={submit}
            containerStyles="mt-7"
            textStyles="font-bold"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href={"/sign-up"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
