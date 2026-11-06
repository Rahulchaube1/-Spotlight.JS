type ExampleButtonProps = {
  id: string;
  onClick: () => void;
  text: string;
};

export function ExampleButton(props: ExampleButtonProps) {
  const { id, onClick, text } = props;

  return (
    <button
      id={id}
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 font-medium text-foreground md:text-base lg:text-lg shadow-sm transition-all duration-150 hover:bg-muted hover:border-primary active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      { text }
    </button>
  );
}