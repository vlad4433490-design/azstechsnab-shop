export function ProductImage({ label = "АЗС" }: { label?: string }) {
  return (
    <div className="grid aspect-[4/3] w-full place-items-center rounded-md border border-brand-line bg-white">
      <div className="grid h-24 w-24 place-items-center rounded-md bg-[#eef2f7] text-3xl font-extrabold text-brand-blue">
        {label}
      </div>
    </div>
  );
}
