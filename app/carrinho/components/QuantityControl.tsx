"use client";

type QuantityControlProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const QuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlProps) => {
  return (
    <div className="inline-flex h-10 items-center rounded-md border border-zinc-200">
      <button
        type="button"
        onClick={onDecrease}
        className="h-full w-10 text-xl"
        aria-label="Diminuir quantidade"
      >
        -
      </button>

      <span className="w-9 text-center text-sm font-bold">{quantity}</span>

      <button
        type="button"
        onClick={onIncrease}
        className="h-full w-10 text-xl"
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
