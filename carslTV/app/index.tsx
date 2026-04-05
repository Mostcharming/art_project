import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D4A574", dark: "#5C4033" }}
      headerImage={
        <ThemedText className="text-9xl text-center -bottom-10">🦁</ThemedText>
      }
    >
      {/* Title Section */}
      <ThemedView className="gap-2">
        <ThemedText type="title" className="text-4xl">
          The Majestic Lion
        </ThemedText>
        <ThemedText className="text-base opacity-70">
          King of the African Savanna
        </ThemedText>
      </ThemedView>

      {/* About Section */}
      <ThemedView className="gap-3 mb-6">
        <ThemedText type="subtitle" className="text-2xl mb-2">
          About Lions
        </ThemedText>
        <ThemedText className="text-base leading-6">
          Lions are the largest living cats and an iconic symbol of power and
          courage. These magnificent creatures are highly social animals, living
          together in prides that can include up to 30 individuals. They are
          known for their distinctive golden-tan fur and the magnificent mane of
          the male lions.
        </ThemedText>
      </ThemedView>

      {/* Characteristics Section */}
      <ThemedView className="gap-3 mb-6">
        <ThemedText type="subtitle" className="text-2xl mb-2">
          Characteristics
        </ThemedText>
        {[
          {
            title: "Size",
            desc: "Males can weigh up to 190 kg and measure 2.5 meters in length",
          },
          {
            title: "Mane",
            desc: "The iconic mane serves as protection and signals dominance",
          },
          {
            title: "Strength",
            desc: "Among the strongest big cats with a bite force of 650 PSI",
          },
          {
            title: "Lifespan",
            desc: "Live 10-14 years in the wild, up to 20 years in captivity",
          },
        ].map((item, idx) => (
          <ThemedView key={idx} className="p-3 rounded-lg mb-2 gap-1">
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText className="text-sm opacity-70">{item.desc}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Behavior Section */}
      <ThemedView className="gap-3 mb-6">
        <ThemedText type="subtitle" className="text-2xl mb-2">
          Social Behavior
        </ThemedText>
        <ThemedText className="text-base leading-6">
          Lions are unique among cats for their highly social structure. They
          live in prides where females do most of the hunting while males defend
          the territory. These apex predators hunt large herbivores and can
          sleep up to 20 hours a day, conserving energy for their hunts.
        </ThemedText>
      </ThemedView>

      {/* Conservation Section */}
      <ThemedView className="p-4 rounded-xl mb-6 border-l-4">
        <ThemedText type="subtitle" className="text-xl mb-2">
          Conservation Status
        </ThemedText>
        <ThemedText className="text-sm leading-5">
          Lions are classified as Vulnerable. Their population has declined by
          half in the last 25 years due to habitat loss, conflict with humans,
          and poaching. Conservation efforts are crucial to ensure these
          magnificent creatures thrive for generations to come.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
