export function Toggle({ checked, onChange, label }: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button type="button" className={checked ? 'toggle on' : 'toggle'} onClick={onChange}
      role="switch" aria-checked={checked} aria-label={label}>
      <span />
    </button>
  );
}
