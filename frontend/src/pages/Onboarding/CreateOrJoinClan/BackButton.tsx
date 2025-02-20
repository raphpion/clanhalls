import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '$ui/button';

type Props = {
  onClick: () => void;
};

function BackButton({ onClick }: Props) {
  return (
    <Button variant="link" onClick={onClick} className="mb-4 px-0">
      <ArrowLeftIcon size={16} className="mr-2 inline" />
      Back
    </Button>
  );
}

export default BackButton;
