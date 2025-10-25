import { mergeProps } from "solid-js";

export default function HTMLNumber(props: {
  value: number;
  money?: boolean;
  precision?: number;
  highlight?: boolean;
  fill?: boolean;
}) {
  const merged = mergeProps(
    { highlight: false, money: false, precision: 2, fill: true },
    props,
  );
  const getClassList: () => Record<string, boolean> = () => ({
    fill: merged.fill,
    money: merged.money,
    positive: merged.highlight && merged.value > 0,
    negative: merged.highlight && merged.value < 0,
  });

  return (
    <span classList={getClassList()}>
      <span>
        {merged.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </span>
  );
}
