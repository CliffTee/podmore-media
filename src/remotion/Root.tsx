import { Composition } from "remotion";
import { PortfolioCommandLaunch } from "./PortfolioCommandLaunch";

export const RemotionRoot = () => {
  return (
    <Composition
      id="PortfolioCommandLaunch"
      component={PortfolioCommandLaunch}
      durationInFrames={1260}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        productName: "Portfolio Command",
        tagline: "Track, research, and act on the stocks that matter.",
      }}
    />
  );
};
