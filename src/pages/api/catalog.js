import { createApiClient } from "@/services/apis";
import axios from "axios";

export async function fetchCatalogLimitApi({ limit, page }) {
  const apiClient = createApiClient("json"); 

  try {
    const response = await apiClient.get(
      "/institute/catelog/cateLimit", 
      {
        params: { limit, page },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching catalog limit data:", error);
    throw error;
  }
}
