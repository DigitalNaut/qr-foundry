import { ReactNode } from "react";
import type * as rdd from "react-device-detect";

export type DeviceProps = {
  children: (props: typeof rdd) => ReactNode;
};
export type DeviceDetectorProps = {
  document: any;
  styles: any;
  filename: string;
};
