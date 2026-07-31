const icons: Record<string, string> = {
  home: '⌂', rules: '▤', play: '▶', friends: '♟', profile: '●',
  settings: '⚙', search: '⌕', token: '◆', flame: '♨', trophy: '♛',
  ai: '✦', online: '◎', local: '◫', tournament: '♜', back: '‹',
  bell: '♢', chevron: '›', check: '✓',
  shop: '▰', casino: '♛',
};

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`icon ${className}`} aria-hidden="true">{icons[name] ?? name}</span>;
}
