import OverpassProvider from "./OverpassProvider";
import ViewStateProvider from "./ViewStateProvider";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <ViewStateProvider>
      <OverpassProvider>{children}</OverpassProvider>
    </ViewStateProvider>
  );
}
