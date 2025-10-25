import { mergeProps } from "solid-js";

const defaultHeight = 60;
const defaultWidth = 217;

export default function Donate(props: { height?: number }) {
  const merged = mergeProps({ height: 30 }, props);

  const getStyles = () => {
    const height = merged.height;
    const ratio = Math.max(1, height) / defaultHeight;
    const width = Math.floor(defaultWidth * ratio);
    return { width: `${width}px`, height: `${height}px` };
  };
  return (
    <a
      title="donate"
      href="https://www.buymeacoffee.com/samueldavis"
      target="_blank"
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style={getStyles()}
      />
    </a>
  );
  return (
    <script
      type="text/javascript"
      src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
      data-name="bmc-button"
      data-slug="samueldavis"
      data-color="#FFDD00"
      data-emoji="☕"
      data-font="Cookie"
      data-text="Buy me a coffee"
      data-outline-color="#000000"
      data-font-color="#000000"
      data-coffee-color="#ffffff"
    />
  );
}
