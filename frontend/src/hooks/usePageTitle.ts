import { useEffect } from 'react';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Clan Halls` : 'Clan Halls';
  }, [title]);
}

export default usePageTitle;
