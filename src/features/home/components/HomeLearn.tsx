import { DestinationLink } from "@/components/ui/DestinationLink";

/** Promote the learn hub from home so alphabet and future lessons are one tap away. */
export function HomeLearn() {
  return <DestinationLink href="/learn" titleKey="learnTitle" subKey="learnSub" compact />;
}
