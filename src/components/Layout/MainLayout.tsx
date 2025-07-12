import { Box } from '@mantine/core';
import { LeftNavigation } from '../Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box style={{ display: 'flex', minHeight: '100vh' }}>
      <LeftNavigation />
      <Box
        style={{
          marginLeft: 64,
          flex: 1,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
