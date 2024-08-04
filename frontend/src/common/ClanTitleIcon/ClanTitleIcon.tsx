import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLImageElement> & {
  title?: string;
};

function ClanTitleIcon({ title, ...props }: Props) {
  if (!title) return null;

  return (
    <img
      {...props}
      src={`/images/ranks/${title.replace(/\s+/g, '').toLowerCase()}.webp`}
      alt={title}
    />
  );
}

export default ClanTitleIcon;
