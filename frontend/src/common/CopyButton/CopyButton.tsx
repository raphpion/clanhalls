import { useEffect, useState } from 'react';

import { ClipboardCheckIcon, ClipboardCopyIcon } from 'lucide-react';

import { Button } from '$ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '$ui/tooltip';

type Props = {
  value: string;
};

function CopyButton({ value }: Props) {
  const [hasCopied, setHasCopied] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleClickCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    setIsTooltipOpen(true);
  };

  useEffect(() => {
    if (!hasCopied) return;

    const timeout = setTimeout(() => {
      setHasCopied(false);
      setIsTooltipOpen(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="px-3" onClick={handleClickCopy}>
            {hasCopied ? (
              <ClipboardCheckIcon size={20} />
            ) : (
              <ClipboardCopyIcon size={20} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {hasCopied ? 'Copied to clipboard!' : 'Copy to clipboard'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CopyButton;
