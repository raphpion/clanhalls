import { Loader2, LucideProps } from 'lucide-react';
import { cn } from '$ui/utils';

type Props = Pick<LucideProps, 'size' | 'className'>;

function Loading({ size = 32, className, ...props }: Props) {
  const styles = cn('animate-spin', className);

  return <Loader2 {...props} size={size} className={styles} />;
}

export default Loading;
