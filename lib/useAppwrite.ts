import { TPost } from "@/types";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useAppwrite = (fn: (value?: any) => any) => {
  const [data, setData] = useState<TPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await fn();
    setData(result);
    try {
    } catch (error: any) {
      console.error("Post fetching Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();
  return { data, isLoading, refetch };
};
