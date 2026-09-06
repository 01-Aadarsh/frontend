export function ChatComposer({
  input,
  onInputChange,
  onSend,
  sending,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="flex w-full items-end gap-2"
    >
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={1}
        placeholder="Ask a question..."
        className="max-h-40 flex-1 resize-none rounded-2xl bg-neu-bg px-4 py-2.5 text-sm text-neu-text shadow-neuInset outline-none placeholder:text-neu-sub"
      />
      <button
        type="submit"
        disabled={sending || !input.trim()}
        className="shrink-0 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-neuSm transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
