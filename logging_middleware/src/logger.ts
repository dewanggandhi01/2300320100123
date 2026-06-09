import axios from "axios";
import dotenv from "dotenv";

import { LOG_API } from "./constants";
import {
  StackType,
  LogLevel,
  PackageType,
} from "./types";

dotenv.config();

export async function Log(
  stack: StackType,
  level: LogLevel,
  packageName: PackageType,
  message: string
) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Logging failed:",
      error?.response?.data || error.message
    );
  }
}