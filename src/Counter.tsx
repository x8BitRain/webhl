import { Fragment, h } from "preact";
import { useState } from "preact/hooks";

type CounterProps = {
  count?: number;
};

export function Counter({ count = 0 }: CounterProps) {
  const [cnt, setCnt] = useState(count);
  return (
    <>
      <p>{cnt}</p>
      <button onClick={() => setCnt((prev) => prev + 1)} type="button">
        Update
      </button>
    </>
  );
}
