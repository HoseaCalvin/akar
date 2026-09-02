import { redirect } from "next/navigation";

export default function MonitorIndex() {
  redirect("/private/monitor/inventory");
}
