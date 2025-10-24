import { mergeProps } from "solid-js";

export default function HTMLNumber(props: {
  value: number;
  money?: boolean;
  precision?: number;
}) {
  props = mergeProps({ money: false, precision: 2 }, props);

  return (
    <div
      classList={{
        money: props.money,
        positive: props.value > 0,
        negative: props.value < 0,
      }}
    >
      <span>
        {props.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}
