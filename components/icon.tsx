const paths: Record<string, string> = {
 grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 book: 'M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-2-10 1v15',
 scan: 'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M7 12h10 M12 7v10',
 spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
 studio: 'm4 20 4-1 12-12-3-3L5 16l-1 4Z M14 7l3 3 M4 4v5 M1.5 6.5h5',
 folder: 'M3 7V4h6l2 3h10v13H3V7Z', arrow: 'M4 12h16 M14 6l6 6-6 6',
 check: 'm5 12 4 4L19 6', menu: 'M4 6h16 M4 12h16 M4 18h16',
 cap: 'm2 9 10-5 10 5-10 5L2 9Z M6 11v6c4 3 8 3 12 0v-6 M22 9v7',
 bulb: 'M9 18h6 M9 21h6 M8 14a7 7 0 1 1 8 0l-1 2H9l-1-2Z',
 upload: 'M12 16V3 m-5 5 5-5 5 5 M4 16v5h16v-5',
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.spark} /></svg>;
}
